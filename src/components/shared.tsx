"use client";
import Link from "./safe-link";
import { usePathname } from "next/navigation";
import { ChartBar, Users, Buildings, Coins, Path, ArrowUpRight, House, CaretRight, Compass, Tray } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { config, programLabel, stateLabel, trainingLabel, profileFields } from "../domain/config.ts";
import type { Participant } from "../domain/types.ts";
import { participantProfile } from "../domain/guidance.ts";

export function Shell({ viewRole: role, children }: { viewRole: "participant" | "team"; children: ReactNode }) {
  const path = usePathname();
  const pages = role === "team" ? [
    { href:"/equipo",label:"Vista general",icon:ChartBar },{ href:"/equipo/participantes",label:"Participantes",icon:Users },
    { href:"/equipo/piloto",label:"Piloto compartido",icon:Tray },{ href:"/equipo/empresas",label:"Empresas y oportunidades",icon:Buildings },{ href:"/equipo/salarios",label:"Observatorio salarial",icon:Coins },{ href:"/equipo/rutas",label:"Rutas de acompañamiento",icon:Path },
  ] : [{ href:"/participante",label:"Mi camino",icon:Compass }];
  return <div className="app-shell">
    <a className="skip-link" href="#main">Ir al contenido</a>
    <aside className="sidebar">
      <Link className="brand" href="/"><span className="brand-mark">t</span><span>TALENTIA<small>Conectar talento y oportunidades</small></span></Link>
      <div className="workspace-name"><span className="workspace-initials">UI</span><span>Unidad de Inserción<small>Espacio de demostración</small></span><CaretRight size={14}/></div>
      <div className="sidebar-section">{role === "team" ? "GESTIÓN DEL TALENTO" : "MI CAMINO"}</div>
      <nav aria-label="Navegación principal">
        {pages.map(page=><Link key={page.href} href={page.href} className={`nav-item ${path === page.href ? "selected" : ""}`} aria-current={path === page.href ? "page" : undefined}><page.icon size={19} weight={path === page.href ? "fill" : "regular"}/><span>{page.label}</span></Link>)}
      </nav>
      <div className="sidebar-note"><span className="eyebrow">UNA HISTORIA, UN CAMINO</span><p>Los datos dan contexto.<br/>El equipo acompaña cada decisión.</p><Link href={role === "team" ? "/participante" : "/equipo"}>{role === "team" ? "Abrir vista participante" : "Conocer el panel del equipo"}<ArrowUpRight size={16}/></Link></div>
      <Link className="nav-item home-link" href="/"><House size={18}/>Inicio de la demo</Link>
      <div className="sidebar-person"><span className="avatar">{role === "team" ? "ED" : "MP"}</span><span>{role === "team" ? "Equipo demo" : "Mi participación"}<small>Sesión local</small></span><span className="online-dot"/></div>
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
