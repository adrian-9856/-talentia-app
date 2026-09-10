import { scenarios } from "./labor-market.ts";
import { transformPilotSubmission, type PilotRecord, type PilotSubmissionInput } from "../domain/pilot.ts";

const people = [
  ["p010", "Julia Méndez", "Guatemala", "prog-emp"],
  ["p008", "Helena López", "Mixco", "prog-emp"],
  ["p012", "Laura Pérez", "Villa Nueva", "prog-tec"],
  ["p007", "María Castillo", "Mixco", "prog-dig"],
  ["p006", "Ana Morales", "Guatemala", "prog-emp"],
  ["p003", "Sofía Ramírez", "Guatemala", "prog-dig"],
  ["p001", "Elena García", "Villa Nueva", "prog-tec"],
] as const;

export const pilotDemoRecords: PilotRecord[] = people.map(([scenarioId, name, municipality, programId], index) => {
  const scenario = scenarios[scenarioId];
  const input: PilotSubmissionInput = {
    participantId: `demo-${scenarioId}`,
    name,
    email: `${name.split(" ")[0].toLowerCase()}${index + 1}@example.com`,
    municipality,
    programId,
    consentAt: "2026-09-08T15:00:00.000Z",
    profile: scenario.profile,
    questionnaire: scenario.answers,
    routeSteps: [
      { title: "Confirmar objetivo laboral", status: index > 4 ? "completado" : "en_proceso" },
      { title: scenario.answers.cvUpdated === "Sí" ? "Revisar CV" : "Crear o actualizar CV", status: index > 5 ? "completado" : "pendiente" },
      { title: "Conversar oportunidades compatibles", status: "pendiente" },
    ],
  };
  return {
    ...input,
    ...transformPilotSubmission(input),
    id: `demo-${index + 1}`,
    createdAt: `2026-09-08T${15 + index}:00:00.000Z`,
    updatedAt: `2026-09-08T${15 + index}:15:00.000Z`,
  };
});
