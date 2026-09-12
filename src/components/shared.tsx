"use client";
import Link from "./safe-link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChartBar, Users, Buildings, Coins, Path, CaretRight, CaretLeft, Compass, Tray, SignOut } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { config, programLabel, stateLabel, trainingLabel, profileFields } from "../domain/config.ts";
import type { Participant } from "../domain/types.ts";
import { participantProfile } from "../domain/guidance.ts";

const SIDEBAR_KEY = "talentia.sidebar.expanded";

export function Shell({ viewRole: role, children }: { viewRole: "participant" | "team"; children: ReactNode }) {
  const path = usePathname();
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    try { if (localStorage.getItem(SIDEBAR_KEY) === "1") setExpanded(true); } catch { /* ignore */ }
  }, []);
  function toggle() {
    setExpanded(v => {
      const next = !v;
      try { localStorage.setItem(SIDEBAR_KEY, next ? "1" : "0"); } catch { /* ignore */ }
      return next;
    });
  }
  const pages = role === "team" ? [
    { href:"/equipo",label:"Vista general",icon:ChartBar },{ href:"/equipo/participantes",label:"Participantes",icon:Users },
    { href:"/equipo/piloto",label:"Piloto compartido",icon:Tray },{ href:"/equipo/empresas",label:"Empresas y oportunidades",icon:Buildings },{ href:"/equipo/salarios",label:"Observatorio salarial",icon:Coins },{ href:"/equipo/rutas",label:"Rutas de acompañamiento",icon:Path },
  ] : [{ href:"/participante",label:"Mi camino",icon:Compass }];
  return <div className={`app-shell ${expanded ? "sidebar-expanded" : ""}`}>
    <a className="skip-link" href="#main">Ir al contenido</a>
    <aside className={`sidebar sidebar-minimal ${expanded ? "expanded" : ""}`}>
      <button type="button" className="sidebar-toggle" onClick={toggle} aria-label={expanded ? "Colapsar barra lateral" : "Expandir barra lateral"} title={expanded ? "Colapsar" : "Expandir menú"}>
        {expanded ? <CaretLeft size={13} weight="bold"/> : <CaretRight size={13} weight="bold"/>}
      </button>
      <Link className="brand" href="/" title="Volver al inicio">
        <span className="brand-mark">t</span>
        {expanded && <span className="brand-text">TALENTIA</span>}
      </Link>
      <nav aria-label="Navegación principal">
        {pages.map(page => <Link key={page.href} href={page.href} className={`nav-item ${path === page.href ? "selected" : ""}`} aria-current={path === page.href ? "page" : undefined} title={expanded ? undefined : page.label}>
          <page.icon size={20} weight={path === page.href ? "fill" : "regular"}/>
          {expanded && <span className="nav-label">{page.label}</span>}
        </Link>)}
      </nav>
      <Link className="sidebar-exit nav-item" href="/" title={expanded ? undefined : "Salir a la pantalla de inicio"}>
        <SignOut size={19} weight="regular"/>
        {expanded && <span className="nav-label">Salir</span>}
      </Link>
    </aside>
    <div className="app-body">
      <header className="app-topbar"><span>Espacio de trabajo <CaretRight size={12}/><strong>{pages.find(page=>page.href===path)?.label ?? "Participantes"}</strong></span><span className="demo-label"><span className="status-dot" /> Demo · Datos ficticios</span></header>
      <main id="main" className="app-main">{children}</main>
      <footer className="app-footer">{path === "/equipo/piloto" ? "Registros ficticios compartidos para la sesión · Sin selección ni postulación automática" : "Guardado en este navegador · Usa solo información ficticia · Sin inicio de sesión real"}</footer>
    </div>
  </div>;
}
export function ErrorNotice({ message, retry }: { message: string; retry?: () => void }) {
  return <div role="alert" className="notice error-notice"><strong>No pudimos completar la acción.</strong><p>{message}</p>{retry && <button className="button secondary" onClick={retry}>Volver a intentar</button>}</div>;
}
export function Loading() { return <div className="loading-box" role="status"><span className="loading-dot" />Preparando tu espacio…</div>; }
export function StatusBadge({ status }: { status: string }) {
  return <span className={`badge ${config.states.find(item => item.id === status)?.tone ?? "neutral"}`}><span className="badge-dot" />{stateLabel(status)}</span>;
}
export const formatDate = (value: string) => new Intl.DateTimeFormat("es-GT", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
export const initials = (name: string) => name.split(/\s+/).slice(0, 2).map(part => part[0]).join("");
export function ProfileDetails({ person }: { person: Participant }) {
  const profile = participantProfile(person);
  return <>
    <section className="detail-section"><h3>Datos básicos</h3><dl className="detail-grid">
      <div><dt>Correo de prueba</dt><dd>{person.email}</dd></div><div><dt>Teléfono</dt><dd>{person.phone || "Sin indicar"}</dd></div>
      <div><dt>Municipio</dt><dd>{person.municipality}</dd></div><div><dt>Programa</dt><dd>{programLabel(person.enrollment.programId)}</dd></div>
      <div><dt>Consentimiento del demo</dt><dd>{person.consentAt ? `Aceptado · ${formatDate(person.consentAt)}` : "Registro de ejemplo · No aplica"}</dd></div>
      <div><dt>Identificador</dt><dd className="record-id">{person.id}</dd></div>
    </dl></section>
    <section className="detail-section"><h3>Perfil laboral</h3>{profile ? <><p className="muted small">{person.profileSavedAt ? `Guardado ${formatDate(person.profileSavedAt)}.` : "Escenario ficticio para explorar la demo. No representa información verificada."}</p><dl className="detail-grid">{profileFields.map(field => <div key={field.key} className={field.type === "textarea" ? "wide" : ""}><dt>{field.label}</dt><dd>{field.key === "trainingType" ? trainingLabel(profile[field.key]) : profile[field.key] || "Sin indicar"}</dd></div>)}</dl></> : <div className="empty-inline"><strong>Aún no hay un perfil guardado.</strong><p>La persona puede agregar su experiencia, habilidades e intereses desde su vista.</p></div>}</section>
  </>;
}
