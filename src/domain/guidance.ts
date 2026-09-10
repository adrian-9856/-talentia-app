import { occupations, opportunities, scenarios, salaryReference } from "../data/labor-market.ts";
import type { DemoState, Journey, Participant, Profile, Questionnaire, RouteStep } from "./types.ts";

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
    // Demonstration progress is explicit scenario data, never inferred from status.
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
    if (answers.experienceMonths === "") pending.push("Experiencia por conversar");
    else if (+answers.experienceMonths >= item.minMonths) reasons.push(`${answers.experienceMonths} meses declarados / ${item.minMonths} solicitados`);
    else pending.push(`Solicita ${item.minMonths} meses; declaraste ${answers.experienceMonths}`);
    const sameSchedule = profile?.availability === item.schedule;
    if (!sameSchedule) pending.push("Acordar disponibilidad y horario");
    if (!answers.expectedSalary) pending.push("Expectativa salarial por conversar");
    else if (!sameSchedule) pending.push("Comparar salarios cuando se acuerde la misma jornada");
    else if (+answers.expectedSalary > item.baseMax) pending.push(`La expectativa supera el máximo ofrecido en Q${(+answers.expectedSalary-item.baseMax).toFixed(2)}`);
    else reasons.push("El rango permite conversar tu expectativa base");
    return { opportunity:item,reasons,pending };
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
