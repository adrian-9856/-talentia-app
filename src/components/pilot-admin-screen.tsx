"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowsClockwise, CheckCircle, FileText, Funnel, Path, Users } from "@phosphor-icons/react";
import type { PilotRecord, PilotRouteCode } from "../domain/pilot.ts";
import { occupationLabel } from "../data/labor-market.ts";
import { programLabel } from "../domain/config.ts";
import { formatDate, initials, Loading, Shell } from "./shared";
import { Metric } from "./analytics-shared";
import Link from "./safe-link";

const routeTone: Record<PilotRouteCode, string> = { A: "amber", B: "blue", C: "green" };

export default function PilotAdminScreen() {
  const [records, setRecords] = useState<PilotRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [route, setRoute] = useState<"" | PilotRouteCode>("");
  const [selectedId, setSelectedId] = useState("");

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

  const filtered = useMemo(() => records.filter(record => {
    const text = `${record.name} ${record.email} ${record.municipality} ${programLabel(record.programId)} ${occupationLabel(record.questionnaire.occupation)}`.toLowerCase();
    return (!query || text.includes(query.toLowerCase())) && (!route || record.routeCode === route);
  }), [query, records, route]);
  const selected = records.find(record => record.id === selectedId) ?? filtered[0];
  const cvPending = records.filter(record => record.documentStatus !== "CV declarado como actualizado").length;

  return <Shell viewRole="team"><div className="page-heading pilot-heading"><div><span className="eyebrow">PILOTO COMPARTIDO · ACTUALIZACIÓN AUTOMÁTICA</span><h1>Una operadora, siete recorridos.</h1><p>Cada participante llena su información. TALENTIA la ordena y muestra únicamente lo que requiere atención.</p></div><button className="button secondary" onClick={() => void load()} disabled={loading}><ArrowsClockwise size={17}/>Actualizar</button></div>
    {error && <div className="notice error-notice" role="alert"><strong>No pudimos cargar el panel.</strong><p>{error}</p><button className="button secondary" onClick={() => void load()}>Reintentar</button></div>}
    {loading ? <Loading/> : <>
      <div className="metrics-grid four"><Metric label="Recorridos recibidos" value={records.length} detail="Meta de la sesión: 7" accent><Users size={22}/></Metric><Metric label="Ruta A · Preparar" value={records.filter(record => record.routeCode === "A").length} detail="Mayor acompañamiento inicial"><Path size={22}/></Metric><Metric label="CV por trabajar" value={cvPending} detail="Creación, revisión o conversación"><FileText size={22}/></Metric><Metric label="Listos para revisión" value={records.filter(record => record.requiresReview).length} detail="Cola de trabajo de la operadora"><CheckCircle size={22}/></Metric></div>
      <section className="panel pilot-control"><div className="panel-heading"><div><h2>Bandeja de transformación</h2><p>Del formulario individual a una lista operativa común.</p></div><span className="live-indicator"><i/>Se actualiza cada 10 segundos</span></div><div className="filters-row"><label className="field search-field"><span className="sr-only">Buscar recorridos</span><span className="search-symbol">⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar participante, carrera o municipio"/></label><label className="field"><span className="sr-only">Filtrar por ruta</span><select value={route} onChange={event => setRoute(event.target.value as "" | PilotRouteCode)}><option value="">Todas las rutas</option><option value="A">Ruta A</option><option value="B">Ruta B</option><option value="C">Ruta C</option></select></label>{(query || route) && <button className="text-button" onClick={() => { setQuery(""); setRoute(""); }}><Funnel size={15}/>Limpiar</button>}</div>
        {filtered.length ? <div className="pilot-split"><div className="pilot-record-list" aria-label="Recorridos recibidos">{filtered.map(record => <button key={record.id} className={`pilot-record ${selected?.id === record.id ? "selected" : ""}`} onClick={() => setSelectedId(record.id)}><span className="avatar">{initials(record.name)}</span><span><strong>{record.name}</strong><small>{occupationLabel(record.questionnaire.occupation)} · {record.municipality}</small></span><span className={`badge ${routeTone[record.routeCode]}`}>Ruta {record.routeCode}</span></button>)}</div>{selected && <article className="pilot-result"><div className="pilot-result-heading"><div><span className="eyebrow">TRANSFORMACIÓN AUTOMÁTICA</span><h2>{selected.name}</h2><p>{programLabel(selected.programId)} · recibido {formatDate(selected.updatedAt)}</p></div><span className={`route-orb ${selected.routeCode.toLowerCase()}`}>{selected.routeCode}</span></div><div className="pilot-route-name"><span>Ruta sugerida</span><strong>{selected.routeName}</strong><p>{selected.routePurpose}</p></div><div className="pilot-result-grid"><div><span>Ocupación de interés</span><strong>{occupationLabel(selected.questionnaire.occupation)}</strong></div><div><span>Estado documental</span><strong>{selected.documentStatus}</strong></div><div><span>Avance de ruta</span><strong>{selected.completedSteps} de {selected.totalSteps} actividades</strong></div><div><span>Próxima acción</span><strong>{selected.nextAction}</strong></div></div><section className="signal-block"><span className="eyebrow">SEÑALES QUE EXPLICAN LA PROPUESTA</span>{selected.supportSignals.length ? <ul>{selected.supportSignals.map(signal => <li key={signal}><CheckCircle size={15}/>{signal}</li>)}</ul> : <p>No se declararon apoyos adicionales. El equipo confirma la información antes de avanzar.</p>}</section><details className="pilot-raw"><summary>Ver respuestas que originaron este resultado</summary><dl><div><dt>Objetivo</dt><dd>{selected.profile.objective || "Por conversar"}</dd></div><div><dt>Experiencia</dt><dd>{selected.profile.experience || "Por conversar"}</dd></div><div><dt>Habilidades</dt><dd>{selected.profile.skills || "Por conversar"}</dd></div><div><dt>Disponibilidad</dt><dd>{selected.profile.availability || "Por conversar"}</dd></div></dl></details></article>}</div> : <div className="empty-state"><Users size={34}/><h3>{records.length ? "No hay resultados con estos filtros." : "Esperando el primer recorrido."}</h3><p>{records.length ? "Limpia los filtros para ver todos los expedientes." : "Pide a una participante que complete su ruta y pulse “Enviar al panel”."}</p><Link className="button primary" href="/participante">Abrir vista participante</Link></div>}
      </section><p className="data-caption">Piloto funcional con datos ficticios. Las rutas son sugerencias explicables; no califican empleabilidad ni realizan postulaciones.</p>
    </>}
  </Shell>;
}
