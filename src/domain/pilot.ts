export type PilotRouteCode = "A" | "B" | "C";

export type PilotRouteStep = {
  title: string;
  status: "pendiente" | "en_proceso" | "completado";
};

export type PilotSubmissionInput = {
  participantId: string;
  name: string;
  email: string;
  municipality: string;
  programId: string;
  consentAt: string;
  profile: {
    education: string;
    trainingType: string;
    interest: string;
    experience: string;
    skills: string;
    availability: string;
    digitalBarrier: string;
    hasCV: string;
    objective: string;
  };
  questionnaire: {
    occupation: string;
    expectedSalary: string;
    experienceMonths: string;
    cvUpdated: string;
    clarity: string;
    digitalAccess: string;
    wantsTraining: string;
    experienceHelp: string;
  };
  routeSteps: PilotRouteStep[];
};

export type PilotTransformation = {
  routeCode: PilotRouteCode;
  routeName: string;
  routePurpose: string;
  supportSignals: string[];
  completedSteps: number;
  totalSteps: number;
  documentStatus: string;
  nextAction: string;
  requiresReview: boolean;
};

export type PilotRecord = PilotSubmissionInput & PilotTransformation & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

function object(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredText(value: unknown, label: string, max = 3000) {
  if (typeof value !== "string" || !value.trim() || value.length > max) throw new Error(`${label} no es válido.`);
  return value.trim();
}

function optionalText(value: unknown, label: string, max = 3000) {
  if (typeof value !== "string" || value.length > max) throw new Error(`${label} no es válido.`);
  return value.trim();
}

const profileKeys = ["education", "trainingType", "interest", "experience", "skills", "availability", "digitalBarrier", "hasCV", "objective"] as const;
const questionnaireKeys = ["occupation", "expectedSalary", "experienceMonths", "cvUpdated", "clarity", "digitalAccess", "wantsTraining", "experienceHelp"] as const;

export function parsePilotSubmission(value: unknown): PilotSubmissionInput {
  if (!object(value) || !object(value.profile) || !object(value.questionnaire) || !Array.isArray(value.routeSteps)) throw new Error("El expediente no tiene el formato esperado.");
  const email = requiredText(value.email, "El correo", 254).toLowerCase();
  if (!/^[^\s@]+@example\.com$/i.test(email)) throw new Error("Para el piloto usa un correo ficticio terminado en @example.com.");
  const consentAt = requiredText(value.consentAt, "El consentimiento", 50);
  if (Number.isNaN(Date.parse(consentAt))) throw new Error("La fecha de consentimiento no es válida.");
  const rawProfile = value.profile;
  const rawQuestionnaire = value.questionnaire;
  const profile = Object.fromEntries(profileKeys.map(key => [key, optionalText(rawProfile[key], `El campo ${key}`)])) as PilotSubmissionInput["profile"];
  const questionnaire = Object.fromEntries(questionnaireKeys.map(key => [key, optionalText(rawQuestionnaire[key], `La respuesta ${key}`, 500)])) as PilotSubmissionInput["questionnaire"];
  const routeSteps = value.routeSteps.map((step, index) => {
    if (!object(step) || !["pendiente", "en_proceso", "completado"].includes(String(step.status))) throw new Error(`La actividad ${index + 1} no es válida.`);
    return { title: requiredText(step.title, `La actividad ${index + 1}`, 200), status: step.status as PilotRouteStep["status"] };
  });
  if (!routeSteps.length || routeSteps.length > 10) throw new Error("La ruta debe contener entre 1 y 10 actividades.");
  return {
    participantId: requiredText(value.participantId, "El identificador", 100),
    name: requiredText(value.name, "El nombre", 100),
    email,
    municipality: requiredText(value.municipality, "El municipio", 100),
    programId: requiredText(value.programId, "El programa", 100),
    consentAt,
    profile,
    questionnaire,
    routeSteps,
  };
}

export function transformPilotSubmission(input: PilotSubmissionInput): PilotTransformation {
  const signals: string[] = [];
  if (!input.questionnaire.occupation || input.questionnaire.clarity === "Quiero explorar opciones") signals.push("Objetivo laboral por explorar");
  if (input.questionnaire.cvUpdated === "No") signals.push("CV por crear o actualizar");
  if (input.questionnaire.experienceHelp === "Sí") signals.push("Apoyo para narrar experiencia");
  if (["Necesito apoyo", "Acceso ocasional"].includes(input.questionnaire.digitalAccess)) signals.push("Acompañamiento digital");
  if (input.questionnaire.wantsTraining === "Sí") signals.push("Interés en formación");
  if (!input.profile.availability) signals.push("Disponibilidad por definir");

  const routeCode: PilotRouteCode = signals.length >= 4 ? "A" : signals.length >= 2 ? "B" : "C";
  const routes = {
    A: { name: "Descubrir y preparar", purpose: "Clarificar el objetivo y construir herramientas iniciales." },
    B: { name: "Fortalecer y practicar", purpose: "Mejorar aspectos concretos antes de conectar con oportunidades." },
    C: { name: "Conectar y dar seguimiento", purpose: "Explorar opciones pertinentes y acompañar el resultado." },
  } as const;
  const next = input.routeSteps.find(step => step.status !== "completado");
  return {
    routeCode,
    routeName: routes[routeCode].name,
    routePurpose: routes[routeCode].purpose,
    supportSignals: signals,
    completedSteps: input.routeSteps.filter(step => step.status === "completado").length,
    totalSteps: input.routeSteps.length,
    documentStatus: input.questionnaire.cvUpdated === "Sí" ? "CV declarado como actualizado" : input.questionnaire.cvUpdated === "No" ? "CV por crear o revisar" : "Estado del CV por conversar",
    nextAction: next?.title ?? "Ruta completada; revisar siguiente etapa",
    requiresReview: signals.length > 0 || input.routeSteps.some(step => step.status !== "completado"),
  };
}
