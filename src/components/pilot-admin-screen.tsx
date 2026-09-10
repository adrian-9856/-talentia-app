"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowsClockwise, CheckCircle, FileText, Funnel, Path, Users } from "@phosphor-icons/react";
import type { PilotRecord, PilotRouteCode } from "../domain/pilot.ts";
import { occupationLabel } from "../data/labor-market.ts";
import { programLabel } from "../domain/config.ts";
import { formatDate, initials, Loading, Shell } from "./shared";
import { Metric } from "./analytics-shared";
import Link from "./safe-link";
import { pilotDemoRecords } from "../data/pilot-demo.ts";

const routeTone: Record<PilotRouteCode, string> = { A: "amber", B: "blue", C: "green" };

export default function PilotAdminScreen() {
  const [records, setRecords] = useState<PilotRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [route, setRoute] = useState<"" | PilotRouteCode>("");
  const [selectedId, setSelectedId] = useState("");
  const [mode, setMode] = useState<"demo" | "live">("demo");

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      const response = await fetch("/api/pilot/participants", { cache: "no-store" });
      const result = await response.json() as { records?: PilotRecord[]; error?: string };
      if (!response.ok) throw new Error(result.error || "No se pudo abrir el piloto compartido.");
      setRecords(result.records ?? []); setError("");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo abrir el piloto compartido."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const initial = window.setTimeout(() => void load(), 0);
    const timer = window.setInterval(() => void load(true), 10_000);
    return () => { window.clearTimeout(initial); window.clearInterval(timer); };
  }, [load]);

  const visibleRecords = mode === "demo" ? pilotDemoRecords : records;
  const filtered = useMemo(() => visibleRecords.filter(record => {
    const text = `${record.name} ${record.email} ${record.municipality} ${programLabel(record.programId)} ${occupationLabel(record.questionnaire.occupation)}`.toLowerCase();
    return (!query || text.includes(query.toLowerCase())) && (!route || record.routeCode === route);
  }), [query, visibleRecords, route]);
  const selected = visibleRecords.find(record => record.id === selectedId) ?? filtered[0];
  const cvPending = visibleRecords.filter(record => record.documentStatus !== "CV declarado como actualizado").length;

  return <Shell viewRole="team"><div className="pilot-hero"><div><span className="eyebrow">CENTRO DE OPERACIONES · PILOTO FUNCIONAL</span><h1>Siete personas avanzan.<br/><em>Una operadora sabe qué sigue.</em></h1><p>TALENTIA convierte cada formulario en una ruta explicable, una próxima acción y una cola de trabajo priorizada.</p></div><div className="pilot-hero-action"><strong>{mode === "demo" ? "7" : records.length}</strong><span>expedientes visibles</span><button className="button secondary" onClick={() => void load()} disabled={loading}><ArrowsClockwise size={17}/>Actualizar</button></div></div>
    <section className="automation-flow" aria-label="Transformación de la información"><div><span>01</span><strong>La persona responde</strong><small>Datos, experiencia e intereses</small></div><i/><div><span>02</span><strong>El sistema interpreta</strong><small>Detecta apoyos y señales</small></div><i/><div><span>03</span><strong>Propone una ruta</strong><small>A, B o C con explicación</small></div><i/><div><span>04</span><strong>El equipo actúa</strong><small>Una próxima acción concreta</small></div></section>
    {error && <div className="notice error-notice" role="alert"><strong>No pudimos cargar el panel.</strong><p>{error}</p><button className="button secondary" onClick={() => void load()}>Reintentar</button></div>}
    {loading ? <Loading/> : <>
      <div className="metrics-grid four"><Metric label="Expedientes organizados" value={visibleRecords.length} detail={mode === "demo" ? "Escenario de la presentación" : "Enviados por participantes"} accent><Users size={22}/></Metric><Metric label="Ruta A · Preparar" value={visibleRecords.filter(record => record.routeCode === "A").length} detail="Mayor acompañamiento inicial"><Path size={22}/></Metric><Metric label="CV por trabajar" value={cvPending} detail="Creación, revisión o conversación"><FileText size={22}/></Metric><Metric label="Acciones por atender" value={visibleRecords.filter(record => record.requiresReview).length} detail="Cola priorizada de la operadora"><CheckCircle size={22}/></Metric></div>
      <section className="panel pilot-control"><div className="panel-heading"><div><h2>Bandeja de decisiones</h2><p>Selecciona una persona y comprueba cómo sus respuestas se vuelven trabajo concreto.</p></div><div className="pilot-mode" aria-label="Fuente de expedientes"><button className={mode === "demo" ? "active" : ""} onClick={() => { setMode("demo"); setSelectedId(""); }}>Demostración <b>7</b></button><button className={mode === "live" ? "active" : ""} onClick={() => { setMode("live"); setSelectedId(""); }}>Recibidos en vivo <b>{records.length}</b></button></div></div><div className="filters-row"><label className="field search-field"><span className="sr-only">Buscar recorridos</span><span className="search-symbol">⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar participante, carrera o municipio"/></label><label className="field"><span className="sr-only">Filtrar por ruta</span><select value={route} onChange={event => setRoute(event.target.value as "" | PilotRouteCode)}><option value="">Todas las rutas</option><option value="A">Ruta A</option><option value="B">Ruta B</option><option value="C">Ruta C</option></select></label>{(query || route) && <button className="text-button" onClick={() => { setQuery(""); setRoute(""); }}><Funnel size={15}/>Limpiar</button>}<span className="live-indicator"><i/>{mode === "live" ? "Actualización cada 10 segundos" : "Casos ficticios preparados"}</span></div>
        {filtered.length ? <div className="pilot-split"><div className="pilot-record-list" aria-label="Recorridos recibidos">{filtered.map(record => <button key={record.id} className={`pilot-record ${selected?.id === record.id ? "selected" : ""}`} onClick={() => setSelectedId(record.id)}><span className="avatar">{initials(record.name)}</span><span><strong>{record.name}</strong><small>{occupationLabel(record.questionnaire.occupation)} · {record.municipality}</small></span><span className={`badge ${routeTone[record.routeCode]}`}>Ruta {record.routeCode}</span></button>)}</div>{selected && <article className="pilot-result"><div className="pilot-result-heading"><div><span className="eyebrow">TRANSFORMACIÓN AUTOMÁTICA</span><h2>{selected.name}</h2><p>{programLabel(selected.programId)} · recibido {formatDate(selected.updatedAt)}</p></div><span className={`route-orb ${selected.routeCode.toLowerCase()}`}>{selected.routeCode}</span></div><div className="pilot-route-name"><span>Ruta sugerida</span><strong>{selected.routeName}</strong><p>{selected.routePurpose}</p></div><div className="pilot-result-grid"><div><span>Ocupación de interés</span><strong>{occupationLabel(selected.questionnaire.occupation)}</strong></div><div><span>Estado documental</span><strong>{selected.documentStatus}</strong></div><div><span>Avance de ruta</span><strong>{selected.completedSteps} de {selected.totalSteps} actividades</strong></div><div><span>Próxima acción</span><strong>{selected.nextAction}</strong></div></div><section className="signal-block"><span className="eyebrow">SEÑALES QUE EXPLICAN LA PROPUESTA</span>{selected.supportSignals.length ? <ul>{selected.supportSignals.map(signal => <li key={signal}><CheckCircle size={15}/>{signal}</li>)}</ul> : <p>No se declararon apoyos adicionales. El equipo confirma la información antes de avanzar.</p>}</section><details className="pilot-raw"><summary>Ver respuestas que originaron este resultado</summary><dl><div><dt>Objetivo</dt><dd>{selected.profile.objective || "Por conversar"}</dd></div><div><dt>Experiencia</dt><dd>{selected.profile.experience || "Por conversar"}</dd></div><div><dt>Habilidades</dt><dd>{selected.profile.skills || "Por conversar"}</dd></div><div><dt>Disponibilidad</dt><dd>{selected.profile.availability || "Por conversar"}</dd></div></dl></details></article>}</div> : <div className="empty-state"><Users size={34}/><h3>{records.length ? "No hay resultados con estos filtros." : "Esperando el primer recorrido."}</h3><p>{records.length ? "Limpia los filtros para ver todos los expedientes." : "Pide a una participante que complete su ruta y pulse “Enviar al panel”."}</p><Link className="button primary" href="/participante">Abrir vista participante</Link></div>}
      </section><p className="data-caption">Piloto funcional con datos ficticios. Las rutas son sugerencias explicables; no califican empleabilidad ni realizan postulaciones.</p>
    </>}
  </Shell>;
}
