import assert from "node:assert/strict";
import test from "node:test";
import { config } from "../src/domain/config.ts";
import { blankFilters, blankProfile, blankRegistration, createLocalRepository, createSeed, filterParticipants, parseState, STORAGE_KEY, ValidationError, validateRegistration } from "../src/domain/repository.ts";
import type { Registration, StoragePort } from "../src/domain/types.ts";

class MemoryStorage implements StoragePort {
  data = new Map<string, string>();
  blocked = false;
  getItem(key: string) { return this.data.get(key) ?? null; }
  setItem(key: string, value: string) { if (this.blocked) throw new Error("QuotaExceededError"); this.data.set(key, value); }
}
const registration = (): Registration => ({ name: "Marina Ensayo", email: "marina.ensayo@example.com", phone: "", municipality: "Mixco", programId: "prog-tec", consent: true });
const at = "2026-09-08T18:00:00.000Z";
function fixture() { const storage = new MemoryStorage(); let sequence = 0; return { storage, repo: createLocalRepository(storage, () => at, () => `test-${++sequence}`) }; }

test("carga las 12 muestras una sola vez sin inventar perfiles ni CV", () => {
  const { storage, repo } = fixture(); const state = repo.load();
  assert.equal(state.participants.length, 12);
  assert.equal(state.participants.filter(person => person.enrollment.status === "graduada").length, 3);
  assert.ok(state.participants.every(person => person.profile === null && person.profileSavedAt === null && person.history.length === 0));
  assert.deepEqual(createLocalRepository(storage).load(), state);
});

test("flujo completo: registro, perfil parcial, recarga, búsqueda, cambio e historial", () => {
  const { storage, repo } = fixture();
  const draft = { ...registration(), name: "  Marina Ensayo  ", email: " MARINA.ENSAYO@EXAMPLE.COM " };
  repo.saveRegistrationDraft(draft);
  assert.deepEqual(createLocalRepository(storage).load().registrationDraft, draft);
  const registered = repo.register(draft); const id = registered.activeParticipantId!;
  assert.equal(registered.participants.length, 13);
  assert.equal(registered.participants.at(-1)!.enrollment.status, "registrada");
  const profile = { ...blankProfile(), skills: "Organización de materiales", experience: "Apoyo comunitario ficticio", objective: "Aprender un oficio técnico" };
  repo.saveProfileDraft(id, profile);
  assert.deepEqual(createLocalRepository(storage).load().profileDrafts[id], profile);
  repo.saveProfile(id, profile);
  const reopened = createLocalRepository(storage, () => at, () => "event-2");
  const found = filterParticipants(reopened.load().participants, { ...blankFilters(), query: "MARINA", program: "prog-tec", status: "registrada" });
  assert.equal(found.length, 1); assert.equal(found[0].name, "Marina Ensayo"); assert.equal(found[0].email, "marina.ensayo@example.com");
  assert.equal(found[0].consentAt, at); assert.deepEqual(found[0].profile, profile);
  const updated = reopened.changeStatus(id, "en_acompanamiento", "registrada");
  const event = updated.participants.find(person => person.id === id)!.history[0];
  assert.deepEqual(event, { id: "event-2", enrollmentId: `enrollment-${id}`, from: "registrada", to: "en_acompanamiento", changedBy: "Equipo demo", changedAt: at });
  const persisted = createLocalRepository(storage).load().participants.find(person => person.id === id)!;
  assert.equal(persisted.enrollment.status, "en_acompanamiento"); assert.equal(persisted.history.length, 1);
  assert.deepEqual(persisted.profile, profile); assert.equal(updated.profileDrafts[id], undefined);
  assert.equal(filterParticipants(updated.participants, { ...blankFilters(), query: "marina.ensayo@example.com", status: "en_acompanamiento" }).length, 1);
});

test("campos requeridos, correo de demo, consentimiento y catálogos se validan en datos", () => {
  const { repo } = fixture();
  assert.deepEqual(Object.keys(validateRegistration(blankRegistration(), [])).sort(), ["name", "email", "municipality", "programId", "consent"].sort());
  for (const input of [{ ...registration(), email: "marina@" }, { ...registration(), email: "marina@real.test" }, { ...registration(), consent: false }, { ...registration(), municipality: "Fuera de catálogo" }, { ...registration(), programId: "inexistente" }, { ...registration(), name: " " }]) {
    assert.throws(() => repo.register(input), ValidationError);
    assert.equal(repo.load().participants.length, 12);
  }
  assert.deepEqual(validateRegistration({ ...registration(), phone: "0000 prueba" }, []), {});
});

test("duplicados por espacios/mayúsculas y doble envío no crean otro expediente", () => {
  const { repo } = fixture(); repo.register(registration());
  assert.throws(() => repo.register({ ...registration(), email: " MARINA.ENSAYO@EXAMPLE.COM " }), ValidationError);
  assert.throws(() => repo.register(registration()), ValidationError);
  assert.equal(repo.load().participants.length, 13);
});

test("errores conservan el borrador del registro", () => {
  const { repo } = fixture(); const draft = { ...registration(), consent: false };
  repo.saveRegistrationDraft(draft); assert.throws(() => repo.register(draft));
  assert.deepEqual(repo.load().registrationDraft, draft);
});

test("filtros combinados, acentos, vacío y persistencia de filtros", () => {
  const { repo, storage } = fixture(); const filters = { query: "BEATRIZ", program: "prog-tec", status: "graduada" };
  repo.saveFilters(filters);
  const state = createLocalRepository(storage).load(); assert.deepEqual(state.teamFilters, filters);
  assert.deepEqual(filterParticipants(state.participants, filters).map(person => person.id), ["p002"]);
  assert.equal(filterParticipants(state.participants, { ...blankFilters(), query: "simulacion" })[0].id, "p007");
  assert.equal(filterParticipants(state.participants, { ...filters, status: "registrada" }).length, 0);
  assert.equal(filterParticipants(state.participants, blankFilters()).length, 12);
});

test("cambio al mismo estado no agrega historial y estados fuera de catálogo se rechazan", () => {
  const { repo } = fixture(); repo.changeStatus("p001", "graduada", "graduada");
  assert.equal(repo.load().participants[0].history.length, 0);
  assert.throws(() => repo.changeStatus("p001", "contratada_automaticamente", "graduada"), /no está permitido/);
  assert.equal(repo.load().participants[0].enrollment.status, "graduada");
});

test("una restricción configurada se aplica sin cambiar las pantallas", () => {
  const { repo } = fixture(); const previous = config.transitions.interesada;
  config.transitions.interesada = ["registrada"];
  try { assert.throws(() => repo.changeStatus("p010", "graduada", "interesada"), /no está permitido/); repo.changeStatus("p010", "registrada", "interesada"); }
  finally { config.transitions.interesada = previous; }
});

test("dos vistas usan la última copia y rechazan una confirmación de estado desactualizada", () => {
  const { repo, storage } = fixture(); const second = createLocalRepository(storage);
  second.load(); repo.changeStatus("p010", "registrada", "interesada");
  assert.throws(() => second.changeStatus("p010", "graduada", "interesada"), /otra vista/);
  second.saveFilters({ ...blankFilters(), query: "Julia" });
  assert.equal(repo.load().participants.find(person => person.id === "p010")!.history.length, 1);
});

test("una lista vacía válida no se repuebla con muestras", () => {
  const { repo, storage } = fixture(); const empty = createSeed(); empty.participants = [];
  storage.setItem(STORAGE_KEY, JSON.stringify(empty)); assert.equal(repo.load().participants.length, 0);
  assert.equal(repo.register(registration()).participants.length, 1);
});

test("dos vistas guardan campos de borrador sin sobrescribir los otros campos", () => {
  const { repo, storage } = fixture(); const second = createLocalRepository(storage);
  repo.saveRegistrationDraft({ name: "Marina Ensayo" });
  second.saveRegistrationDraft({ email: "marina.ensayo@example.com" });
  assert.equal(repo.load().registrationDraft.name, "Marina Ensayo");
  assert.equal(repo.load().registrationDraft.email, "marina.ensayo@example.com");
  const id = repo.register(registration()).activeParticipantId!;
  repo.saveProfileDraft(id, { skills: "Organización ficticia" });
  second.saveProfileDraft(id, { experience: "Práctica de demostración" });
  assert.equal(repo.load().profileDrafts[id].skills, "Organización ficticia");
  assert.equal(repo.load().profileDrafts[id].experience, "Práctica de demostración");
});

test("reintentar un borrador tras recuperar almacenamiento conserva campos nuevos de otra vista", () => {
  const { repo, storage } = fixture(); repo.load(); storage.blocked = true;
  const retryDraft = () => repo.saveRegistrationDraft({ name: "Marina Ensayo" });
  assert.throws(retryDraft, /No se pudo guardar/);
  storage.blocked = false;
  createLocalRepository(storage).saveRegistrationDraft({ email: "marina.ensayo@example.com" });
  retryDraft();
  assert.equal(repo.load().registrationDraft.name, "Marina Ensayo");
  assert.equal(repo.load().registrationDraft.email, "marina.ensayo@example.com");
});

test("JSON corrupto, versión desconocida y formato roto no se reemplazan", () => {
  const { repo, storage } = fixture();
  for (const raw of ["{", '{"version":99}', JSON.stringify({ ...createSeed(), participants: [{ id: "roto" }] })]) {
    storage.setItem(STORAGE_KEY, raw); assert.throws(() => repo.load()); assert.equal(storage.getItem(STORAGE_KEY), raw);
    assert.throws(() => repo.register(registration())); assert.equal(storage.getItem(STORAGE_KEY), raw);
  }
});

test("lectura denegada muestra error; escritura denegada no altera la última copia", () => {
  assert.throws(() => createLocalRepository({ getItem() { throw new Error("SecurityError"); }, setItem() {} }).load(), /no permite leer/);
  const { repo, storage } = fixture(); repo.register(registration()); const before = storage.getItem(STORAGE_KEY);
  const id = repo.load().activeParticipantId!; storage.blocked = true;
  assert.throws(() => repo.saveProfile(id, { ...blankProfile(), skills: "Texto ficticio" }), /No se pudo guardar/);
  assert.throws(() => repo.changeStatus(id, "en_acompanamiento", "registrada"), /No se pudo guardar/);
  assert.throws(() => repo.register({ ...registration(), email: "otra@example.com" }), /No se pudo guardar/);
  assert.equal(storage.getItem(STORAGE_KEY), before);
});

test("iniciar otro registro conserva los expedientes y el perfil anterior", () => {
  const { repo } = fixture(); const id = repo.register(registration()).activeParticipantId!;
  repo.saveProfile(id, blankProfile()); const state = repo.startNewRegistration();
  assert.equal(state.activeParticipantId, null); assert.equal(state.participants.length, 13);
  assert.ok(state.participants.find(person => person.id === id)!.profileSavedAt);
});

test("perfil rechaza catálogos inexistentes, expedientes inexistentes y textos excesivos", () => {
  const { repo } = fixture();
  assert.throws(() => repo.saveProfile("missing", blankProfile()), /No se encontró/);
  assert.throws(() => repo.saveProfile("p001", { ...blankProfile(), education: "opción inventada" }), /listas disponibles/);
  assert.throws(() => repo.saveProfile("p001", { ...blankProfile(), skills: "x".repeat(3001) }), /3000/);
});

test("el lector rechaza expedientes duplicados", () => {
  const state = createSeed(); state.participants.push(state.participants[0]);
  assert.throws(() => parseState(JSON.stringify(state)), /duplicados/);
});
