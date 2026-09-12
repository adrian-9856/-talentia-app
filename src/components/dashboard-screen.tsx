"use client";
import Link from "./safe-link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowUp, ArrowDown, ArrowUpRight, EyeSlash, Plus, DotsThreeVertical, SquaresFour, ArrowsClockwise, MagnifyingGlass, Question } from "@phosphor-icons/react";
import { Tour, type TourStep } from "./tour";

const ADMIN_TOUR: TourStep[] = [
  { target: "", title: "Bienvenido al tablero del equipo", body: "Este es tu dashboard personalizable. Aquí ves de un vistazo qué está pasando con todas las personas del programa, y puedes armar tu vista a la medida." },
  { target: ".admin-toolbar", title: "Vistas rápidas y personalización", body: "Elige una vista predefinida (Ejecutiva, Operativa, Colocación) o añade tus propios widgets con el botón + para armar tu configuración ideal." },
  { target: ".quick-search", title: "Buscador rápido", body: "Escribe cualquier cosa: ocupación, habilidad, municipio o nombre. El sistema busca en toda la base al instante y te muestra las coincidencias." },
  { target: ".admin-grid .widget:first-child", title: "Widgets con datos en vivo", body: "Cada widget te muestra información clave del programa. Los datos se actualizan solos según los participantes registrados." },
  { target: ".widget-actions", title: "Menú de cada widget", body: "En cada widget puedes reorganizarlos: el menú (⋮) te deja subirlo, bajarlo u ocultarlo. Tu configuración se guarda automáticamente." },
  { target: ".sidebar", title: "Navegación entre pantallas", body: "En el sidebar tienes acceso a todas las pantallas del panel: Vista general, Participantes, Empresas, Rutas y más." },
];
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { occupations, occupationLabel } from "../data/labor-market.ts";
import { config } from "../domain/config.ts";
import { getJourney, participantProfile, phases, scorePsychometric, psychometricGroupNames, psychometricGroupColors } from "../domain/guidance.ts";
import { messageFrom, useDemo } from "./use-demo";
import type { DemoState, Participant, PsychometricAnswers } from "../domain/types.ts";
import { ErrorNotice, initials, Loading, Shell, StatusBadge } from "./shared";
import { EmptyChart, PageHeading } from "./analytics-shared";

type WidgetId = "totals" | "funnel" | "occupations" | "urgency" | "psychometric" | "municipality" | "attention";
type Layout = { order: WidgetId[]; hidden: WidgetId[] };

const WIDGET_META: Record<WidgetId, { title: string; subtitle: string; size: "wide" | "narrow" }> = {
  totals:       { title: "Métricas totales",           subtitle: "Resumen numérico del programa",                 size: "wide" },
  funnel:       { title: "Embudo de fases",            subtitle: "Cuántas personas están en cada fase de la ruta", size: "wide" },
  occupations:  { title: "Ocupaciones más buscadas",   subtitle: "Interés declarado por los participantes",       size: "narrow" },
  urgency:      { title: "Nivel de urgencia",          subtitle: "Distribución del diagnóstico inicial",          size: "narrow" },
  psychometric: { title: "Perfiles psicométricos",     subtitle: "Tipo dominante por participante",               size: "narrow" },
  municipality: { title: "Distribución por municipio", subtitle: "De dónde vienen los participantes",             size: "narrow" },
  attention:    { title: "Requieren atención",         subtitle: "Personas con actividades pendientes",           size: "wide" },
};

const DEFAULT_LAYOUT: Layout = { order: ["totals","funnel","occupations","urgency","psychometric","municipality","attention"], hidden: [] };
const PRESETS: Record<string, { label: string; layout: Layout }> = {
  ejecutiva:  { label: "Ejecutiva",  layout: { order: ["totals","funnel","urgency"],                                    hidden: ["occupations","psychometric","municipality","attention"] } },
  operativa:  { label: "Operativa",  layout: { order: ["funnel","attention","occupations","municipality"],              hidden: ["totals","urgency","psychometric"] } },
  colocacion: { label: "Colocación", layout: { order: ["occupations","psychometric","attention","totals"],              hidden: ["funnel","urgency","municipality"] } },
  completa:   { label: "Completa",   layout: DEFAULT_LAYOUT },
};

const STORAGE_KEY = "talentia.admin.layout.v1";

function useLayout(): [Layout, (l: Layout) => void] {
  const [layout, setLayoutState] = useState<Layout>(DEFAULT_LAYOUT);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Layout;
        if (Array.isArray(parsed.order) && Array.isArray(parsed.hidden)) setLayoutState(parsed);
      }
    } catch { /* ignore */ }
  }, []);
  const setLayout = (l: Layout) => {
    setLayoutState(l);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(l)); } catch { /* ignore */ }
  };
  return [layout, setLayout];
}

function WidgetShell({ id, title, subtitle, size, canMoveUp, canMoveDown, onMoveUp, onMoveDown, onHide, children }: {
  id: WidgetId; title: string; subtitle: string; size: "wide"|"narrow";
  canMoveUp: boolean; canMoveDown: boolean;
  onMoveUp: () => void; onMoveDown: () => void; onHide: () => void;
  children: ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menuOpen]);
  return <section className={`widget widget-${size}`} data-widget={id}>
    <header className="widget-head">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <div className="widget-actions">
        <button type="button" className="widget-menu-btn" onClick={(e) => { e.stopPropagation(); setMenuOpen(v => !v); }} aria-label="Acciones del widget"><DotsThreeVertical size={18} weight="bold"/></button>
        {menuOpen && <div className="widget-menu" onClick={(e) => e.stopPropagation()}>
          <button type="button" disabled={!canMoveUp} onClick={() => { onMoveUp(); setMenuOpen(false); }}><ArrowUp size={14}/>Subir</button>
          <button type="button" disabled={!canMoveDown} onClick={() => { onMoveDown(); setMenuOpen(false); }}><ArrowDown size={14}/>Bajar</button>
          <button type="button" onClick={() => { onHide(); setMenuOpen(false); }}><EyeSlash size={14}/>Ocultar</button>
        </div>}
      </div>
    </header>
    <div className="widget-body">{children}</div>
  </section>;
}

function completedStepsCount(state: DemoState, person: Participant): number {
  let count = 1;
  if (state.diagnoses?.[person.id]) count++;
  if (state.psychometrics?.[person.id]) count += 2;
  if (person.profile) count++;
  if (getJourney(state, person)) count += 2;
  if (state.cvData?.[person.id]) count++;
  return count;
}

function participantPhaseIdx(state: DemoState, person: Participant): number {
  const completed = completedStepsCount(state, person);
  if (completed >= 8) return 3;
  if (completed >= 5) return 2;
  if (completed >= 3) return 1;
  return 0;
}

function TotalsWidget({ people, state }: { people: Participant[]; state: DemoState }) {
  const withDiag = people.filter(p => state.diagnoses?.[p.id]).length;
  const withPsych = people.filter(p => state.psychometrics?.[p.id]).length;
  const withCv = people.filter(p => state.cvData?.[p.id]).length;
  const cells = [
    { label: "Registradas", value: people.length, note: "Expedientes activos" },
    { label: "Con diagnóstico", value: withDiag, note: `${people.length?Math.round(withDiag/people.length*100):0}% del total` },
    { label: "Con psicometría", value: withPsych, note: "Test completado" },
    { label: "Con CV listo", value: withCv, note: "Listo para enviar" },
  ];
  return <div className="totals-grid">
    {cells.map(c => <div className="totals-cell" key={c.label}>
      <span>{c.label}</span>
      <strong>{c.value}</strong>
      <small>{c.note}</small>
    </div>)}
  </div>;
}

function FunnelWidget({ people, state }: { people: Participant[]; state: DemoState }) {
  const counts = phases.map((_, idx) => people.filter(p => participantPhaseIdx(state, p) >= idx).length);
  const max = Math.max(...counts, 1);
  return <div className="funnel-list">
    {phases.map((p, idx) => {
      const count = counts[idx];
      const pct = Math.round((count / max) * 100);
      return <div className="funnel-row" key={p.id}>
        <div className="funnel-label"><span className="funnel-num">Fase {p.number}</span><strong>{p.title}</strong></div>
        <div className="funnel-track"><div className="funnel-fill" style={{width:`${pct}%`}}/></div>
        <div className="funnel-count">{count}</div>
      </div>;
    })}
  </div>;
}

function OccupationsWidget({ people, state }: { people: Participant[]; state: DemoState }) {
  const rows = occupations.map(o => ({
    name: o.label,
    count: people.filter(p => getJourney(state, p)?.answers.occupation === o.id).length,
  })).filter(r => r.count > 0).sort((a,b) => b.count - a.count);
  if (!rows.length) return <EmptyChart/>;
  return <ResponsiveContainer width="100%" height={220}>
    <BarChart data={rows} layout="vertical" margin={{top:6,right:20,bottom:0,left:0}}>
      <CartesianGrid horizontal={false} stroke="#edf0f5"/>
      <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} tick={{fontSize:11,fill:"#7b8190"}}/>
      <YAxis dataKey="name" type="category" width={110} tickLine={false} axisLine={false} tick={{fontSize:11,fill:"#515a70"}}/>
      <Tooltip cursor={{fill:"#f5f7fc"}} contentStyle={{borderRadius:8,border:"1px solid #e6e9ef",fontSize:12}}/>
      <Bar dataKey="count" fill="#4665e7" radius={[0,4,4,0]} maxBarSize={14} isAnimationActive={false}/>
    </BarChart>
  </ResponsiveContainer>;
}

function UrgencyWidget({ people, state }: { people: Participant[]; state: DemoState }) {
  const groups = [
    { label: "Alta", key: "Alta – lo necesito pronto", color: "#d94141" },
    { label: "Media", key: "Media – en los próximos meses", color: "#e08a3a" },
    { label: "Baja", key: "Baja – estoy explorando opciones", color: "#33c377" },
    { label: "Sin diagnóstico", key: "__none__", color: "#c5cde0" },
  ];
  const counts = groups.map(g => g.key === "__none__"
    ? people.filter(p => !state.diagnoses?.[p.id]).length
    : people.filter(p => state.diagnoses?.[p.id]?.nivelUrgencia === g.key).length);
  const total = counts.reduce((s,n) => s+n, 0) || 1;
  return <div className="urgency-list">
    {groups.map((g,i) => {
      const c = counts[i];
      const pct = Math.round(c/total*100);
      return <div className="urgency-row" key={g.label}>
        <span className="urgency-dot" style={{background:g.color}}/>
        <span className="urgency-label">{g.label}</span>
        <div className="urgency-track"><div style={{width:`${pct}%`,background:g.color}}/></div>
        <span className="urgency-count">{c} <small>({pct}%)</small></span>
      </div>;
    })}
  </div>;
}

function PsychometricWidget({ people, state }: { people: Participant[]; state: DemoState }) {
  const rows = (["R","I","A","S","E","C"] as const).map(g => ({
    key: g,
    name: psychometricGroupNames[g],
    color: psychometricGroupColors[g],
    count: people.filter(p => {
      const ans = state.psychometrics?.[p.id];
      if (!ans) return false;
      return scorePsychometric(ans as PsychometricAnswers).dominante === g;
    }).length,
  }));
  const hasData = rows.some(r => r.count > 0);
  if (!hasData) return <EmptyChart/>;
  return <ResponsiveContainer width="100%" height={220}>
    <BarChart data={rows} margin={{top:6,right:14,bottom:6,left:0}}>
      <CartesianGrid vertical={false} stroke="#edf0f5"/>
      <XAxis dataKey="key" tickLine={false} axisLine={false} tick={{fontSize:11,fill:"#7b8190"}}/>
      <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{fontSize:11,fill:"#7b8190"}} width={30}/>
      <Tooltip cursor={{fill:"#f5f7fc"}} contentStyle={{borderRadius:8,border:"1px solid #e6e9ef",fontSize:12}} labelFormatter={(label) => psychometricGroupNames[String(label)] ?? String(label)}/>
      <Bar dataKey="count" radius={[4,4,0,0]} maxBarSize={38} isAnimationActive={false}>
        {rows.map(r => <Cell key={r.key} fill={r.color}/>)}
      </Bar>
    </BarChart>
  </ResponsiveContainer>;
}

function MunicipalityWidget({ people }: { people: Participant[] }) {
  const map = new Map<string, number>();
  people.forEach(p => map.set(p.municipality, (map.get(p.municipality) ?? 0) + 1));
  const rows = Array.from(map.entries()).sort((a,b) => b[1] - a[1]).slice(0, 8);
  if (!rows.length) return <EmptyChart/>;
  const max = rows[0][1];
  return <ul className="municipality-list">
    {rows.map(([name, count]) => <li key={name}>
      <span className="municipality-name">{name}</span>
      <div className="municipality-track"><div style={{width:`${count/max*100}%`}}/></div>
      <span className="municipality-count">{count}</span>
    </li>)}
  </ul>;
}

function AttentionWidget({ people, state }: { people: Participant[]; state: DemoState }) {
  const rows = people.map(p => {
    const journey = getJourney(state, p);
    const next = journey?.steps.find(s => s.status !== "completado");
    return { p, journey, next };
  }).filter(r => r.next).slice(0, 5);
  if (!rows.length) return <div className="empty-inline">No hay actividades pendientes.</div>;
  return <ul className="attention-widget-list">
    {rows.map(({ p, next }) => <li key={p.id}>
      <Link className="attention-row" href={`/equipo/rutas?persona=${p.id}`}>
        <span className="avatar">{initials(p.name)}</span>
        <div><strong>{p.name}</strong><small>{next!.title}</small></div>
        <StatusBadge status={p.enrollment.status}/>
        <ArrowUpRight size={16}/>
      </Link>
    </li>)}
  </ul>;
}

function normalize(text: string) { return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }

function QuickSearch({ people, state }: { people: Participant[]; state: DemoState }) {
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const q = normalize(query.trim());
  const terms = q.split(/\s+/).filter(t => t.length > 1);
  const matches = terms.length === 0 ? [] : people.filter(p => {
    const profile = participantProfile(p);
    const occ = getJourney(state, p)?.answers.occupation ?? "";
    const occLabel = occupationLabel(occ);
    const haystack = normalize([
      p.name, p.email, p.municipality, occLabel,
      profile?.skills ?? "", profile?.education ?? "", profile?.interest ?? "", profile?.experience ?? "",
    ].join(" "));
    return terms.every(t => haystack.includes(t));
  });
  return <div className="quick-search">
    <div className="quick-search-input">
      <MagnifyingGlass size={18} weight="regular"/>
      <input type="search" placeholder="Ejemplo: baristas en zona 1 con Excel — busca por ocupación, habilidad, municipio o nombre" value={query} onChange={e => { setQuery(e.target.value); setShowAll(false); }}/>
      {query && <button type="button" className="text-button" onClick={() => setQuery("")}>Limpiar</button>}
    </div>
    {terms.length > 0 && <div className="quick-search-result">
      <div className="quick-search-count"><strong>{matches.length}</strong> {matches.length === 1 ? "persona coincide" : "personas coinciden"} con «{query}»</div>
      {matches.length > 0 && <ul className="quick-search-list">
        {(showAll ? matches : matches.slice(0, 5)).map(p => {
          const journey = getJourney(state, p);
          return <li key={p.id}>
            <Link href={`/equipo/participantes?persona=${p.id}`} className="quick-search-row">
              <span className="avatar">{initials(p.name)}</span>
              <div><strong>{p.name}</strong><small>{occupationLabel(journey?.answers.occupation ?? "") || "Sin ocupación"} · {p.municipality}</small></div>
              <StatusBadge status={p.enrollment.status}/>
              <ArrowUpRight size={14}/>
            </Link>
          </li>;
        })}
      </ul>}
      {matches.length > 5 && !showAll && <button type="button" className="text-button" onClick={() => setShowAll(true)}>Ver los {matches.length - 5} restantes</button>}
      {matches.length === 0 && <p className="quick-search-empty">Ninguna coincidencia. Prueba con menos palabras o revisa la ortografía.</p>}
    </div>}
  </div>;
}

export default function DashboardScreen(){
  const demo = useDemo();
  const { state, loading, error } = demo;
  const [layout, setLayout] = useLayout();
  const [addOpen, setAddOpen] = useState(false);
  const people = state?.participants ?? [];
  const visibleWidgets = useMemo(() => layout.order.filter(id => !layout.hidden.includes(id)), [layout]);
  const hiddenWidgets = useMemo(() => (Object.keys(WIDGET_META) as WidgetId[]).filter(id => layout.hidden.includes(id) || !layout.order.includes(id)), [layout]);

  function moveUp(id: WidgetId) {
    const order = layout.order.filter(x => !layout.hidden.includes(x));
    const idx = order.indexOf(id);
    if (idx <= 0) return;
    [order[idx-1], order[idx]] = [order[idx], order[idx-1]];
    const hiddenPart = layout.order.filter(x => layout.hidden.includes(x));
    setLayout({ ...layout, order: [...order, ...hiddenPart] });
  }
  function moveDown(id: WidgetId) {
    const order = layout.order.filter(x => !layout.hidden.includes(x));
    const idx = order.indexOf(id);
    if (idx < 0 || idx >= order.length - 1) return;
    [order[idx+1], order[idx]] = [order[idx], order[idx+1]];
    const hiddenPart = layout.order.filter(x => layout.hidden.includes(x));
    setLayout({ ...layout, order: [...order, ...hiddenPart] });
  }
  function hide(id: WidgetId) { setLayout({ ...layout, hidden: [...layout.hidden.filter(x => x !== id), id] }); }
  function add(id: WidgetId) {
    const order = layout.order.includes(id) ? layout.order : [...layout.order, id];
    setLayout({ order, hidden: layout.hidden.filter(x => x !== id) });
    setAddOpen(false);
  }
  function applyPreset(key: string) { setLayout(PRESETS[key].layout); }
  function reset() { setLayout(DEFAULT_LAYOUT); }

  function renderWidget(id: WidgetId): ReactNode {
    if (!state) return null;
    switch (id) {
      case "totals":       return <TotalsWidget people={people} state={state}/>;
      case "funnel":       return <FunnelWidget people={people} state={state}/>;
      case "occupations":  return <OccupationsWidget people={people} state={state}/>;
      case "urgency":      return <UrgencyWidget people={people} state={state}/>;
      case "psychometric": return <PsychometricWidget people={people} state={state}/>;
      case "municipality": return <MunicipalityWidget people={people}/>;
      case "attention":    return <AttentionWidget people={people} state={state}/>;
    }
  }

  return <Shell viewRole="team">
    <Tour storageKey="tour.admin.v1" steps={ADMIN_TOUR} startEvent="tour:start:admin"/>
    <button type="button" className="tour-help-btn" onClick={() => window.dispatchEvent(new Event("tour:start:admin"))} title="Ver ayuda / repetir tour" aria-label="Ver ayuda"><Question size={20} weight="bold"/></button>
    <PageHeading eyebrow="INICIO DEL EQUIPO" title="Tu tablero, a tu manera." description="Personaliza los widgets. Cámbialos de orden, ocúltalos o cambia de vista con un click."/>
    {error && <ErrorNotice message={error} retry={demo.retry}/>}
    {loading ? <Loading/> : state && <>
      <div className="admin-toolbar">
        <div className="admin-toolbar-group">
          <SquaresFour size={16}/>
          <span className="admin-toolbar-label">Vistas rápidas</span>
          {Object.entries(PRESETS).map(([key, p]) => <button key={key} type="button" className="preset-chip" onClick={() => applyPreset(key)}>{p.label}</button>)}
          <button type="button" className="preset-chip subtle" onClick={reset} title="Restablecer al orden inicial"><ArrowsClockwise size={13}/>Reiniciar</button>
        </div>
        <div className="admin-toolbar-group">
          <div className="admin-add-wrap">
            <button type="button" className="button secondary" onClick={() => setAddOpen(v => !v)} disabled={hiddenWidgets.length === 0}><Plus size={15}/>Añadir widget</button>
            {addOpen && hiddenWidgets.length > 0 && <div className="admin-add-menu">
              <div className="admin-add-title">Widgets disponibles</div>
              {hiddenWidgets.map(id => <button key={id} type="button" onClick={() => add(id)}>
                <strong>{WIDGET_META[id].title}</strong>
                <small>{WIDGET_META[id].subtitle}</small>
              </button>)}
            </div>}
          </div>
        </div>
      </div>

      <QuickSearch people={people} state={state}/>

      <div className="admin-grid">
        {visibleWidgets.map((id, idx) => <WidgetShell
          key={id}
          id={id}
          title={WIDGET_META[id].title}
          subtitle={WIDGET_META[id].subtitle}
          size={WIDGET_META[id].size}
          canMoveUp={idx > 0}
          canMoveDown={idx < visibleWidgets.length - 1}
          onMoveUp={() => moveUp(id)}
          onMoveDown={() => moveDown(id)}
          onHide={() => hide(id)}
        >
          {renderWidget(id)}
        </WidgetShell>)}
      </div>

      {visibleWidgets.length === 0 && <div className="empty-state admin-empty">
        <h3>Sin widgets visibles</h3>
        <p>Añade widgets desde el botón superior o selecciona una vista rápida.</p>
      </div>}

      <p className="data-caption">Tu configuración se guarda en este navegador. Datos ficticios de demostración.</p>
    </>}
  </Shell>;
}
