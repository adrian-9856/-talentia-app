import type { Profile, Questionnaire } from "../domain/types.ts";

export const occupations = [
  { id: "barista", label: "Barista", area: "Atención al cliente" },
  { id: "administracion", label: "Administración", area: "Administración" },
  { id: "electricidad", label: "Electricidad", area: "Oficios técnicos" },
  { id: "refrigeracion", label: "Refrigeración", area: "Oficios técnicos" },
  { id: "ventas", label: "Ventas", area: "Comercio" },
  { id: "soporte", label: "Soporte digital", area: "Tecnología" },
  { id: "agricultura", label: "Producción agrícola", area: "Otra" },
];
export const occupationLabel = (id: string) => occupations.find(item => item.id === id)?.label ?? "Por explorar";
export const companies = [
  { id: "c01", name: "Café Sendero", initials: "CS", sector: "Gastronomía", municipality: "Guatemala", description: "Cafetería de barrio con servicio en barra y formación inicial acompañada.", color: "coffee" },
  { id: "c02", name: "Mercado Nexo", initials: "MN", sector: "Comercio", municipality: "Mixco", description: "Comercio de productos de uso diario y atención presencial a clientes.", color: "blue" },
  { id: "c03", name: "Oficina Clara", initials: "OC", sector: "Servicios", municipality: "Mixco", description: "Servicios administrativos para pequeños negocios: archivo, agenda y recibos.", color: "purple" },
  { id: "c04", name: "Taller Brújula", initials: "TB", sector: "Servicios técnicos", municipality: "Guatemala", description: "Mantenimiento eléctrico y refrigeración con equipos de trabajo supervisados.", color: "amber" },
  { id: "c05", name: "Huerto Horizonte", initials: "HH", sector: "Agricultura", municipality: "Villa Nueva", description: "Producción agrícola de hortalizas, riego y preparación de cosecha.", color: "green" },
  { id: "c06", name: "Conecta Local", initials: "CL", sector: "Servicios digitales", municipality: "Guatemala", description: "Atención digital a usuarios y soporte básico por correo y chat.", color: "teal" },
];
export type Opportunity = {
  id: string; companyId: string; title: string; occupation: string; minMonths: number;
  baseMin: number; baseMax: number; incentive: number; openings: number;
  region: "CE1" | "CE2"; economicActivity: "agricola" | "no_agricola" | "maquila";
  schedule: string; requirements: string[]; note: string;
};
// Every employer, opening and offer is fictional. Values are monthly base pay.
export const opportunities: Opportunity[] = [
  { id:"o01",companyId:"c01",title:"Barista inicial",occupation:"barista",minMonths:0,baseMin:4002.28,baseMax:4002.28,incentive:250,openings:3,region:"CE1",economicActivity:"no_agricola",schedule:"Tiempo completo",requirements:["Interés en aprender preparación de café","Disponibilidad para turnos acordados"],note:"Oferta ficticia al mínimo base no agrícola CE1. Aprendizaje inicial acompañado; sin experiencia previa solicitada." },
  { id:"o02",companyId:"c01",title:"Barista de estación",occupation:"barista",minMonths:6,baseMin:4800,baseMax:5200,incentive:250,openings:1,region:"CE1",economicActivity:"no_agricola",schedule:"Tiempo completo",requirements:["Experiencia declarada en cafetería","Atención a clientes"],note:"Las funciones y la experiencia se confirman en conversación con la persona." },
  { id:"o03",companyId:"c02",title:"Asistente de ventas",occupation:"ventas",minMonths:6,baseMin:4500,baseMax:5000,incentive:250,openings:3,region:"CE1",economicActivity:"no_agricola",schedule:"Tiempo completo",requirements:["Atención a clientes","Organización de productos"],note:"Podría existir comisión variable; no se incluye en esta comparación." },
  { id:"o04",companyId:"c03",title:"Auxiliar administrativo",occupation:"administracion",minMonths:6,baseMin:4700,baseMax:5200,incentive:250,openings:2,region:"CE1",economicActivity:"no_agricola",schedule:"Tiempo completo",requirements:["Organización de documentos","Manejo básico de agenda"],note:"Se considera experiencia informal declarada para conversar, pendiente de verificación." },
  { id:"o05",companyId:"c04",title:"Auxiliar electricista",occupation:"electricidad",minMonths:6,baseMin:5200,baseMax:6500,incentive:250,openings:2,region:"CE1",economicActivity:"no_agricola",schedule:"Tiempo completo",requirements:["Prácticas o experiencia relevante","Revisión humana de tareas y condiciones de seguridad"],note:"No se presume certificación ni capacidad para tareas de riesgo." },
  { id:"o06",companyId:"c04",title:"Asistente de refrigeración",occupation:"refrigeracion",minMonths:6,baseMin:5000,baseMax:6100,incentive:250,openings:2,region:"CE1",economicActivity:"no_agricola",schedule:"Tiempo completo",requirements:["Prácticas supervisadas o experiencia relevante","Uso de herramientas bajo supervisión"],note:"Las prácticas se describen como tales; no equivalen a una certificación." },
  { id:"o07",companyId:"c05",title:"Auxiliar de producción agrícola",occupation:"agricultura",minMonths:0,baseMin:4300,baseMax:4700,incentive:250,openings:4,region:"CE1",economicActivity:"agricola",schedule:"Tiempo completo",requirements:["Interés en producción agrícola","Conversar tareas, jornada y traslado"],note:"El centro de trabajo ficticio está en Villa Nueva, departamento de Guatemala." },
  { id:"o08",companyId:"c06",title:"Soporte de atención digital",occupation:"soporte",minMonths:0,baseMin:4800,baseMax:5300,incentive:250,openings:2,region:"CE1",economicActivity:"no_agricola",schedule:"Tiempo completo",requirements:["Uso básico de correo y documentos","Interés en atención a usuarios"],note:"La disponibilidad de medio tiempo debe conversarse; no se prorratea el salario automáticamente." },
];
export const salaryReference = {
  year: 2026, validFrom: "2026-01-01", validThrough: "2026-12-31", verifiedAt: "2026-09-08", agreement: "Acuerdo Gubernativo 256-2025",
  sources: [
    { title: "MINTRAB · Acuerdo Gubernativo 256-2025", url: "https://www.mintrabajo.gob.gt/doc/AcuerdosGubernativos/2025/Acuerdo%20Gubernativo%20256-2025%20Salario%20Minino.pdf" },
    { title: "MINTRAB · Memoria de Labores 2025, tablas 6 y 7", url: "https://www.mintrabajo.gob.gt/doc/MemoriaDeLabores/Memoria%20de%20Labores%202025.pdf" },
  ],
  rates: [
    { region:"CE1",activity:"agricola",label:"Agrícola",base:3791.20,incentive:250,total:4041.20 },
    { region:"CE1",activity:"no_agricola",label:"No agrícola",base:4002.28,incentive:250,total:4252.28 },
    { region:"CE1",activity:"maquila",label:"Exportación y maquila",base:3409.73,incentive:250,total:3659.73 },
    { region:"CE2",activity:"agricola",label:"Agrícola",base:3625.89,incentive:250,total:3875.89 },
    { region:"CE2",activity:"no_agricola",label:"No agrícola",base:3816.90,incentive:250,total:4066.90 },
    { region:"CE2",activity:"maquila",label:"Exportación y maquila",base:3221.10,incentive:250,total:3471.10 },
  ],
};

type Scenario = { profile: Profile; answers: Questionnaire; story: string; cohort: string };
const scenarioRows = [
  ["p001","electricidad",6200,24,"Sí","No","No","No","Técnica","Instalaciones eléctricas y lectura básica de planos en un taller ficticio.","Organización de herramientas y registro de materiales","Continuar mi desarrollo en instalaciones eléctricas."],
  ["p002","refrigeracion",6000,18,"Sí","No","No","No","Técnica","Mantenimiento preventivo bajo supervisión en un taller ficticio.","Registro de revisiones y organización de herramientas","Desarrollarme en mantenimiento de refrigeración."],
  ["p003","soporte",5100,12,"Sí","No","No","No","Cursos","Atención por chat y registro de solicitudes en un proyecto ficticio.","Correo, hojas de cálculo y atención escrita","Trabajar en soporte y atención digital."],
  ["p004","ventas",4700,18,"Sí","No","No","No","Otra","Atención de mostrador en un comercio ficticio.","Organización de productos y trato con clientes","Continuar en atención comercial."],
  ["p005","electricidad",5200,6,"Sí","No","Sí","No","Técnica","Seis meses de prácticas supervisadas de instalaciones.","Identificación de materiales y seguimiento de instrucciones","Encontrar una oportunidad técnica con acompañamiento."],
  ["p006","barista",4750,6,"No","No","Sí","Sí","Otra","Apoyo durante seis meses en una cafetería familiar ficticia.","Atención a clientes y organización de pedidos","Desarrollarme en el servicio de café."],
  ["p007","administracion",4600,0,"No","No","Sí","Sí","Cursos","Organización de actividades comunitarias ficticias.","Documentos digitales y organización de reuniones","Iniciar mi camino en administración."],
  ["p008","administracion",4800,8,"No","No","No","Sí","Otra","Ocho meses de apoyo informal en agenda, recibos y archivo de un negocio familiar ficticio.","Organización de documentos, agenda y recibos","Convertir mi experiencia de apoyo en una oportunidad administrativa."],
  ["p009","agricultura",4300,3,"No","No","Sí","Sí","Técnica","Tres meses de prácticas en un huerto ficticio: riego y registro de cosecha.","Organización y seguimiento de registros","Continuar aprendiendo sobre producción agrícola."],
  ["p010","barista",4500,0,"No","No","Sí","Sí","Otra","Apoyo en actividades comunitarias ficticias. Sin experiencia preparando café.","Organización, colaboración y atención a personas","Quiero aprender a preparar café y encontrar mi primer empleo."],
  ["p011","soporte",4800,0,"No","No","Sí","Sí","Cursos","Práctica personal de correo y documentos en un curso ficticio.","Correo y documentos básicos","Conseguir una primera experiencia en atención digital."],
  ["p012","refrigeracion",5000,6,"No","Sí","Sí","Sí","Técnica","Seis meses de prácticas supervisadas de mantenimiento. Usa un teléfono compartido.","Registro de tareas y organización de herramientas","Trabajar en refrigeración con apoyo para enviar mis documentos."],
] as const;
export const scenarios: Record<string, Scenario> = Object.fromEntries(scenarioRows.map(([id,occupation,salary,months,cv,digital,training,help,formation,experience,skills,objective]) => [id, {
  cohort: "Piloto septiembre 2026", story: objective,
  profile: { education:"Diversificado",trainingType:formation === "Técnica" ? "tecnica" : formation === "Cursos" ? "curso" : "otra",interest:occupations.find(item => item.id === occupation)!.area,experience,skills,availability:["p007","p011"].includes(id) ? "Medio tiempo" : "Tiempo completo",digitalBarrier:digital,hasCV:cv,objective },
  answers: { occupation,expectedSalary:String(salary),experienceMonths:String(months),cvUpdated:cv,clarity:"Tengo una idea clara",digitalAccess:digital === "Sí" ? "Necesito apoyo" : "Acceso frecuente",wantsTraining:training,experienceHelp:help },
}]));
