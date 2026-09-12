import { occupations, opportunities, scenarios, salaryReference } from "../data/labor-market.ts";
import type { DemoState, Journey, Participant, Profile, PsychometricAnswers, Questionnaire, RouteStep } from "./types.ts";

export const psychometricQuestions = [
  { id:"r1", label:"Me gusta trabajar con mis manos: reparar, construir, preparar alimentos o usar herramientas.", group:"R" },
  { id:"r2", label:"Prefiero actividades físicas o al aire libre antes que trabajar sentada en una oficina.", group:"R" },
  { id:"r3", label:"Entiendo con facilidad cómo funcionan las máquinas, equipos o sistemas técnicos.", group:"R" },
  { id:"r4", label:"Disfruto arreglar cosas que se descomponen en casa o en el trabajo.", group:"R" },
  { id:"r5", label:"Se me facilita seguir instrucciones prácticas cuando trabajo con herramientas o materiales.", group:"R" },
  { id:"i1", label:"Disfruto resolver problemas complejos o analizar información antes de tomar decisiones.", group:"I" },
  { id:"i2", label:"Me interesan temas como salud, tecnología, ciencias o datos.", group:"I" },
  { id:"i3", label:"Prefiero entender el porqué de las cosas antes de seguir instrucciones paso a paso.", group:"I" },
  { id:"i4", label:"Me gusta investigar por mi cuenta cuando algo me llama la atención.", group:"I" },
  { id:"i5", label:"Cuando algo falla, prefiero buscar la causa antes que aplicar la primera solución que se me ocurra.", group:"I" },
  { id:"a1", label:"Me expreso bien a través de la escritura, el diseño, la presentación de ideas u otras artes.", group:"A" },
  { id:"a2", label:"Disfruto crear cosas nuevas o encontrar formas originales de hacer el trabajo.", group:"A" },
  { id:"a3", label:"Me adapto fácilmente a situaciones cambiantes y me gustan los entornos con variedad.", group:"A" },
  { id:"a4", label:"Suelo proponer ideas distintas cuando algo se hace siempre igual.", group:"A" },
  { id:"a5", label:"Prefiero un trabajo con espacio para la creatividad antes que uno con reglas muy fijas.", group:"A" },
  { id:"s1", label:"Me siento cómoda ayudando, escuchando o apoyando a otras personas en su día a día.", group:"S" },
  { id:"s2", label:"Disfruto trabajar en equipo o enseñar algo a otras personas.", group:"S" },
  { id:"s3", label:"Me motiva que mi trabajo tenga un impacto positivo en la comunidad o en las personas.", group:"S" },
  { id:"s4", label:"Cuando alguien tiene un conflicto en el grupo, tiendo a ayudar a que se entiendan.", group:"S" },
  { id:"s5", label:"Prefiero un trabajo con trato directo con personas antes que uno solitario.", group:"S" },
  { id:"e1", label:"Me gusta liderar proyectos, coordinar a otras personas o tomar la iniciativa.", group:"E" },
  { id:"e2", label:"Disfruto convencer a otros, negociar o presentar ideas con confianza.", group:"E" },
  { id:"e3", label:"Me atrae la idea de emprender, tener mi propio negocio o trabajar con autonomía.", group:"E" },
  { id:"e4", label:"Me siento cómoda tomando decisiones aunque haya poca información.", group:"E" },
  { id:"e5", label:"Me motivan las metas ambiciosas y ver crecer un proyecto.", group:"E" },
  { id:"c1", label:"Prefiero tareas ordenadas, con procedimientos claros y resultados predecibles.", group:"C" },
  { id:"c2", label:"Soy buena organizando información, llevando registros o manejando datos.", group:"C" },
  { id:"c3", label:"Me siento cómoda con el trabajo de oficina: atención al cliente, archivo, contabilidad básica.", group:"C" },
  { id:"c4", label:"Me tranquiliza revisar dos veces algo importante antes de entregarlo.", group:"C" },
  { id:"c5", label:"Prefiero un plan escrito antes que resolver las cosas sobre la marcha.", group:"C" },
] as const;

export const psychometricOptions = ["Sí, me describe bien", "A veces", "No me describe"] as const;

export const psychometricGroupNames: Record<string,string> = {
  R:"Técnico / Manual", I:"Analítico / Investigador", A:"Creativo / Artístico",
  S:"Social / Relacional", E:"Emprendedor / Líder", C:"Organizado / Convencional",
};

export const psychometricGroupColors: Record<string,string> = {
  R:"#4d9278", I:"#4665e7", A:"#c87941", S:"#7c5bba", E:"#cc4e4e", C:"#6b8f9e",
};

export function blankPsychometric(): PsychometricAnswers {
  return {
    r1:"",r2:"",r3:"",r4:"",r5:"",
    i1:"",i2:"",i3:"",i4:"",i5:"",
    a1:"",a2:"",a3:"",a4:"",a5:"",
    s1:"",s2:"",s3:"",s4:"",s5:"",
    e1:"",e2:"",e3:"",e4:"",e5:"",
    c1:"",c2:"",c3:"",c4:"",c5:"",
  };
}

export function scorePsychometric(answers: PsychometricAnswers): { R:number; I:number; A:number; S:number; E:number; C:number; dominante:string } {
  const groups = ["R","I","A","S","E","C"] as const;
  const score = (group: string) => {
    const qs = psychometricQuestions.filter(q => q.group === group);
    const total = qs.reduce((sum, q) => {
      const v = answers[q.id as keyof PsychometricAnswers];
      return sum + (v === "Sí, me describe bien" ? 3 : v === "A veces" ? 1 : 0);
    }, 0);
    return Math.round((total / (qs.length * 3)) * 100);
  };
  const scored = Object.fromEntries(groups.map(g => [g, score(g)])) as { R:number; I:number; A:number; S:number; E:number; C:number };
  const dominante = ([...groups] as string[]).sort((a, b) => scored[b as keyof typeof scored] - scored[a as keyof typeof scored])[0];
  return { ...scored, dominante };
}

export const blankQuestionnaire = (): Questionnaire => ({ occupation:"",expectedSalary:"",experienceMonths:"",cvUpdated:"",clarity:"",digitalAccess:"",wantsTraining:"",experienceHelp:"" });
export const questionnaireFields = [
  { key:"cvUpdated", label:"¿Tienes un CV actualizado?", options:["Sí","No","Prefiero no responder"] },
  { key:"clarity", label:"¿Qué tan claro tienes el trabajo que buscas?", options:["Tengo una idea clara","Quiero explorar opciones","Prefiero no responder"] },
  { key:"digitalAccess", label:"¿Tienes acceso a teléfono o computadora?", options:["Acceso frecuente","Acceso ocasional","Necesito apoyo","Prefiero no responder"] },
  { key:"wantsTraining", label:"¿Te interesa recibir formación?", options:["Sí","No","Prefiero no responder"] },
  { key:"experienceHelp", label:"¿Necesitas ayuda para describir tu experiencia?", options:["Sí","No","Prefiero no responder"] },
] as const;
export function validateQuestionnaire(answers: Questionnaire): string | null {
  if (Object.keys(blankQuestionnaire()).some(key => typeof answers[key as keyof Questionnaire] !== "string")) return "Revisa el formato de tus respuestas.";
  if (answers.occupation && !occupations.some(item => item.id === answers.occupation)) return "Elige una ocupación de la lista.";
  if (answers.expectedSalary && (!/^\d+(\.\d{1,2})?$/.test(answers.expectedSalary) || +answers.expectedSalary <= 0 || +answers.expectedSalary > 100000)) return "Escribe una expectativa base entre Q0.01 y Q100,000, o deja el campo vacío.";
  if (answers.experienceMonths && (!/^\d+$/.test(answers.experienceMonths) || +answers.experienceMonths > 600)) return "Indica meses de experiencia entre 0 y 600, o deja el campo vacío.";
  for (const field of questionnaireFields) if (answers[field.key] && !(field.options as readonly string[]).includes(answers[field.key])) return "Selecciona tus respuestas desde las opciones disponibles.";
  return null;
}
export function buildRoute(answers: Questionnaire): RouteStep[] {
  const steps: RouteStep[] = [];
  const add = (id:string,title:string,reason:string,action:string,owner="Participante + orientación") => steps.push({ id,title,reason,action,owner,status:"pendiente" });
  if (["Necesito apoyo","Acceso ocasional"].includes(answers.digitalAccess)) add("digital","Preparar un canal de acompañamiento",`Indicaste: ${answers.digitalAccess.toLowerCase()}.`,"Acordar un canal accesible y practicar el envío de un documento con apoyo. No se enviará ningún mensaje automáticamente.","Equipo de orientación");
  if (!answers.occupation || answers.clarity === "Quiero explorar opciones") add("explorar","Explorar trabajos que te interesan","El tipo de trabajo está por definir o quieres explorar opciones.","Conversar sobre tareas, horarios, intereses y condiciones de traslado. Elegir una ocupación contigo.");
  if (answers.wantsTraining === "Sí") add("formacion",answers.occupation === "barista" ? "Explorar una introducción al servicio de café" : "Acordar una opción de formación","Te interesa recibir formación antes o durante la búsqueda.","El equipo confirma una opción disponible, sus requisitos y si aporta a tu objetivo. La formación no se supone obligatoria para contratarte.");
  if (answers.cvUpdated === "No" || answers.experienceHelp === "Sí") add("cv",answers.cvUpdated === "No" ? "Preparar tu CV con experiencia real" : "Describir mejor tu experiencia",answers.cvUpdated === "No" ? "Indicaste que no tienes un CV actualizado." : "Pediste apoyo para describir tu experiencia.","Recuperar actividades laborales, prácticas o experiencias comunitarias que tú declares. Revisar fechas y tareas sin inventar certificados ni logros.");
  if (steps.length < 4 && answers.occupation) add("entrevista","Practicar una conversación de entrevista","Ya señalaste un trabajo que te interesa.","Preparar una presentación breve y preguntas sobre jornada, funciones, salario y acompañamiento. Actividad orientativa de 30 minutos.");
  add("revision","Revisar oportunidades con el equipo","La ruta y las condiciones requieren una decisión compartida.","Comparar tu expectativa con la oferta, conversar experiencia y horarios y decidir si quieres continuar. Esta acción no envía una postulación.","Equipo + participante");
  return steps.slice(0,5);
}
export function participantProfile(person: Participant): Profile | null { return person.profile ?? (person.source === "sample" ? scenarios[person.id]?.profile ?? null : null); }
export function initialAnswers(person: Participant): Questionnaire {
  const profile = person.profile;
  if (person.source === "sample" && !profile && scenarios[person.id]) return { ...scenarios[person.id].answers };
  return { ...blankQuestionnaire(),cvUpdated:profile?.hasCV === "No" ? "No" : "",digitalAccess:profile?.digitalBarrier === "Sí" ? "Necesito apoyo" : "" };
}
export function getJourney(state: DemoState, person: Participant): Journey | null {
  if (state.journeys?.[person.id]) return state.journeys[person.id];
  if (person.source === "sample" && !person.profile && scenarios[person.id]) {
    const answers = initialAnswers(person); const steps = buildRoute(answers);
    const completed = ["p001","p002","p003"].includes(person.id) ? steps.length : ["p004","p005","p006"].includes(person.id) ? 2 : 0;
    steps.forEach((step,index) => { if(index < completed && step.id !== "revision") step.status="completado"; });
    return { answers,steps,updatedAt:"2026-09-08T12:00:00.000Z",reviewedAt:null,reviewedBy:null };
  }
  return null;
}
export function opportunityLinks(answers: Questionnaire, profile: Profile | null) {
  if (!answers.occupation) return [];
  return opportunities.filter(item => item.occupation === answers.occupation).map(item => {
    const reasons = ["Ocupación de interés compartida"];
    const pending: string[] = ["Confirmar condiciones con la empresa"];
    let connectionScore = 30;
    if (answers.experienceMonths === "") pending.push("Experiencia por conversar");
    else if (+answers.experienceMonths >= item.minMonths) { reasons.push(`${answers.experienceMonths} meses declarados / ${item.minMonths} solicitados`); connectionScore += 25; }
    else pending.push(`Solicita ${item.minMonths} meses; declaraste ${answers.experienceMonths}`);
    const sameSchedule = profile?.availability === item.schedule;
    if (!sameSchedule) pending.push("Acordar disponibilidad y horario");
    else connectionScore += 20;
    if (!answers.expectedSalary) pending.push("Expectativa salarial por conversar");
    else if (!sameSchedule) pending.push("Comparar salarios cuando se acuerde la misma jornada");
    else if (+answers.expectedSalary > item.baseMax) pending.push(`La expectativa supera el máximo ofrecido en Q${(+answers.expectedSalary-item.baseMax).toFixed(2)}`);
    else { reasons.push("El rango permite conversar tu expectativa base"); connectionScore += 15; }
    return { opportunity:item, reasons, pending, connectionScore };
  });
}
export const money = (value:number, decimals = 0) => new Intl.NumberFormat("es-GT", {style:"currency",currency:"GTQ",minimumFractionDigits:decimals,maximumFractionDigits:decimals}).format(value);
export const average = (values:number[]) => values.length ? values.reduce((sum,value)=>sum+value,0)/values.length : null;
export const median = (values:number[]) => { if(!values.length) return null; const sorted=[...values].sort((a,b)=>a-b); const middle=Math.floor(sorted.length/2); return sorted.length%2 ? sorted[middle] : (sorted[middle-1]+sorted[middle])/2; };
export const minimumFor = (region:string, activity:string) => salaryReference.rates.find(item=>item.region===region&&item.activity===activity)!;
export function salaryByOccupation(state:DemoState, people:Participant[]) {
  return occupations.map(occupation=>{
    const selected=people.filter(person=>getJourney(state,person)?.answers.occupation===occupation.id && participantProfile(person)?.availability === "Tiempo completo");
    const expectations=selected.map(person=>getJourney(state,person)!.answers.expectedSalary).filter(Boolean).map(Number);
    const offers=opportunities.filter(item=>item.occupation===occupation.id);
    return { id:occupation.id,name:occupation.label,participants:selected.length,expectation:median(expectations),offer:average(offers.map(item=>item.baseMin)),openings:offers.reduce((sum,item)=>sum+item.openings,0) };
  });
}

export type PhaseStepId = "registration" | "diagnosis" | "psychometric" | "softskills" | "profile" | "questionnaire" | "summary" | "cv";
export type Phase = {
  id: string; number: number; title: string; subtitle: string;
  steps: { id: PhaseStepId; label: string }[];
  entra: string; pasa: string; sale: string;
};
export const phases: Phase[] = [
  {
    id: "conocerte", number: 1, title: "Te conocemos", subtitle: "Punto de partida",
    steps: [{ id:"registration", label:"Datos básicos" }, { id:"diagnosis", label:"Diagnóstico inicial" }],
    entra: "Tus datos básicos y cómo estás hoy",
    pasa: "Creamos tu expediente y detectamos tu urgencia",
    sale: "Un perfil inicial listo para acompañarte",
  },
  {
    id: "fortalezas", number: 2, title: "Descubre tus fortalezas", subtitle: "Cómo eres en el trabajo",
    steps: [{ id:"psychometric", label:"Test psicométrico" }, { id:"softskills", label:"Habilidades blandas" }],
    entra: "Cómo te comportas y qué te motiva",
    pasa: "Identificamos tu tipo de personalidad laboral",
    sale: "3 fortalezas que puedes destacar en cualquier empleo",
  },
  {
    id: "camino", number: 3, title: "Diseña tu camino", subtitle: "Tu ruta hacia el empleo",
    steps: [{ id:"profile", label:"Perfil laboral" }, { id:"questionnaire", label:"Cuestionario" }, { id:"summary", label:"Mi ruta" }],
    entra: "Tu experiencia, formación y hacia dónde quieres ir",
    pasa: "Cruzamos tus fortalezas con oportunidades reales",
    sale: "Una ruta con pasos concretos hacia tu próximo trabajo",
  },
  {
    id: "cv", number: 4, title: "Tu CV listo", subtitle: "Hoja de vida profesional",
    steps: [{ id:"cv", label:"Mi CV" }],
    entra: "Todo lo anterior + los detalles finales",
    pasa: "Armamos tu hoja de vida con formato profesional",
    sale: "Un PDF listo para enviar a empresas",
  },
];
export function phaseOfStep(step: PhaseStepId): Phase { return phases.find(p => p.steps.some(s => s.id === step))!; }
export const softSkillsCards = [
  { title:"Comunicación", icon:"ChatCircleText", color:"#4665e7", body:"Poder explicar tus ideas con claridad y escuchar a tu equipo. Un mesero, una recepcionista o un vendedor la necesitan igual.", example:"Ejemplo: preguntar antes de asumir." },
  { title:"Trabajo en equipo", icon:"UsersThree", color:"#33c377", body:"Coordinarte con otras personas para lograr algo juntos. Casi todos los empleos son trabajo colaborativo.", example:"Ejemplo: ofrecer ayuda cuando alguien va atrasado." },
  { title:"Resolución de problemas", icon:"Lightbulb", color:"#e0a13a", body:"Encontrar soluciones cuando algo no sale como esperabas, sin bloquearte ni culpar a otros.", example:"Ejemplo: si el proveedor no llegó, buscar una alternativa antes de avisar al jefe." },
  { title:"Responsabilidad", icon:"ShieldCheck", color:"#8250df", body:"Cumplir con lo que dijiste que ibas a hacer, en el tiempo que dijiste. Es la habilidad blanda más valorada por empresas guatemaltecas.", example:"Ejemplo: llegar 10 minutos antes del turno." },
];
