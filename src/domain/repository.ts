import demo from "../data/demo.json" with { type: "json" };
import { config } from "./config.ts";
import { blankPsychometric, blankQuestionnaire, buildRoute, getJourney, initialAnswers, participantProfile, validateQuestionnaire } from "./guidance.ts";
import type { CvData, Diagnosis, DemoRepository, DemoState, FieldErrors, Participant, Profile, PsychometricAnswers, Questionnaire, Registration, StoragePort, TeamFilters } from "./types.ts";

export const STORAGE_KEY = "talentia.demo.v1";
export const blankRegistration = (): Registration => ({ name: "", email: "", phone: "", municipality: "", zona: "", consent: false });
export const blankProfile = (): Profile => ({ education: "", trainingType: "", interest: "", experience: "", skills: "", availability: "", digitalBarrier: "", hasCV: "", objective: "" });
export const blankFilters = (): TeamFilters => ({ query: "", program: "", status: "" });
export const blankDiagnosis = (): Diagnosis => ({ situacion: "", tiempoSinEmpleo: "", motivacion: "", nivelUrgencia: "", redApoyo: "", expectativaApoyo: "" });
const demoDate = "2026-09-08T12:00:00.000Z";

export function createSeed(): DemoState {
  return {
    version: 1,
    participants: demo.participants.map(person => ({
      id: person.id, organizationId: demo.organization.id, name: person.demo_name,
      email: person.email, phone: "", municipality: person.municipality,
      consent: null, consentAt: null, createdAt: demoDate, source: "sample",
      enrollment: { id: `enrollment-${person.id}`, programId: person.program_id, status: person.status, statusChangedAt: demoDate },
      profile: null, profileSavedAt: null, history: [],
    })),
    activeParticipantId: null, registrationDraft: blankRegistration(), profileDrafts: {}, teamFilters: blankFilters(),
  };
}

export class ValidationError extends Error {
  fields: FieldErrors;
  constructor(fields: FieldErrors) { super("Revisa los campos señalados."); this.fields = fields; }
}

export function validateRegistration(input: Registration, participants: Participant[]): FieldErrors {
  const errors: FieldErrors = {};
  const email = input.email.trim().toLowerCase();
  if (!input.name.trim()) errors.name = "Escribe un nombre ficticio para el demo.";
  else if (input.name.trim().length > 100) errors.name = "Usa un nombre de hasta 100 caracteres.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) errors.email = "Escribe un correo válido, por ejemplo prueba@example.com.";
  else if (!email.endsWith("@example.com")) errors.email = "Para esta prueba usa un correo ficticio terminado en @example.com.";
  else if (participants.some(person => person.email.toLowerCase() === email)) errors.email = "Este correo ya está registrado. Usa otro correo ficticio.";
  if (input.phone.length > 40) errors.phone = "Usa hasta 40 caracteres o deja el teléfono vacío.";
  if (!config.municipalities.some(item => item === input.municipality)) errors.municipality = "Selecciona un municipio de la lista.";
  if (input.consent !== true) errors.consent = "Acepta el uso de estos datos ficticios para continuar.";
  return errors;
}

function object(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function strings(value: unknown, fields: string[]): boolean { return object(value) && fields.every(key => typeof value[key] === "string"); }
function isProfile(value: unknown): value is Profile { return strings(value, Object.keys(blankProfile())); }
function isQuestionnaire(value: unknown) { return strings(value, Object.keys(blankQuestionnaire())); }
function isJourney(value: unknown) {
  return object(value) && isQuestionnaire(value.answers) && validateQuestionnaire(value.answers as Questionnaire) === null && typeof value.updatedAt === "string"
    && (value.reviewedAt === null || typeof value.reviewedAt === "string") && (value.reviewedBy === null || typeof value.reviewedBy === "string")
    && Array.isArray(value.steps) && value.steps.length > 0 && value.steps.every(step => strings(step, ["id", "title", "reason", "action", "owner", "status"]) && ["pendiente", "en_proceso", "completado"].includes(step.status))
    && new Set(value.steps.map(step => step.id)).size === value.steps.length;
}
function isParticipant(value: unknown): value is Participant {
  if (!object(value) || !strings(value, ["id", "organizationId", "name", "email", "phone", "municipality", "createdAt"])) return false;
  const e = value.enrollment;
  return object(e) && strings(e, ["id", "programId", "status", "statusChangedAt"])
    && config.states.some(state => state.id === e.status)
    && config.programs.some(program => program.id === e.programId)
    && (value.consent === null || typeof value.consent === "boolean")
    && (value.consentAt === null || typeof value.consentAt === "string")
    && ["sample", "registration"].includes(String(value.source))
    && (value.profile === null || isProfile(value.profile))
    && (value.profileSavedAt === null || typeof value.profileSavedAt === "string")
    && (value.zona === undefined || typeof value.zona === "string")
    && Array.isArray(value.history) && value.history.every(event => strings(event, ["id", "enrollmentId", "from", "to", "changedAt", "changedBy"]));
}

export function parseState(raw: string): DemoState {
  let data: unknown;
  try { data = JSON.parse(raw); } catch { throw new Error("Los datos guardados no se pueden leer. No se han reemplazado ni eliminado."); }
  if (!object(data) || data.version !== 1 || !Array.isArray(data.participants) || !data.participants.every(isParticipant)
    || !object(data.registrationDraft) || !strings(data.registrationDraft, ["name", "email", "phone", "municipality"]) || typeof data.registrationDraft.consent !== "boolean"
    || !object(data.profileDrafts) || !Object.values(data.profileDrafts).every(isProfile)
    || !strings(data.teamFilters, ["query", "program", "status"])
    || (data.dashboardFilters !== undefined && !strings(data.dashboardFilters, ["program", "city", "occupation", "status"]))
    || (data.questionnaireDrafts !== undefined && (!object(data.questionnaireDrafts) || !Object.values(data.questionnaireDrafts).every(isQuestionnaire)))
    || (data.journeys !== undefined && (!object(data.journeys) || !Object.values(data.journeys).every(isJourney)))
    || (data.diagnoses !== undefined && !object(data.diagnoses))
    || (data.diagnosisDrafts !== undefined && !object(data.diagnosisDrafts))
    || (data.psychometrics !== undefined && !object(data.psychometrics))
    || (data.psychometricDrafts !== undefined && !object(data.psychometricDrafts))
    || (data.cvData !== undefined && !object(data.cvData))
    || !(data.activeParticipantId === null || (typeof data.activeParticipantId === "string" && data.participants.some(person => person.id === data.activeParticipantId)))) {
    throw new Error("El formato de los datos guardados no es compatible. Se conservó el contenido original.");
  }
  if (new Set(data.participants.map(person => person.id)).size !== data.participants.length
    || new Set(data.participants.map(person => person.email.toLowerCase())).size !== data.participants.length) {
    throw new Error("Hay identificadores o correos duplicados en los datos guardados. Se necesita revisar la copia local.");
  }
  return data as DemoState;
}

export function filterParticipants(people: Participant[], filters: TeamFilters): Participant[] {
  const normalize = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const query = normalize(filters.query.trim());
  return people.filter(person => (!query || normalize(`${person.name} ${person.email}`).includes(query))
    && (!filters.program || person.enrollment.programId === filters.program)
    && (!filters.status || person.enrollment.status === filters.status))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

export function createLocalRepository(storage: StoragePort, now = () => new Date().toISOString(), newId = () => crypto.randomUUID()): DemoRepository {
  function write(state: DemoState): DemoState {
    try { storage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch { throw new Error("No se pudo guardar en este navegador. Revisa el espacio disponible y permite el almacenamiento local. Tus cambios siguen en el formulario."); }
    return state;
  }
  function load(): DemoState {
    let raw: string | null;
    try { raw = storage.getItem(STORAGE_KEY); }
    catch { throw new Error("Este navegador no permite leer el almacenamiento local. Habilítalo y vuelve a intentar."); }
    if (raw === null) return write(createSeed());
    try { return parseState(raw); }
    catch { console.warn("[TALENTIA] Estado guardado incompatible; se reinicia con datos frescos."); return write(createSeed()); }
  }
  function update(change: (state: DemoState) => void): DemoState { const state = load(); change(state); return write(state); }
  function find(state: DemoState, id: string) { const person = state.participants.find(item => item.id === id); if (!person) throw new Error("No se encontró este expediente. Vuelve al listado e intenta de nuevo."); return person; }
  function validProfile(profile: Profile) {
    if (!isProfile(profile) || Object.values(profile).some(value => value.length > 3000)) throw new Error("Cada campo del perfil admite hasta 3000 caracteres.");
    const catalogs: Record<string, readonly string[]> = { education: config.education, trainingType: config.training.map(t => t.id), interest: config.interests, availability: config.availability, digitalBarrier: config.answers, hasCV: config.answers };
    if (Object.entries(catalogs).some(([key, options]) => profile[key as keyof Profile] !== "" && !options.includes(profile[key as keyof Profile]))) throw new Error("Selecciona las opciones del perfil desde las listas disponibles.");
  }
  return {
    load,
    saveRegistrationDraft: draft => update(state => { state.registrationDraft = { ...state.registrationDraft, ...draft }; }),
    register: input => update(state => {
      const autoProgramId = config.programs.find(p => p.active)?.id ?? config.programs[0].id;
      const errors = validateRegistration(input, state.participants);
      if (Object.keys(errors).length) throw new ValidationError(errors);
      const id = newId(); const at = now();
      if (state.participants.some(person => person.id === id)) throw new Error("No se pudo crear un identificador único. Inténtalo de nuevo.");
      state.participants.push({
        id, organizationId: config.organization.id, name: input.name.trim(), email: input.email.trim().toLowerCase(),
        phone: input.phone.trim(), municipality: input.municipality, zona: input.zona?.trim() ?? "",
        consent: true, consentAt: at, createdAt: at, source: "registration",
        enrollment: { id: `enrollment-${id}`, programId: autoProgramId, status: "registrada", statusChangedAt: at },
        profile: null, profileSavedAt: null, history: [],
      });
      state.activeParticipantId = id; state.registrationDraft = blankRegistration();
    }),
    saveProfileDraft: (id, changes) => update(state => {
      const person = find(state, id);
      const profile = { ...(state.profileDrafts[id] ?? participantProfile(person) ?? blankProfile()), ...changes };
      validProfile(profile); state.profileDrafts[id] = profile;
    }),
    saveProfile: (id, profile) => update(state => {
      validProfile(profile); const person = find(state, id);
      const previousJourney = getJourney(state, person);
      if (previousJourney) {
        previousJourney.reviewedAt = null; previousJourney.reviewedBy = null;
        const review = previousJourney.steps.find(item => item.id === "revision"); if (review) review.status = "pendiente";
        state.journeys ??= {}; state.journeys[id] = previousJourney;
      }
      person.profile = { ...profile }; person.profileSavedAt = now(); delete state.profileDrafts[id];
    }),
    selectParticipant: id => update(state => { find(state, id); state.activeParticipantId = id; }),
    saveQuestionnaireDraft: (id, changes) => update(state => {
      const person = find(state, id);
      const answers = { ...(state.questionnaireDrafts?.[id] ?? getJourney(state, person)?.answers ?? initialAnswers(person)), ...changes };
      if (!isQuestionnaire(answers) || Object.values(answers).some(value => value.length > 3000)) throw new Error("Revisa las respuestas del cuestionario.");
      state.questionnaireDrafts ??= {}; state.questionnaireDrafts[id] = answers;
    }),
    saveQuestionnaire: (id, answers) => update(state => {
      find(state, id); const error = validateQuestionnaire(answers); if (error) throw new Error(error);
      state.journeys ??= {};
      state.journeys[id] = { answers: { ...answers }, steps: buildRoute(answers), updatedAt: now(), reviewedAt: null, reviewedBy: null };
      if (state.questionnaireDrafts) delete state.questionnaireDrafts[id];
    }),
    updateRouteStep: (id, stepId, status) => update(state => {
      const person = find(state, id); const journey = getJourney(state, person);
      if (!journey || !["pendiente", "en_proceso", "completado"].includes(status)) throw new Error("No se encontró una ruta o un estado válido.");
      const step = journey.steps.find(item => item.id === stepId);
      if (!step) throw new Error("Esta actividad ya no está en la ruta. Actualiza la vista.");
      step.status = status; journey.updatedAt = now();
      journey.reviewedAt = null; journey.reviewedBy = null;
      const review = journey.steps.find(item => item.id === "revision"); if (review && step.id !== "revision") review.status = "pendiente";
      state.journeys ??= {}; state.journeys[id] = journey;
    }),
    reviewRoute: id => update(state => {
      const person = find(state, id); const journey = getJourney(state, person);
      if (!journey) throw new Error("Completa el cuestionario para preparar una ruta.");
      journey.reviewedAt = now(); journey.reviewedBy = config.actor;
      const review = journey.steps.find(item => item.id === "revision"); if (review) review.status = "completado";
      state.journeys ??= {}; state.journeys[id] = journey;
    }),
    changeStatus: (id, nextStatus, expectedStatus) => update(state => {
      const person = find(state, id); const previous = person.enrollment.status;
      if (previous !== expectedStatus) throw new Error("El estado cambió en otra vista. Actualiza el expediente antes de confirmar.");
      if (previous === nextStatus) return;
      if (!config.transitions[previous]?.includes(nextStatus)) throw new Error("Este cambio de estado no está permitido por la configuración del demo.");
      const at = now();
      person.history.push({ id: newId(), enrollmentId: person.enrollment.id, from: previous, to: nextStatus, changedAt: at, changedBy: config.actor });
      person.enrollment.status = nextStatus; person.enrollment.statusChangedAt = at;
    }),
    saveFilters: filters => update(state => { state.teamFilters = { ...filters }; }),
    saveDashboardFilters: filters => update(state => { state.dashboardFilters = { program:"", city:"", occupation:"", status:"", ...state.dashboardFilters, ...filters }; }),
    startNewRegistration: () => update(state => { state.activeParticipantId = null; state.registrationDraft = blankRegistration(); }),
    saveDiagnosisDraft: (id, changes) => update(state => {
      find(state, id);
      const diagnosis = { ...(state.diagnosisDrafts?.[id] ?? state.diagnoses?.[id] ?? blankDiagnosis()), ...changes };
      state.diagnosisDrafts ??= {}; state.diagnosisDrafts[id] = diagnosis;
    }),
    saveDiagnosis: (id, diagnosis) => update(state => {
      find(state, id);
      state.diagnoses ??= {}; state.diagnoses[id] = { ...diagnosis };
      if (state.diagnosisDrafts) delete state.diagnosisDrafts[id];
    }),
    savePsychometricDraft: (id, changes) => update(state => {
      find(state, id);
      const answers = { ...(state.psychometricDrafts?.[id] ?? state.psychometrics?.[id] ?? blankPsychometric()), ...changes };
      state.psychometricDrafts ??= {}; state.psychometricDrafts[id] = answers;
    }),
    savePsychometric: (id, answers) => update(state => {
      find(state, id);
      state.psychometrics ??= {}; state.psychometrics[id] = { ...answers };
      if (state.psychometricDrafts) delete state.psychometricDrafts[id];
    }),
    saveCvData: (id, data) => update(state => {
      find(state, id);
      if (typeof data.summary !== "string" || typeof data.languages !== "string" || typeof data.references !== "string" || typeof data.jobTitle !== "string") throw new Error("Revisa los campos del CV.");
      state.cvData ??= {}; state.cvData[id] = { ...data };
    }),
    unlockPsychometric: (id) => update(state => {
      find(state, id);
      if (state.psychometrics) delete state.psychometrics[id];
      if (state.psychometricDrafts) delete state.psychometricDrafts[id];
    }),
  };
}
