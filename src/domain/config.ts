import demo from "../data/demo.json" with { type: "json" };

export const config = {
  organization: demo.organization,
  programs: demo.programs,
  municipalities: ["Guatemala", "Mixco", "Villa Nueva"],
  states: [
    { id: "interesada", label: "Interesada", tone: "neutral" },
    { id: "registrada", label: "Registrada", tone: "blue" },
    { id: "perfil_en_proceso", label: "Perfil en proceso", tone: "amber" },
    { id: "ruta_definida", label: "Ruta definida", tone: "blue" },
    { id: "cv_listo", label: "CV listo", tone: "green" },
    { id: "en_acompanamiento", label: "En acompañamiento", tone: "amber" },
    { id: "graduada", label: "Graduada", tone: "green" },
  ],
  // Provisional demo policy: the team may correct any catalog state manually.
  // This is not a validated institutional transition matrix.
  transitions: Object.fromEntries(
    ["interesada", "registrada", "perfil_en_proceso", "ruta_definida", "cv_listo", "en_acompanamiento", "graduada"].map(id => [id, ["interesada", "registrada", "perfil_en_proceso", "ruta_definida", "cv_listo", "en_acompanamiento", "graduada"].filter(next => next !== id)])
  ) as Record<string, string[]>,
  education: ["Sin escolaridad formal", "Primaria", "Básicos", "Diversificado", "Universidad", "Otra", "Prefiero no responder"],
  training: [{id:"tecnica",label:"Técnica"},{id:"universitaria",label:"Universitaria"},{id:"curso",label:"Cursos"},{id:"otra",label:"Otra"},{id:"sin_respuesta",label:"Prefiero no responder"}],
  interests: ["Administración", "Atención al cliente", "Tecnología", "Oficios técnicos", "Comercio", "Otra", "Aún lo estoy explorando", "Prefiero no responder"],
  availability: ["Tiempo completo", "Medio tiempo", "Por horas", "Por definir", "Prefiero no responder"],
  answers: ["Sí", "No", "Prefiero no responder"],
  actor: "Equipo demo",
} as const;

export const stateLabel = (id: string) => config.states.find(state => state.id === id)?.label ?? id;
export const programLabel = (id: string) => config.programs.find(program => program.id === id)?.name ?? id;
export const trainingLabel = (id: string) => config.training.find(type => type.id === id)?.label ?? "Sin indicar";

export const profileFields = [
  { key: "education", label: "Nivel educativo", type: "select", options: config.education },
  { key: "trainingType", label: "Tipo de formación", type: "training" },
  { key: "interest", label: "Área de interés", type: "select", options: config.interests },
  { key: "availability", label: "Disponibilidad", type: "select", options: config.availability },
  { key: "experience", label: "Experiencia laboral y no formal", type: "textarea", hint: "También cuentan las prácticas, el trabajo independiente y las actividades comunitarias." },
  { key: "skills", label: "Habilidades", type: "textarea", hint: "Describe lo que sabes hacer, con tus propias palabras." },
  { key: "digitalBarrier", label: "¿Necesitas apoyo para usar herramientas digitales?", type: "select", options: config.answers },
  { key: "hasCV", label: "¿Ya tienes un CV?", type: "select", options: config.answers },
  { key: "objective", label: "¿Qué te gustaría lograr laboralmente?", type: "textarea", hint: "Escribe tu objetivo. Puedes completarlo más adelante." },
] as const;
