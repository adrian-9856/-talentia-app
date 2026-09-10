"use client";
import { useState } from "react";
import { ArrowRight, CheckCircle, PaperPlaneTilt } from "@phosphor-icons/react";
import type { DemoState, Participant } from "../domain/types.ts";
import { getJourney, participantProfile } from "../domain/guidance.ts";
import Link from "./safe-link";

export function PilotShare({ state, person }: { state: DemoState; person: Participant }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const journey = getJourney(state, person);
  const profile = participantProfile(person);
  if (!journey || person.source !== "registration" || !profile || !person.consentAt) return null;
  const sharedJourney = journey;
  const sharedProfile = profile;

  async function submit() {
    setStatus("sending"); setError("");
    try {
      const response = await fetch("/api/pilot/participants", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          participantId: person.id,
          name: person.name,
          email: person.email,
          municipality: person.municipality,
          programId: person.enrollment.programId,
          consentAt: person.consentAt,
          profile: sharedProfile,
          questionnaire: sharedJourney.answers,
          routeSteps: sharedJourney.steps.map(step => ({ title: step.title, status: step.status })),
        }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "No se pudo enviar el expediente.");
      setStatus("sent");
    } catch (cause) {
      setStatus("idle");
      setError(cause instanceof Error ? cause.message : "No se pudo enviar el expediente.");
    }
  }

  return <section className={`pilot-share ${status === "sent" ? "sent" : ""}`} aria-live="polite">
    <div className="pilot-share-icon">{status === "sent" ? <CheckCircle size={25} weight="fill"/> : <PaperPlaneTilt size={24}/>}</div>
    <div><span className="eyebrow">PILOTO COMPARTIDO</span><h3>{status === "sent" ? "Tu resultado ya está en el panel." : "Convierte tus respuestas en información útil"}</h3><p>{status === "sent" ? "El equipo puede ver tu ruta, los apoyos sugeridos, el estado del CV y tu siguiente acción." : "Envía una copia de este expediente ficticio al panel común que utilizará el equipo durante la presentación."}</p>{error && <p className="field-error">{error}</p>}</div>
    {status === "sent" ? <Link className="button secondary" href="/equipo/piloto">Ver transformación <ArrowRight size={15}/></Link> : <button className="button primary" disabled={status === "sending"} onClick={submit}>{status === "sending" ? "Enviando…" : "Enviar al panel"}<ArrowRight size={15}/></button>}
  </section>;
}
