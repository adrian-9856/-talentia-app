"use client";
import { useState, type FormEvent } from "react";
import Link from "./safe-link";
import { config, profileFields } from "../domain/config.ts";
import { blankProfile, ValidationError } from "../domain/repository.ts";
import type { DemoState, FieldErrors, Profile, Registration } from "../domain/types.ts";
import { ErrorNotice, Loading, ProfileDetails, Shell, StatusBadge } from "./shared";
import { messageFrom, useDemo } from "./use-demo";
import { getJourney, participantProfile } from "../domain/guidance.ts";
import { JourneyView, QuestionnaireForm } from "./journey-components";
import { PilotShare } from "./pilot-share";
import { ArrowRight, Coffee, FolderOpen, DeviceMobile } from "@phosphor-icons/react";

type DemoHook = ReturnType<typeof useDemo>;
function RegistrationForm({ demo, state }: { demo: DemoHook; state: DemoState }) {
  const [failedDraft, setFailedDraft] = useState<Partial<Registration> | null>(null);
  const unsaved = demo.hasPendingDraft ? failedDraft : null;
  const draft = { ...state.registrationDraft, ...unsaved };
  const [errors, setErrors] = useState<FieldErrors>({});
  function change<K extends keyof Registration>(key: K, value: Registration[K]) {
    const next = { ...unsaved, [key]: value }; setErrors(current => ({ ...current, [key]: undefined }));
    try { demo.run(repo => repo.saveRegistrationDraft(next), true); setFailedDraft(null); }
    catch (cause) { setFailedDraft(next); demo.setError(messageFrom(cause)); }
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    try { demo.run(repo => repo.register(draft)); }
    catch (cause) {
      if (cause instanceof ValidationError) { setErrors(cause.fields); requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()); }
      else demo.setError(messageFrom(cause));
    }
  }
  const error = (key: keyof Registration) => errors[key] && <span className="field-error" id={`${key}-error`}>{errors[key]}</span>;
  const described = (key: keyof Registration) => errors[key] ? `${key}-error` : undefined;
  return <form onSubmit={submit} noValidate className="form-card">
    <div className="form-card-header"><span className="eyebrow">PASO 1 · DATOS BÁSICOS</span><h2>Empecemos por conocerte</h2><p>Usa datos inventados para probar el registro. Los campos con * son obligatorios.</p></div>
    <div className="field-grid">
      <label className="field wide" htmlFor="name">Nombre ficticio *<input id="name" autoComplete="off" value={draft.name} maxLength={100} placeholder="Ejemplo: Sofía Prueba" onChange={e => change("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby={described("name")} required />{error("name")}</label>
      <label className="field" htmlFor="email">Correo ficticio *<input id="email" type="email" autoComplete="off" value={draft.email} maxLength={254} placeholder="sofia@example.com" onChange={e => change("email", e.target.value)} aria-invalid={!!errors.email} aria-describedby={described("email")} required />{error("email")}<span className="field-hint">Usa una dirección terminada en @example.com.</span></label>
      <label className="field" htmlFor="phone">Teléfono ficticio <span className="optional">Opcional</span><input id="phone" type="tel" autoComplete="off" value={draft.phone} maxLength={40} placeholder="Puedes dejarlo vacío" onChange={e => change("phone", e.target.value)} aria-invalid={!!errors.phone} aria-describedby={described("phone")} />{error("phone")}</label>
      <label className="field" htmlFor="municipality">Municipio *<select id="municipality" value={draft.municipality} onChange={e => change("municipality", e.target.value)} aria-invalid={!!errors.municipality} aria-describedby={described("municipality")} required><option value="">Selecciona un municipio</option>{config.municipalities.map(item => <option key={item}>{item}</option>)}</select>{error("municipality")}</label>
      <label className="field" htmlFor="programId">Programa *<select id="programId" value={draft.programId} onChange={e => change("programId", e.target.value)} aria-invalid={!!errors.programId} aria-describedby={described("programId")} required><option value="">Selecciona un programa</option>{config.programs.filter(program => program.active).map(program => <option value={program.id} key={program.id}>{program.name}</option>)}</select>{error("programId")}</label>
    </div>
    <div className="consent-box"><label htmlFor="consent"><input id="consent" type="checkbox" checked={draft.consent} onChange={e => change("consent", e.target.checked)} aria-invalid={!!errors.consent} aria-describedby={described("consent")} required /><span>Acepto guardar estos datos ficticios para probar el registro y el acompañamiento. *</span></label><p>Primero se guardan en este navegador. Solo se comparten con el panel común cuando pulses “Enviar al panel”. No uses información real.</p>{error("consent")}</div>
    <div className="form-actions"><span className="muted small">Puedes regresar sin perder lo escrito.</span><button className="button primary" type="submit">Guardar y continuar <span aria-hidden="true">→</span></button></div>
  </form>;
}

function ProfileForm({ demo, state, done }: { demo: DemoHook; state: DemoState; done: () => void }) {
  const person = state.participants.find(item => item.id === state.activeParticipantId)!;
  const [failedDraft, setFailedDraft] = useState<Partial<Profile> | null>(null);
  const unsaved = demo.hasPendingDraft ? failedDraft : null;
  const draft = { ...(state.profileDrafts[person.id] ?? participantProfile(person) ?? blankProfile()), ...unsaved };
  function change(key: keyof Profile, value: string) {
    const next = { ...unsaved, [key]: value };
    try { demo.run(repo => repo.saveProfileDraft(person.id, next), true); setFailedDraft(null); }
    catch (cause) { setFailedDraft(next); demo.setError(messageFrom(cause)); }
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    try { demo.run(repo => repo.saveProfile(person.id, draft)); done(); }
    catch (cause) { demo.setError(messageFrom(cause)); }
  }
  return <form onSubmit={submit} className="form-card">
    <div className="form-card-header"><span className="eyebrow">PASO 2 · PERFIL LABORAL</span><h2>Tu experiencia cuenta</h2><p>Hola, {person.name}. Comparte lo que quieras agregar a tu perfil ficticio. Todos estos campos son opcionales.</p></div>
    <div className="field-grid">{profileFields.map(field => <label className={`field ${field.type === "textarea" ? "wide" : ""}`} htmlFor={field.key} key={field.key}>{field.label}
      {field.type === "textarea" ? <textarea id={field.key} rows={3} maxLength={3000} value={draft[field.key]} onChange={e => change(field.key, e.target.value)} /> : <select id={field.key} value={draft[field.key]} onChange={e => change(field.key, e.target.value)}><option value="">Sin indicar</option>{field.type === "training" ? config.training.map(item => <option key={item.id} value={item.id}>{item.label}</option>) : field.options.map(item => <option key={item}>{item}</option>)}</select>}
      {"hint" in field && <span className="field-hint">{field.hint}</span>}
    </label>)}</div>
    <div className="form-actions"><span className="muted small">Puedes guardar ahora y completar después.</span><button className="button primary" type="submit">Guardar mi perfil <span aria-hidden="true">→</span></button></div>
  </form>;
}

export default function ParticipantScreen() {
  const demo = useDemo(); const { state, loading, error } = demo;
  const [view, setView] = useState<"profile" | "questionnaire" | "summary" | null>(null);
  const person = state?.participants.find(item => item.id === state.activeParticipantId);
  const step = person ? (view ?? (state?.profileDrafts[person.id] ? "profile" : state?.questionnaireDrafts?.[person.id] ? "questionnaire" : getJourney(state!,person) ? "summary" : person.profile ? "questionnaire" : "profile")) : "registration";
  function newRegistration() {
    try { demo.run(repo => repo.startNewRegistration()); setView(null); }
    catch (cause) { demo.setError(messageFrom(cause)); }
  }
  function selectPerson(id:string){try{demo.run(repo=>repo.selectParticipant(id));setView(null);}catch(cause){demo.setError(messageFrom(cause));}}
  return <Shell viewRole="participant">
    <div className="page-heading"><div><span className="eyebrow">MI CAMINO EN TALENTIA</span><h1>{person?`Hola, ${person.name.split(" ")[0]}. Construyamos tu próximo paso.`:"Tu experiencia tiene un lugar."}</h1><p>Lo que sabes hacer, lo que quieres aprender y un camino para acercarte a tu objetivo.</p></div>{person&&<StatusBadge status={person.enrollment.status}/>}</div>
    {error && <ErrorNotice message={error} retry={demo.retry} />}
    {loading ? <Loading /> : state && <>
      {!person&&<section className="demo-case-picker"><div><span className="eyebrow">RECORRE UNA HISTORIA DE EJEMPLO</span><p>Puedes explorar un caso preparado o crear tu propio registro ficticio más abajo.</p></div><div>{[{id:"p010",label:"Julia · Primer empleo",icon:Coffee},{id:"p008",label:"Helena · Experiencia informal",icon:FolderOpen},{id:"p012",label:"Laura · Apoyo digital",icon:DeviceMobile}].filter(item=>state.participants.some(person=>person.id===item.id)).map(item=><button className="button secondary" key={item.id} disabled={demo.hasPendingDraft} onClick={()=>selectPerson(item.id)}><item.icon size={18}/>{item.label}<ArrowRight size={15}/></button>)}</div></section>}
      <section className="participant-transform"><div><span className="eyebrow">TU INFORMACIÓN SE CONVIERTE EN ACCIÓN</span><strong>No llenas un formulario para quedar en una lista.</strong></div><ol><li><b>1</b><span>Nos cuentas tu historia</span></li><li><b>2</b><span>Identificamos apoyos</span></li><li><b>3</b><span>Diseñamos tu ruta</span></li><li><b>4</b><span>Acordamos qué sigue</span></li></ol></section>
      <div className="participant-layout"><aside className="step-panel"><span className="eyebrow">TU MAPA DE AVANCE</span><h2>{person ? `${person.name.split(" ")[0]}, estás construyendo tu ruta` : "Comienza aquí"}</h2><ol className="step-list">
        <li className={step==="registration"?"current":person?"done":""}><span className="step-number">1</span><div>Datos básicos<small>El inicio de tu expediente</small></div></li>
        <li className={step==="profile"?"current":person?.profile?"done":""}><span className="step-number">2</span><div>{person?<button disabled={demo.hasPendingDraft} onClick={()=>setView("profile")}>Perfil laboral</button>:"Perfil laboral"}<small>Tu experiencia cuenta</small></div></li>
        <li className={step==="questionnaire"?"current":""}><span className="step-number">3</span><div>{person?<button disabled={demo.hasPendingDraft} onClick={()=>setView("questionnaire")}>Cuestionario</button>:"Cuestionario"}<small>Tus intereses y necesidades</small></div></li>
        <li className={step==="summary"?"current":""}><span className="step-number">4</span><div>{person?<button disabled={demo.hasPendingDraft} onClick={()=>setView("summary")}>Mi ruta</button>:"Mi ruta"}<small>Un próximo paso concreto</small></div></li>
      </ol><div className="step-note">A tu ritmo.<p>No necesitas tener todas las respuestas para comenzar.</p></div>{person&&<><label className="field small">Cambiar expediente del demo<select value={person.id} disabled={demo.hasPendingDraft} onChange={event=>selectPerson(event.target.value)}>{state.participants.map(item=><option value={item.id} key={item.id}>{item.name}</option>)}</select></label><button className="text-button" disabled={demo.hasPendingDraft} onClick={newRegistration}>Crear otro registro ficticio</button></>}</aside><div className="participant-workspace">
      {step==="registration"?<RegistrationForm demo={demo} state={state}/>:step==="profile"?<ProfileForm key={person!.id} demo={demo} state={state} done={()=>setView("questionnaire")}/>:step==="questionnaire"?<QuestionnaireForm key={person!.id} demo={demo} state={state} person={person!} done={()=>setView("summary")}/>:person&&<><section className="panel"><JourneyView key={person.id} demo={demo} state={state} person={person} onEdit={()=>setView("questionnaire")}/></section><PilotShare state={state} person={person}/><details className="panel profile-disclosure"><summary>Consultar mi expediente y perfil laboral</summary><ProfileDetails person={person}/></details><div className="form-actions"><button className="button secondary" onClick={()=>setView("profile")}>Editar mi perfil</button><Link className="inline-link" href={`/equipo/participantes?persona=${person.id}`}>Así acompaña el equipo mi expediente<ArrowRight size={16}/></Link></div></>}
      {demo.hasPendingDraft&&<p className="small muted">Guarda los cambios pendientes antes de cambiar de paso.</p>}
      </div></div>
    </>}
  </Shell>;
}
