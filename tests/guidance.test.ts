import assert from "node:assert/strict";
import test from "node:test";
import { companies, opportunities, salaryReference, scenarios } from "../src/data/labor-market.ts";
import { config } from "../src/domain/config.ts";
import { blankQuestionnaire, buildRoute, getJourney, initialAnswers, opportunityLinks, participantProfile, salaryByOccupation, validateQuestionnaire } from "../src/domain/guidance.ts";
import { blankProfile, createLocalRepository, createSeed, parseState, STORAGE_KEY } from "../src/domain/repository.ts";
import type { DemoState, Questionnaire, StepStatus, StoragePort } from "../src/domain/types.ts";
import { parsePilotSubmission, transformPilotSubmission, type PilotSubmissionInput } from "../src/domain/pilot.ts";

class MemoryStorage implements StoragePort {
  data = new Map<string, string>();
  blocked = false;
  getItem(key: string) { return this.data.get(key) ?? null; }
  setItem(key: string, value: string) {
    if (this.blocked) throw new Error("QuotaExceededError");
    this.data.set(key, value);
  }
}
const at = "2026-09-08T18:30:00.000Z";
function fixture() {
  const storage = new MemoryStorage();
  const repo = createLocalRepository(storage, () => at, () => "registered-test");
  repo.load();
  return { storage, repo };
}
const julia = (): Questionnaire => ({ ...scenarios.p010.answers });
const person = (state: DemoState, id: string) => state.participants.find(item => item.id === id)!;

test("cuestionario valida dinero y meses sin aceptar notación ambigua ni valores fuera de rango", () => {
  for (const expectedSalary of ["", "0.01", "4002.28", "100000"]) {
    assert.equal(validateQuestionnaire({ ...julia(), expectedSalary }), null, expectedSalary);
  }
  for (const expectedSalary of ["0", "-1", "100000.01", "4500.001", "4,500", "1e3", "Infinity", "NaN", " "]) {
    assert.match(validateQuestionnaire({ ...julia(), expectedSalary })!, /expectativa base/, expectedSalary);
  }
  for (const experienceMonths of ["", "0", "6", "600"]) {
    assert.equal(validateQuestionnaire({ ...julia(), experienceMonths }), null, experienceMonths);
  }
  for (const experienceMonths of ["-1", "601", "1.5", "1e2", "Infinity", " "]) {
    assert.match(validateQuestionnaire({ ...julia(), experienceMonths })!, /meses de experiencia/, experienceMonths);
  }
  assert.ok(validateQuestionnaire({ ...julia(), occupation: "ocupacion-inexistente" }));
  assert.ok(validateQuestionnaire({ ...julia(), cvUpdated: "quizás" }));
});

test("respuestas omitidas o reservadas no se interpretan como barreras ni necesidades declaradas", () => {
  const answers = { ...blankQuestionnaire(), cvUpdated: "Prefiero no responder", digitalAccess: "Prefiero no responder", wantsTraining: "Prefiero no responder", experienceHelp: "Prefiero no responder" };
  assert.equal(validateQuestionnaire(answers), null);
  const route = buildRoute(answers);
  assert.ok(route.some(step => step.id === "explorar"));
  assert.ok(route.every(step => !["digital", "formacion", "cv"].includes(step.id)));
  assert.equal(route.at(-1)!.id, "revision");
});

test("una ruta con todas las necesidades conserva la revisión humana dentro de cinco pasos", () => {
  const route = buildRoute({ ...julia(), digitalAccess: "Necesito apoyo", clarity: "Quiero explorar opciones" });
  assert.equal(route.length, 5);
  for (const id of ["digital", "explorar", "formacion", "cv"]) assert.ok(route.some(step => step.id === id));
  assert.equal(route.at(-1)!.id, "revision");
  assert.match(route.at(-1)!.owner, /Equipo/);
  assert.ok(route.every(step => step.reason && step.action && step.status === "pendiente"));
  assert.equal(new Set(route.map(step => step.id)).size, route.length);
});

test("Julia recibe preparación para primer empleo y Laura acompañamiento digital antes de su revisión", () => {
  const juliaRoute = buildRoute(julia());
  assert.ok(juliaRoute.some(step => step.id === "formacion" && /café/.test(step.title)));
  assert.ok(juliaRoute.some(step => step.id === "cv"));
  assert.ok(!juliaRoute.some(step => step.id === "digital"));
  const lauraRoute = buildRoute(scenarios.p012.answers);
  assert.equal(lauraRoute[0].id, "digital");
  assert.ok(lauraRoute.some(step => step.id === "cv"));
  assert.equal(lauraRoute.at(-1)!.id, "revision");
  assert.ok(lauraRoute.length <= 5);
});

test("los escenarios no materializan perfiles, consentimientos ni revisiones al consultarlos", () => {
  const state = createSeed();
  const original = JSON.stringify(state);
  assert.deepEqual(Object.keys(scenarios).sort(), state.participants.map(item => item.id).sort());
  for (const participant of state.participants) {
    assert.ok(participantProfile(participant));
    const journey = getJourney(state, participant)!;
    assert.equal(validateQuestionnaire(journey.answers), null);
    assert.equal(journey.steps.find(step => step.id === "revision")!.status, "pendiente");
    assert.equal(journey.reviewedAt, null);
    assert.equal(journey.reviewedBy, null);
    assert.equal(participant.profile, null);
    assert.equal(participant.consent, null);
  }
  assert.equal(JSON.stringify(state), original);
});

test("tener CV no permite afirmar que esté actualizado en un perfil guardado", () => {
  const participant = person(createSeed(), "p008");
  participant.profile = { ...blankProfile(), hasCV: "Sí", digitalBarrier: "No" };
  assert.equal(initialAnswers(participant).cvUpdated, "");
  assert.equal(initialAnswers(participant).occupation, "");
  participant.profile.hasCV = "No";
  assert.equal(initialAnswers(participant).cvUpdated, "No");
});

test("Julia conserva ambas oportunidades y ve diferencias salariales y experiencia por conversar", () => {
  const profile = scenarios.p010.profile;
  const links = opportunityLinks(julia(), profile);
  assert.deepEqual(links.map(link => link.opportunity.id), ["o01", "o02"]);
  assert.ok(links[0].pending.some(reason => reason.includes("Q497.72")));
  assert.ok(links[0].reasons.some(reason => reason.includes("0 meses declarados / 0 solicitados")));
  assert.ok(links[1].pending.some(reason => reason.includes("Solicita 6 meses; declaraste 0")));
  assert.ok(links.every(link => link.pending.includes("Confirmar condiciones con la empresa")));
  const highExpectation = opportunityLinks({ ...julia(), expectedSalary: "100000" }, profile);
  assert.deepEqual(highExpectation.map(link => link.opportunity.id), ["o01", "o02"]);
});

test("datos ausentes en una coincidencia permanecen por conversar y no se convierten en ceros", () => {
  const links = opportunityLinks({ ...julia(), expectedSalary: "", experienceMonths: "" }, null);
  assert.equal(links.length, 2);
  for (const link of links) {
    assert.ok(link.pending.includes("Experiencia por conversar"));
    assert.ok(link.pending.includes("Expectativa salarial por conversar"));
    assert.ok(link.pending.includes("Acordar disponibilidad y horario"));
    assert.ok(!link.reasons.some(reason => reason.includes("meses declarados")));
  }
  assert.deepEqual(opportunityLinks(blankQuestionnaire(), null), []);
});

test("la comparación salarial excluye expectativas de medio tiempo y respeta la selección de participantes", () => {
  const state = createSeed();
  const rows = salaryByOccupation(state, state.participants);
  const administration = rows.find(row => row.id === "administracion")!;
  const support = rows.find(row => row.id === "soporte")!;
  assert.equal(administration.participants, 1);
  assert.equal(administration.expectation, 4800);
  assert.equal(support.participants, 1);
  assert.equal(support.expectation, 5100);
  const partTime = state.participants.filter(item => ["p007", "p011"].includes(item.id));
  assert.ok(salaryByOccupation(state, partTime).every(row => row.participants === 0 && row.expectation === null));
  const selected = salaryByOccupation(state, [person(state, "p010")]).find(row => row.id === "barista")!;
  assert.equal(selected.participants, 1);
  assert.equal(selected.expectation, 4500);
  assert.ok(Math.abs(selected.offer! - 4401.14) < 0.001);
  const links = opportunityLinks(scenarios.p007.answers, scenarios.p007.profile);
  assert.ok(links.every(link => link.pending.includes("Comparar salarios cuando se acuerde la misma jornada")));
  assert.ok(links.every(link => !link.reasons.some(reason => reason.includes("expectativa base"))));
});

test("mercado ficticio mantiene relaciones válidas y separa salario base de incentivo en todas las referencias", () => {
  assert.equal(companies.length, 6);
  assert.equal(opportunities.length, 8);
  assert.equal(opportunities.reduce((sum, opportunity) => sum + opportunity.openings, 0), 19);
  assert.equal(salaryReference.rates.length, 6);
  for (const rate of salaryReference.rates) {
    assert.equal(rate.incentive, 250);
    assert.ok(Math.abs(rate.base + rate.incentive - rate.total) < 0.001);
  }
  for (const opportunity of opportunities) {
    assert.ok(companies.some(company => company.id === opportunity.companyId));
    const rate = salaryReference.rates.find(item => item.region === opportunity.region && item.activity === opportunity.economicActivity)!;
    assert.ok(rate);
    assert.ok(opportunity.baseMin >= rate.base);
    assert.ok(opportunity.baseMax >= opportunity.baseMin);
    assert.equal(opportunity.incentive, 250);
  }
  const initialBarista = opportunities.find(item => item.id === "o01")!;
  assert.equal(initialBarista.baseMin, 4002.28);
  assert.equal(Math.round((initialBarista.baseMin + initialBarista.incentive) * 100), 425228);
});

test("abrir una copia anterior v1 conserva su contenido exacto y los nuevos métodos preservan expedientes", () => {
  const { storage, repo } = fixture();
  const legacy = createSeed();
  legacy.registrationDraft.name = "Borrador anterior";
  legacy.profileDrafts.p008 = { ...blankProfile(), experience: "Texto que ya estaba guardado" };
  person(legacy, "p002").profile = { ...blankProfile(), objective: "Objetivo anterior" };
  person(legacy, "p002").profileSavedAt = at;
  const raw = JSON.stringify(legacy);
  storage.setItem(STORAGE_KEY, raw);
  assert.deepEqual(repo.load(), legacy);
  assert.equal(storage.getItem(STORAGE_KEY), raw);
  assert.equal(repo.load().journeys, undefined);
  repo.selectParticipant("p010");
  repo.saveQuestionnaireDraft("p010", { expectedSalary: "4600" });
  const updated = repo.load();
  assert.deepEqual(updated.participants, legacy.participants);
  assert.deepEqual(updated.registrationDraft, legacy.registrationDraft);
  assert.deepEqual(updated.profileDrafts, legacy.profileDrafts);
  assert.equal(updated.activeParticipantId, "p010");
});

test("editar un perfil materializa su ruta de demostración y conserva respuestas y progreso tras recarga", () => {
  const { storage, repo } = fixture();
  const before = repo.load();
  const previousJourney = getJourney(before, person(before, "p006"))!;
  const profile = { ...scenarios.p006.profile, objective: "Objetivo editado para la demostración" };
  repo.saveProfile("p006", profile);
  const reopened = createLocalRepository(storage).load();
  assert.deepEqual(reopened.journeys!.p006, previousJourney);
  assert.deepEqual(getJourney(reopened, person(reopened, "p006")), previousJourney);
  assert.deepEqual(person(reopened, "p006").profile, profile);
  assert.equal(person(reopened, "p006").consent, null);
  assert.deepEqual(person(reopened, "p006").enrollment, person(before, "p006").enrollment);
});

test("registro nuevo guarda borradores inválidos recuperables y crea su ruta solo con respuestas válidas", () => {
  const { storage, repo } = fixture();
  const registered = repo.register({ name: "Marta Demostración", email: "marta.demo@example.com", phone: "", municipality: "Mixco", consent: true });
  const id = registered.activeParticipantId!;
  assert.equal(getJourney(registered, person(registered, id)), null);
  repo.saveQuestionnaireDraft(id, { occupation: "barista", expectedSalary: "4,500" });
  const draft = createLocalRepository(storage).load().questionnaireDrafts![id];
  assert.equal(draft.expectedSalary, "4,500");
  const before = storage.getItem(STORAGE_KEY);
  assert.throws(() => repo.saveQuestionnaire(id, draft), /expectativa base/);
  assert.equal(storage.getItem(STORAGE_KEY), before);
  repo.saveQuestionnaireDraft(id, julia());
  const saved = repo.saveQuestionnaire(id, repo.load().questionnaireDrafts![id]);
  assert.equal(saved.questionnaireDrafts![id], undefined);
  assert.deepEqual(saved.journeys![id].answers, julia());
  assert.ok(saved.journeys![id].steps.every(step => step.status === "pendiente"));
  assert.equal(person(saved, id).enrollment.status, "registrada");
  assert.deepEqual(createLocalRepository(storage).load().journeys![id], saved.journeys![id]);
});

test("dos vistas conservan campos independientes del borrador de cuestionario", () => {
  const { storage, repo } = fixture();
  const second = createLocalRepository(storage);
  repo.saveQuestionnaireDraft("p010", { expectedSalary: "4700" });
  second.saveQuestionnaireDraft("p010", { experienceMonths: "2" });
  const draft = repo.load().questionnaireDrafts!.p010;
  assert.equal(draft.expectedSalary, "4700");
  assert.equal(draft.experienceMonths, "2");
  assert.equal(draft.occupation, "barista");
});

test("avance y revisión persisten; modificar avance o regenerar respuestas invalida la revisión previa", () => {
  const { storage, repo } = fixture();
  const originalParticipant = person(repo.load(), "p010");
  repo.saveQuestionnaire("p010", julia());
  repo.updateRouteStep("p010", "cv", "en_proceso");
  assert.equal(createLocalRepository(storage).load().journeys!.p010.steps.find(step => step.id === "cv")!.status, "en_proceso");
  let journey = repo.reviewRoute("p010").journeys!.p010;
  assert.equal(journey.reviewedAt, at);
  assert.equal(journey.reviewedBy, config.actor);
  assert.equal(journey.steps.find(step => step.id === "revision")!.status, "completado");
  journey = repo.updateRouteStep("p010", "cv", "completado").journeys!.p010;
  assert.equal(journey.reviewedAt, null);
  assert.equal(journey.reviewedBy, null);
  assert.equal(journey.steps.find(step => step.id === "revision")!.status, "pendiente");
  assert.equal(journey.updatedAt, at);
  repo.reviewRoute("p010");
  journey = repo.saveQuestionnaire("p010", { ...julia(), wantsTraining: "No" }).journeys!.p010;
  assert.equal(journey.reviewedAt, null);
  assert.equal(journey.reviewedBy, null);
  assert.ok(!journey.steps.some(step => step.id === "formacion"));
  assert.ok(journey.steps.every(step => step.status === "pendiente"));
  assert.deepEqual(person(repo.load(), "p010"), originalParticipant);
});

test("cambios de ruta rechazan expedientes, actividades y estados inexistentes sin alterar almacenamiento", () => {
  const { storage, repo } = fixture();
  repo.saveQuestionnaire("p010", julia());
  const before = storage.getItem(STORAGE_KEY);
  const invalidActions = [
    () => repo.selectParticipant("missing"),
    () => repo.saveQuestionnaireDraft("missing", {}),
    () => repo.saveQuestionnaire("missing", julia()),
    () => repo.reviewRoute("missing"),
    () => repo.updateRouteStep("p010", "actividad-inexistente", "completado"),
    () => repo.updateRouteStep("p010", "cv", "contratada" as StepStatus),
  ];
  for (const action of invalidActions) {
    assert.throws(action);
    assert.equal(storage.getItem(STORAGE_KEY), before);
  }
});

test("fallos al guardar cuestionario, avance o revisión conservan la última copia y permiten reintentar", () => {
  const { storage, repo } = fixture();
  repo.saveQuestionnaire("p010", julia());
  repo.saveQuestionnaireDraft("p010", { expectedSalary: "4700" });
  const before = storage.getItem(STORAGE_KEY);
  storage.blocked = true;
  const actions = [
    () => repo.selectParticipant("p010"),
    () => repo.saveQuestionnaireDraft("p010", { expectedSalary: "4800" }),
    () => repo.saveQuestionnaire("p010", { ...julia(), expectedSalary: "4800" }),
    () => repo.updateRouteStep("p010", "cv", "completado"),
    () => repo.reviewRoute("p010"),
    () => repo.saveProfile("p006", scenarios.p006.profile),
  ];
  for (const action of actions) {
    assert.throws(action, /No se pudo guardar/);
    assert.equal(storage.getItem(STORAGE_KEY), before);
  }
  storage.blocked = false;
  repo.saveQuestionnaire("p010", repo.load().questionnaireDrafts!.p010);
  assert.equal(repo.load().journeys!.p010.answers.expectedSalary, "4700");
  const unreadable = createLocalRepository({ getItem() { throw new Error("SecurityError"); }, setItem() { assert.fail("No debe escribir cuando no puede leer"); } });
  assert.throws(() => unreadable.saveQuestionnaireDraft("p010", {}), /no permite leer/);
  assert.throws(() => unreadable.reviewRoute("p010"), /no permite leer/);
});

test("una ruta persistida corrupta se rechaza sin reemplazar los datos originales", () => {
  const { storage, repo } = fixture();
  repo.saveQuestionnaire("p010", julia());
  const valid = repo.load();
  const badStatus = structuredClone(valid);
  badStatus.journeys!.p010.steps[0].status = "desconocido" as StepStatus;
  const duplicate = structuredClone(valid);
  duplicate.journeys!.p010.steps.push({ ...duplicate.journeys!.p010.steps[0] });
  const badDraft = { ...valid, questionnaireDrafts: { p010: { ...julia(), expectedSalary: 4500 } } };
  const badSalary = structuredClone(valid); badSalary.journeys!.p010.answers.expectedSalary = "NaN";
  for (const state of [badStatus, duplicate, badDraft, badSalary]) {
    const raw = JSON.stringify(state);
    assert.throws(() => parseState(raw), /no es compatible/);
    storage.setItem(STORAGE_KEY, raw);
    assert.throws(() => repo.reviewRoute("p010"), /no es compatible/);
    assert.equal(storage.getItem(STORAGE_KEY), raw);
  }
});

test("filtros del panel sobreviven navegación y guardados independientes de dos vistas", () => {
  const {storage,repo}=fixture();const other=createLocalRepository(storage);
  repo.saveDashboardFilters({program:"prog-tec",city:"Mixco"});
  other.saveDashboardFilters({occupation:"electricidad"});
  assert.deepEqual(other.load().dashboardFilters,{program:"prog-tec",city:"Mixco",occupation:"electricidad",status:""});
  assert.equal(other.load().participants.length,12);
});

test("guardar un perfil nuevo invalida la revisión de la ruta y conserva sus respuestas", () => {
  const {repo}=fixture();repo.reviewRoute("p010");
  const result=repo.saveProfile("p010",{...scenarios.p010.profile,availability:"Medio tiempo"});
  assert.equal(result.journeys!.p010.reviewedAt,null);
  assert.equal(result.journeys!.p010.steps.find(step=>step.id==="revision")!.status,"pendiente");
  assert.deepEqual(result.journeys!.p010.answers,julia());
});

test("el piloto transforma respuestas en una ruta explicable sin crear una nota de empleabilidad", () => {
  const input: PilotSubmissionInput = {
    participantId:"pilot-1",name:"Persona Piloto",email:"persona.piloto@example.com",municipality:"Mixco",programId:"prog-tec",consentAt:at,
    profile:{...scenarios.p010.profile,availability:""},
    questionnaire:{...scenarios.p010.answers,clarity:"Quiero explorar opciones",digitalAccess:"Necesito apoyo"},
    routeSteps:[{title:"Crear mi CV",status:"pendiente"},{title:"Revisión del equipo",status:"pendiente"}],
  };
  const parsed = parsePilotSubmission(input);
  const result = transformPilotSubmission(parsed);
  assert.equal(result.routeCode,"A");
  assert.equal(result.nextAction,"Crear mi CV");
  assert.equal(result.documentStatus,"CV por crear o revisar");
  assert.ok(result.supportSignals.includes("Objetivo laboral por explorar"));
  assert.ok(result.supportSignals.includes("Acompañamiento digital"));
  assert.throws(()=>parsePilotSubmission({...input,email:"correo@real.test"}),/correo ficticio/);
});
