"use client";
import { useEffect, useRef, useState } from "react";
import Link from "./safe-link";
import { useSearchParams } from "next/navigation";
import { config, programLabel, stateLabel } from "../domain/config.ts";
import { blankFilters, filterParticipants } from "../domain/repository.ts";
import type { DemoState, Participant, TeamFilters } from "../domain/types.ts";
import { ErrorNotice, formatDate, initials, Loading, ProfileDetails, Shell, StatusBadge } from "./shared";
import { messageFrom, useDemo } from "./use-demo";
import { getJourney, money, participantProfile } from "../domain/guidance.ts";
import { occupationLabel } from "../data/labor-market.ts";
import { JourneyView } from "./journey-components";

type PendingChange = { from: string; to: string };
function ConfirmChange({ person, pending, confirm, cancel, error }: { person: Participant; pending: PendingChange; confirm: () => void; cancel: () => void; error: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { dialog.current?.showModal(); }, []);
  return <dialog className="confirm-dialog" ref={dialog} aria-labelledby="confirm-title" onCancel={cancel} onClose={cancel}>
    <span className="eyebrow">CONFIRMAR CAMBIO</span><h2 id="confirm-title">Actualizar el estado de {person.name}</h2>
    <div className="status-comparison"><StatusBadge status={pending.from} /><span aria-hidden="true">→</span><StatusBadge status={pending.to} /></div>
    <p>Quedará registrado el cambio con la fecha y el responsable: <strong>{config.actor}</strong>.</p>
    <p className="muted small">Cambiar el estado no crea ni confirma un perfil, una ruta o un CV.</p>
    {error && <ErrorNotice message={error} />}
    <div className="form-actions"><button className="button secondary" onClick={cancel}>Cancelar</button><button className="button primary" onClick={confirm}>Confirmar cambio</button></div>
  </dialog>;
}

function Detail({ person, saveStatus, back, demo, state }: { person: Participant; saveStatus: (change: PendingChange) => boolean; back: () => void; demo:ReturnType<typeof useDemo>; state:DemoState }) {
  const [nextStatus, setNextStatus] = useState(person.enrollment.status);
  const [pending, setPending] = useState<PendingChange | null>(null);
  const [tab, setTab] = useState<"profile" | "history" | "route">("route");
  const [notice, setNotice] = useState("");
  const [confirmError, setConfirmError] = useState("");
  function confirm() {
    if (pending && saveStatus(pending)) { setPending(null); setConfirmError(""); setNotice("Estado actualizado. El cambio quedó guardado en el historial."); }
    else setConfirmError("No se guardó el cambio. Revisa el aviso del expediente; si el estado cambió en otra vista, cancela y vuelve a seleccionarlo.");
  }
  return <>
    <button className="text-button back-button" onClick={back}>← Volver a participantes</button>
    <div className="detail-heading"><div className="person-name"><span className="avatar large">{initials(person.name)}</span><div><span className="eyebrow">EXPEDIENTE DE DEMOSTRACIÓN</span><h1>{person.name}</h1><p>{programLabel(person.enrollment.programId)} · {person.municipality}</p></div></div><StatusBadge status={person.enrollment.status} /></div>
    {notice && <div className="notice success-notice" role="status">{notice}</div>}
    <div className="detail-layout"><section className="panel detail-panel">
      <div className="detail-tabs" aria-label="Secciones del expediente"><button aria-pressed={tab === "route"} className={tab === "route" ? "active" : ""} onClick={() => setTab("route")}>Ruta y oportunidades</button><button aria-pressed={tab === "profile"} className={tab === "profile" ? "active" : ""} onClick={() => setTab("profile")}>Expediente</button><button aria-pressed={tab === "history"} className={tab === "history" ? "active" : ""} onClick={() => setTab("history")}>Historial <span className="count-tag">{person.history.length}</span></button></div>
      {tab === "route" ? <JourneyView demo={demo} state={state} person={person} team/> : tab === "profile" ? <ProfileDetails person={person} /> : <section className="detail-section"><h3>Historial de cambios</h3><p className="small muted">Cada actualización conserva el estado anterior y quién realizó el cambio en el demo.</p>{person.history.length ? <ol className="history-list">{[...person.history].reverse().map(event => <li key={event.id}><span className="timeline-dot" /><div><strong>{stateLabel(event.from)} <span aria-hidden="true">→</span> {stateLabel(event.to)}</strong><p>{formatDate(event.changedAt)} · {event.changedBy}</p></div></li>)}</ol> : <div className="empty-inline"><strong>Aún no hay cambios de estado.</strong><p>Las actualizaciones confirmadas por el equipo aparecerán aquí.</p></div>}</section>}
    </section><aside className="followup-card"><span className="eyebrow">ACOMPAÑAMIENTO</span><h2>Actualizar estado</h2><p>Registra el momento en que se encuentra esta persona.</p>
      <label className="field" htmlFor="next-status">Nuevo estado<select id="next-status" value={nextStatus} onChange={event => { setNextStatus(event.target.value); setNotice(""); }}>
        {config.states.filter(state => state.id === person.enrollment.status || config.transitions[person.enrollment.status]?.includes(state.id)).map(state => <option value={state.id} key={state.id}>{state.label}</option>)}
      </select></label>
      <button className="button primary full" disabled={nextStatus === person.enrollment.status} onClick={() => { setConfirmError(""); setPending({ from: person.enrollment.status, to: nextStatus }); }}>Revisar cambio →</button>
      {nextStatus === person.enrollment.status && <p className="small muted">Elige un estado diferente para actualizarlo.</p>}
      <div className="method-note"><strong>Estados de demostración</strong><p>El equipo puede corregirlos manualmente. Los criterios y cambios oficiales están pendientes de validar.</p></div>
      <p className="small muted">Responsable: {config.actor}<br />Último estado: {formatDate(person.enrollment.statusChangedAt)}</p>
    </aside></div>
    {pending && <ConfirmChange person={person} pending={pending} confirm={confirm} cancel={() => setPending(null)} error={confirmError} />}
  </>;
}

export default function TeamScreen() {
  const demo = useDemo(); const { state, loading, error } = demo;
  const params = useSearchParams();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const filters = state?.teamFilters ?? blankFilters();
  const people = filterParticipants(state?.participants ?? [], filters);
  const selected = state?.participants.find(person => person.id === (selectedId ?? params.get("persona")));
  const activeFilters = !!(filters.query || filters.program || filters.status);
  function changeFilters(next: TeamFilters) {
    try { demo.run(repo => repo.saveFilters(next)); } catch (cause) { demo.setError(messageFrom(cause)); }
  }
  function saveStatus(change: PendingChange) {
    if (!selected) return false;
    try { demo.run(repo => repo.changeStatus(selected.id, change.to, change.from)); return true; }
    catch (cause) { demo.setError(messageFrom(cause)); return false; }
  }
  return <Shell viewRole="team">
    {error && <ErrorNotice message={error} retry={demo.retry} />}
    {loading ? <Loading /> : state && (selected ? <Detail key={selected.id} person={selected} saveStatus={saveStatus} back={() => setSelectedId("")} demo={demo} state={state} /> : <>
      <div className="page-heading"><div><span className="eyebrow">CONOCER PARA ACOMPAÑAR</span><h1>Participantes</h1><p>Cada expediente reúne una historia, un objetivo y un próximo paso.</p></div><Link className="button primary" href="/participante">Abrir vista participante <span aria-hidden="true">↗</span></Link></div>
      <div className="metrics-grid">
        <article className="metric-card featured"><span>Participantes</span><strong>{people.length.toString().padStart(2, "0")}</strong><small>{activeFilters ? "En los filtros actuales" : "En esta demostración"}</small><span className="metric-decoration" aria-hidden="true">↗</span></article>
        <article className="metric-card"><span>Perfiles consultables</span><strong>{people.filter(person => participantProfile(person)).length.toString().padStart(2, "0")}</strong><small>Escenarios de ejemplo + perfiles guardados</small></article>
        <article className="metric-card"><span>En acompañamiento</span><strong>{people.filter(person => person.enrollment.status === "en_acompanamiento").length.toString().padStart(2, "0")}</strong><small>Según el estado registrado</small></article>
      </div>
      <section className="panel participants-panel"><div className="panel-heading"><div><h2>Participantes <span className="count-tag">{people.length}</span></h2><p>Información organizada para un acompañamiento cercano.</p></div><span className="small muted">{state.participants.length} expedientes en total</span></div>
        <div className="filters-row"><label className="field search-field" htmlFor="search"><span className="sr-only">Buscar por nombre o correo</span><span className="search-symbol" aria-hidden="true">⌕</span><input id="search" type="search" placeholder="Buscar por nombre o correo…" value={filters.query} onChange={event => changeFilters({ ...filters, query: event.target.value })} /></label>
          <label className="field" htmlFor="filter-program"><span className="sr-only">Filtrar por programa</span><select id="filter-program" value={filters.program} onChange={event => changeFilters({ ...filters, program: event.target.value })}><option value="">Todos los programas</option>{config.programs.map(program => <option key={program.id} value={program.id}>{program.name}</option>)}</select></label>
          <label className="field" htmlFor="filter-state"><span className="sr-only">Filtrar por estado</span><select id="filter-state" value={filters.status} onChange={event => changeFilters({ ...filters, status: event.target.value })}><option value="">Todos los estados</option>{config.states.map(status => <option key={status.id} value={status.id}>{status.label}</option>)}</select></label>
          {activeFilters && <button className="text-button" onClick={() => changeFilters(blankFilters())}>Limpiar</button>}
        </div>
        <p className="sr-only" role="status">{people.length} participantes encontrados.</p>
        {people.length ? <div className="table-scroll"><table><caption className="sr-only">Participantes correspondientes a los filtros actuales</caption><thead><tr><th scope="col">Participante</th><th scope="col">Programa</th><th scope="col">Estado</th><th scope="col">Perfil laboral</th><th scope="col"><span className="sr-only">Abrir expediente</span></th></tr></thead><tbody>{people.map(person => <tr key={person.id}>
          <td><div className="person-cell"><span className="avatar">{initials(person.name)}</span><div><button className="name-link" onClick={() => setSelectedId(person.id)}>{person.name}</button><small>{person.municipality}</small></div></div></td>
          <td className="program-cell">{programLabel(person.enrollment.programId)}</td><td><StatusBadge status={person.enrollment.status} /></td>
          <td><span className="profile-indicator saved">{occupationLabel(getJourney(state,person)?.answers.occupation??"")}</span><small className="cell-subtext">{getJourney(state,person)?.answers.expectedSalary?`${money(+getJourney(state,person)!.answers.expectedSalary)} base / mes`:"Expectativa por conversar"}</small></td>
          <td><button className="open-record" aria-label={`Ver expediente de ${person.name}`} onClick={() => setSelectedId(person.id)}>Ver <span aria-hidden="true">↗</span></button></td>
        </tr>)}</tbody></table></div> : <div className="empty-state"><span className="empty-symbol" aria-hidden="true">◎</span><h3>{state.participants.length ? "No encontramos coincidencias" : "El primer expediente empieza aquí"}</h3><p>{state.participants.length ? "Prueba con otro nombre o cambia los filtros." : "Registra una persona ficticia para comenzar a probar el acompañamiento."}</p>{activeFilters ? <button className="button secondary" onClick={() => changeFilters(blankFilters())}>Limpiar filtros</button> : <Link className="button primary" href="/participante">Comenzar un registro</Link>}</div>}
        <div className="table-footer"><span>{people.length} de {state.participants.length} participantes</span><span>Ordenados por nombre · Datos ficticios</span></div>
      </section>
      <div className="human-note"><span aria-hidden="true">◇</span><p><strong>La orientación sigue siendo humana.</strong> Los estados ayudan a organizar el acompañamiento; no evalúan las capacidades de una persona.</p></div>
    </>)}
  </Shell>;
}
