"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "./safe-link";
import { config, profileFields } from "../domain/config.ts";
import { blankDiagnosis, blankProfile, ValidationError } from "../domain/repository.ts";
import type { Diagnosis, DemoState, FieldErrors, Profile, Registration } from "../domain/types.ts";
import { ErrorNotice, Loading, ProfileDetails, Shell, StatusBadge } from "./shared";
import { messageFrom, useDemo } from "./use-demo";
import { getJourney, participantProfile, phases, phaseOfStep, type PhaseStepId } from "../domain/guidance.ts";
import { CvBuilder, JourneyView, PsychometricForm, QuestionnaireForm, SoftSkillsLesson } from "./journey-components";
import { CheckCircle, LockSimple, UserCircle, Compass, Path as PathIcon, ReadCvLogo, Question } from "@phosphor-icons/react";
import { Tour, type TourStep } from "./tour";

const PARTICIPANT_TOUR: TourStep[] = [
  { target: "", title: "¡Bienvenida a TALENTIA!", body: "En 4 fases vas a construir tu perfil, descubrir tus fortalezas, diseñar tu ruta laboral y armar tu CV. Te guiamos paso a paso." },
  { target: ".phase-progress-bar", title: "Tu progreso", body: "Estas son las 4 fases de tu recorrido. La actual se marca en azul, las completadas en verde y las bloqueadas con candado. Se van desbloqueando conforme avanzas." },
  { target: ".phase-panel", title: "Tu mapa de fases", body: "Aquí tienes el detalle de cada fase con sus pasos. Puedes hacer click en cualquier paso desbloqueado para volver a él y editar tu información." },
  { target: ".phase-intro", title: "Qué entra, qué pasa, qué sale", body: "Antes de cada fase te decimos qué información se pide, qué hace el sistema con ella y qué obtienes al final. Nunca vas a estar sin saber para qué sirve algo." },
  { target: ".form-card, .diagnosis-chips-list, .psych-single, .softskills-lesson, .profile-sections, .questionnaire-form, .cv-builder, .ats-cv", title: "Tu formulario", body: "Aquí llenas tus datos. Tómate el tiempo que necesites. Todo lo que escribas se guarda automáticamente." },
  { target: ".save-badge, .app-topbar", title: "Guardado automático", body: "No te preocupes por perder información: cada cambio se guarda al instante. Verás una notificación verde cuando pase." },
];

const phaseIcons: Record<string, React.ComponentType<{size?:number;weight?:"regular"|"bold"|"fill"|"duotone"}>> = {
  conocerte: UserCircle,
  fortalezas: Compass,
  camino: PathIcon,
  cv: ReadCvLogo,
};
import { PilotShare } from "./pilot-share";
import { ArrowRight, GraduationCap, Briefcase, Lightbulb } from "@phosphor-icons/react";

type DemoHook = ReturnType<typeof useDemo>;

const diagnosisFields = [
  { key:"situacion" as const, label:"¿Cuál es tu situación laboral actual? *", options:["Empleada actualmente","Sin empleo, buscando trabajo","Sin empleo, sin buscar aún","Buscando mi primer empleo","Prefiero no responder"] },
  { key:"tiempoSinEmpleo" as const, label:"¿Cuánto tiempo llevas sin trabajo formal?", options:["Menos de 3 meses","De 3 a 6 meses","De 6 meses a un año","Más de un año","No aplica","Prefiero no responder"] },
  { key:"motivacion" as const, label:"¿Cuál es tu principal motivación para buscar trabajo? *", options:["Mejorar mi ingreso","Independencia económica","Conseguir mi primer empleo","Cambiar de trabajo o sector","Prefiero no responder"] },
  { key:"nivelUrgencia" as const, label:"¿Qué tan urgente es para ti encontrar trabajo? *", options:["Alta – lo necesito pronto","Media – en los próximos meses","Baja – estoy explorando opciones","Prefiero no responder"] },
  { key:"redApoyo" as const, label:"¿Tienes personas que te apoyen en tu búsqueda?", options:["Familia directa","Amistades o vecinos","Organización de apoyo","Sin red de apoyo","Prefiero no responder"] },
  { key:"expectativaApoyo" as const, label:"¿Qué tipo de apoyo esperas recibir del programa? *", options:["Orientación y acompañamiento","Formación o capacitación","Conexión con empresas","Apoyo emocional o motivacional","Prefiero no responder"] },
] as const;

function DiagnosisForm({ demo, state, done }: { demo: DemoHook; state: DemoState; done: () => void }) {
  const person = state.participants.find(item => item.id === state.activeParticipantId)!;
  const [failedDraft, setFailedDraft] = useState<Partial<Diagnosis> | null>(null);
  const unsaved = demo.hasPendingDraft ? failedDraft : null;
  const draft = { ...(state.diagnosisDrafts?.[person.id] ?? state.diagnoses?.[person.id] ?? blankDiagnosis()), ...unsaved };
  const required = ["situacion","motivacion","nivelUrgencia","expectativaApoyo"] as const;
  const allRequired = required.every(k => !!draft[k]);
  function change(key: keyof Diagnosis, value: string) {
    const next = { ...unsaved, [key]: value };
    try { demo.run(repo => repo.saveDiagnosisDraft(person.id, next), true); setFailedDraft(null); }
    catch (cause) { setFailedDraft(next); demo.setError(messageFrom(cause)); }
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!allRequired) return;
    try { demo.run(repo => repo.saveDiagnosis(person.id, draft as Diagnosis)); done(); }
    catch (cause) { demo.setError(messageFrom(cause)); }
  }
  const urgencyClass: Record<string,string> = { "Alta – lo necesito pronto":"chip-urg-hi", "Media – en los próximos meses":"chip-urg-md", "Baja – estoy explorando opciones":"chip-urg-lo" };
  return <form onSubmit={submit} className="form-card">
    <div className="form-card-header"><span className="eyebrow">PASO 2 · DIAGNÓSTICO INICIAL</span><h2>Cuéntanos dónde estás hoy</h2><p>Hola, {person.name.split(" ")[0]}. Toca la respuesta que mejor te describa. Los campos con * son obligatorios.</p></div>
    <div className="diagnosis-chips-list">
      {diagnosisFields.map(field => <fieldset className="chip-group" key={field.key}>
        <legend>{field.label}</legend>
        <div className="chip-row">
          {field.options.map(opt => {
            const selected = draft[field.key] === opt;
            const urgCls = field.key==="nivelUrgencia" && selected ? urgencyClass[opt]??"" : "";
            return <button type="button" key={opt} className={`chip ${selected?"selected":""} ${urgCls}`} onClick={() => change(field.key, opt)}>{opt}</button>;
          })}
        </div>
      </fieldset>)}
    </div>
    {draft.nivelUrgencia && <div className="diagnosis-insight"><span className="eyebrow">NIVEL DE URGENCIA</span><p>{draft.nivelUrgencia==="Alta – lo necesito pronto"?"El equipo priorizará opciones disponibles de inmediato y apoyo para iniciar rápido.":draft.nivelUrgencia==="Media – en los próximos meses"?"Hay tiempo para preparar bien el CV y practicar antes de las primeras entrevistas.":"Podemos explorar opciones con calma y enfocarnos en formación antes de conectar con empresas."}</p></div>}
    <div className="form-actions"><span className="muted small">Puedes regresar y editar en cualquier momento.</span><button className="button primary" type="submit" disabled={!allRequired}>Guardar diagnóstico <span aria-hidden="true">→</span></button></div>
  </form>;
}

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
      <label className="field wide" htmlFor="name">Nombre completo *<input id="name" autoComplete="off" value={draft.name} maxLength={100} placeholder="Ejemplo: Sofía Pérez" onChange={e => change("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby={described("name")} required />{error("name")}</label>
      <label className="field" htmlFor="email">Correo electrónico *<input id="email" type="email" autoComplete="off" value={draft.email} maxLength={254} placeholder="sofia@example.com" onChange={e => change("email", e.target.value)} aria-invalid={!!errors.email} aria-describedby={described("email")} required />{error("email")}<span className="field-hint">Usa una dirección terminada en @example.com.</span></label>
      <label className="field" htmlFor="phone">Teléfono <span className="optional">Opcional</span><input id="phone" type="tel" autoComplete="off" value={draft.phone} maxLength={40} placeholder="Puedes dejarlo vacío" onChange={e => change("phone", e.target.value)} aria-invalid={!!errors.phone} aria-describedby={described("phone")} />{error("phone")}</label>
      <label className="field" htmlFor="municipality">Municipio *<select id="municipality" value={draft.municipality} onChange={e => change("municipality", e.target.value)} aria-invalid={!!errors.municipality} aria-describedby={described("municipality")} required><option value="">Selecciona un municipio</option>{config.municipalities.map(item => <option key={item}>{item}</option>)}</select>{error("municipality")}</label>
      <label className="field" htmlFor="zona">Zona / Colonia <span className="optional">Opcional</span><input id="zona" autoComplete="off" value={draft.zona ?? ""} maxLength={80} placeholder="Ej. Zona 7, Colonia El Carmen" onChange={e => change("zona", e.target.value)} /><span className="field-hint">Ayuda a identificar opciones laborales cercanas.</span></label>
    </div>
    <div className="consent-box"><label htmlFor="consent"><input id="consent" type="checkbox" checked={draft.consent} onChange={e => change("consent", e.target.checked)} aria-invalid={!!errors.consent} aria-describedby={described("consent")} required /><span>Acepto guardar estos datos ficticios para probar el registro y el acompañamiento. *</span></label><p>Primero se guardan en este navegador. Solo se comparten con el panel común cuando pulses "Enviar al panel". No uses información real.</p>{error("consent")}</div>
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
  const sections = [
    { id:"formacion", title:"Formación", subtitle:"Tu recorrido educativo", Icon:GraduationCap, color:"#4665e7", keys:["education","trainingType"] },
    { id:"experiencia", title:"Experiencia y habilidades", subtitle:"Lo que has hecho y lo que sabes hacer", Icon:Briefcase, color:"#e0a13a", keys:["experience","skills","hasCV"] },
    { id:"sobre-ti", title:"Sobre ti", subtitle:"Tus intereses y hacia dónde vas", Icon:Lightbulb, color:"#33c377", keys:["interest","availability","digitalBarrier","objective"] },
  ];
  const renderField = (field: typeof profileFields[number]) => <label className={`field ${field.type === "textarea" ? "wide" : ""}`} htmlFor={field.key} key={field.key}>{field.label}
    {field.type === "textarea" ? <textarea id={field.key} rows={3} maxLength={3000} value={draft[field.key]} onChange={e => change(field.key, e.target.value)} /> : <select id={field.key} value={draft[field.key]} onChange={e => change(field.key, e.target.value)}><option value="">Sin indicar</option>{field.type === "training" ? config.training.map(item => <option key={item.id} value={item.id}>{item.label}</option>) : field.options.map(item => <option key={item}>{item}</option>)}</select>}
    {"hint" in field && <span className="field-hint">{field.hint}</span>}
  </label>;
  return <form onSubmit={submit} className="form-card">
    <div className="form-card-header"><span className="eyebrow">PASO 3 · PERFIL LABORAL</span><h2>Tu experiencia cuenta</h2><p>Hola, {person.name}. Comparte lo que quieras agregar a tu perfil ficticio. Todos los campos son opcionales.</p></div>
    <div className="profile-sections">
      {sections.map(s => <section className="profile-section" key={s.id} style={{"--sec-color":s.color} as React.CSSProperties}>
        <div className="profile-section-head"><span className="profile-section-icon"><s.Icon size={24} weight="duotone"/></span><div><strong>{s.title}</strong><small>{s.subtitle}</small></div></div>
        <div className="field-grid">{s.keys.map(k => renderField(profileFields.find(f => f.key === k)!))}</div>
      </section>)}
    </div>
    <div className="form-actions"><span className="muted small">Puedes guardar ahora y completar después.</span><button className="button primary" type="submit">Guardar mi perfil <span aria-hidden="true">→</span></button></div>
  </form>;
}

type StepView = PhaseStepId;

function PhaseCelebration({ phase }: { phase: typeof phases[number] | null }) {
  if (!phase) return null;
  const pieces = Array.from({ length: 48 }, (_, i) => i);
  const colors = ["#4665e7","#33c377","#e0a13a","#d94141","#8250df","#4d9ec7"];
  return <div className="phase-celebration" role="dialog" aria-live="assertive">
    <div className="phase-celebration-confetti" aria-hidden="true">
      {pieces.map(i => {
        const left = (i * 97) % 100;
        const delay = ((i * 53) % 1200) / 1000;
        const duration = 1.5 + ((i * 37) % 1200) / 1000;
        const color = colors[i % colors.length];
        return <span key={i} style={{left:`${left}%`,animationDelay:`${delay}s`,animationDuration:`${duration}s`,background:color}}/>;
      })}
    </div>
    <div className="phase-celebration-card">
      <div className="phase-celebration-emoji">🎉</div>
      <span className="eyebrow">FASE {phase.number} COMPLETADA</span>
      <h2>¡{phase.title}!</h2>
      <p>Sigue así, cada fase te acerca a tu próximo trabajo.</p>
    </div>
  </div>;
}

function SaveBadge({ lastSaved }: { lastSaved: number | null }) {
  const [visible, setVisible] = useState(false);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (lastSaved === null) return;
    setVisible(true);
    setTick(t => t + 1);
    const hide = setTimeout(() => setVisible(false), 3200);
    return () => clearTimeout(hide);
  }, [lastSaved]);
  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [visible]);
  if (!lastSaved) return null;
  const elapsed = Math.max(0, Math.round((Date.now() - lastSaved) / 1000));
  const label = elapsed < 2 ? "Guardado" : `Guardado hace ${elapsed}s`;
  void tick;
  return <div className={`save-badge ${visible?"visible":""}`} role="status" aria-live="polite"><CheckCircle weight="fill" size={16}/>{label}</div>;
}

function completedSteps(state: DemoState, person: import("../domain/types.ts").Participant | undefined): Set<StepView> {
  const done = new Set<StepView>();
  if (person) {
    done.add("registration");
    if (state.diagnoses?.[person.id]) done.add("diagnosis");
    if (state.psychometrics?.[person.id]) { done.add("psychometric"); done.add("softskills"); }
    if (person.profile) done.add("profile");
    if (getJourney(state, person)) { done.add("questionnaire"); done.add("summary"); }
    if (state.cvData?.[person.id]) done.add("cv");
  }
  return done;
}

export default function ParticipantScreen() {
  const demo = useDemo(); const { state, loading, error } = demo;
  const [view, setView] = useState<Exclude<StepView,"registration"> | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [celebration, setCelebration] = useState<typeof phases[number] | null>(null);
  const prevPhasesDoneRef = useRef<string>("");
  const person = state?.participants.find(item => item.id === state.activeParticipantId);
  const phasesDoneOuter = state ? phases.map(p => p.steps.every(s => completedSteps(state, person).has(s.id))) : phases.map(() => false);
  useEffect(() => {
    const key = phasesDoneOuter.map(v => v?"1":"0").join("");
    const prev = prevPhasesDoneRef.current;
    if (prev && prev !== key) {
      for (let i = 0; i < phasesDoneOuter.length; i++) {
        if (phasesDoneOuter[i] && prev[i] === "0") {
          setCelebration(phases[i]);
          const hide = setTimeout(() => setCelebration(null), 3600);
          prevPhasesDoneRef.current = key;
          return () => clearTimeout(hide);
        }
      }
    }
    prevPhasesDoneRef.current = key;
  }, [phasesDoneOuter.join(",")]);

  const step: StepView = person ? (view ?? (() => {
    if (person.source === "sample" && getJourney(state!, person) && !state?.journeys?.[person.id]) return "summary";
    if (state?.diagnosisDrafts?.[person.id] || !state?.diagnoses?.[person.id]) return "diagnosis";
    if (state?.psychometricDrafts?.[person.id] || !state?.psychometrics?.[person.id]) return "psychometric";
    if (state?.profileDrafts[person.id] || !person.profile) return "profile";
    if (state?.questionnaireDrafts?.[person.id] || !getJourney(state!, person)) return "questionnaire";
    return "summary";
  })()) : "registration";

  function newRegistration() {
    try { demo.run(repo => repo.startNewRegistration()); setView(null); }
    catch (cause) { demo.setError(messageFrom(cause)); }
  }
  function selectPerson(id: string) { try { demo.run(repo => repo.selectParticipant(id)); setView(null); } catch (cause) { demo.setError(messageFrom(cause)); } }

  return <Shell viewRole="participant">
    <Tour storageKey="tour.participant.v1" steps={PARTICIPANT_TOUR} startEvent="tour:start:participant"/>
    <button type="button" className="tour-help-btn" onClick={() => window.dispatchEvent(new Event("tour:start:participant"))} title="Ver ayuda / repetir tour" aria-label="Ver ayuda"><Question size={20} weight="bold"/></button>
    <SaveBadge lastSaved={demo.lastSaved} />
    <PhaseCelebration phase={celebration} />
    <div className="page-heading"><div><span className="eyebrow">MI CAMINO EN TALENTIA</span><h1>{person ? `Hola, ${person.name.split(" ")[0]}. Construyamos tu próximo paso.` : "Tu experiencia tiene un lugar."}</h1><p>Lo que sabes hacer, lo que quieres aprender y un camino para acercarte a tu objetivo.</p></div>{person && <StatusBadge status={person.enrollment.status} />}</div>
    {error && <ErrorNotice message={error} retry={demo.retry} />}
    {loading ? <Loading /> : state && <>
      {(() => {
        const done = completedSteps(state!, person);
        const currentPhase = phaseOfStep(step);
        const phasesDone = phases.map(p => p.steps.every(s => done.has(s.id)));
        const currentPhaseIdx = phases.findIndex(p => p.id === currentPhase.id);
        const isPhaseUnlocked = (idx: number) => idx === 0 || phasesDone[idx-1];
        return <>
        <section className="phase-progress-bar" aria-label="Progreso por fases">
          {phases.map((p, idx) => {
            const state = phasesDone[idx]?"done":idx===currentPhaseIdx?"current":isPhaseUnlocked(idx)?"unlocked":"locked";
            const Icon = phaseIcons[p.id];
            const lineDoneLeft = idx > 0 && phasesDone[idx-1];
            return <div key={p.id} className={`phase-progress-step ${state}`}>
              {idx > 0 && <span className={`phase-progress-line ${lineDoneLeft?"filled":""}`} aria-hidden="true"/>}
              <div className="phase-progress-circle">
                {state==="done" ? <CheckCircle weight="fill" size={26}/>
                  : state==="locked" ? <LockSimple weight="fill" size={18}/>
                  : Icon ? <Icon size={26} weight={state==="current"?"fill":"regular"}/>
                  : p.number}
                <span className="phase-progress-badge">{p.number}</span>
              </div>
              <div className="phase-progress-text">
                <span className="phase-progress-tag">Fase {p.number}</span>
                <strong>{p.title}</strong>
              </div>
            </div>;
          })}
        </section>
        <div className={`participant-layout ${sidebarCollapsed?"phase-collapsed":""}`}>
          <aside className={`phase-panel ${sidebarCollapsed?"collapsed":""}`}>
            <button type="button" className="phase-panel-toggle" onClick={()=>setSidebarCollapsed(v=>!v)} title={sidebarCollapsed?"Mostrar mapa":"Ocultar mapa"} aria-label={sidebarCollapsed?"Mostrar mapa":"Ocultar mapa"}>{sidebarCollapsed?"▶":"◀"}</button>
            {!sidebarCollapsed && <><span className="eyebrow">MI RUTA POR FASES</span>
            <h2>{person?`${person.name.split(" ")[0]}, tu recorrido`:"Tu recorrido"}</h2></>}
            <ol className="phase-tree">
              {phases.map((p, idx) => {
                const unlocked = isPhaseUnlocked(idx);
                const active = idx === currentPhaseIdx;
                const cls = phasesDone[idx]?"done":active?"current":unlocked?"unlocked":"locked";
                const Icon = phaseIcons[p.id];
                return <li key={p.id} className={`phase-card ${cls}`} title={sidebarCollapsed?p.title:undefined}>
                  <div className="phase-card-head">
                    <span className="phase-card-num">{phasesDone[idx]?<CheckCircle weight="fill" size={22}/>:!unlocked?<LockSimple weight="fill" size={18}/>:sidebarCollapsed&&Icon?<Icon size={20} weight={active?"fill":"regular"}/>:p.number}</span>
                    {!sidebarCollapsed && <div><strong>{p.title}</strong><small>{p.subtitle}</small></div>}
                  </div>
                  {!sidebarCollapsed && <ul className="phase-substeps">
                    {p.steps.map(s => {
                      const isDone = done.has(s.id);
                      const isCurrent = s.id === step;
                      const canClick = person && unlocked;
                      return <li key={s.id} className={isCurrent?"current":isDone?"done":""}>
                        <span className="dot">{isDone?"✓":isCurrent?"●":"○"}</span>
                        {canClick && s.id!=="registration"
                          ? <button disabled={demo.hasPendingDraft} onClick={()=>setView(s.id as Exclude<StepView,"registration">)}>{s.label}</button>
                          : <span>{s.label}</span>}
                      </li>;
                    })}
                  </ul>}
                </li>;
              })}
            </ol>
            {person && !sidebarCollapsed && <><label className="field small">Cambiar expediente del demo<select value={person.id} disabled={demo.hasPendingDraft} onChange={event => selectPerson(event.target.value)}>{state.participants.map(item => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label><button className="text-button" disabled={demo.hasPendingDraft} onClick={newRegistration}>Crear otro registro ficticio</button></>}
          </aside>
          <div className="participant-workspace">
            <section className="phase-intro" data-phase={currentPhase.number}>
              <div className="phase-intro-heading"><span className="phase-intro-num">Fase {currentPhase.number}</span><h3>{currentPhase.title}</h3></div>
              <div className="phase-intro-grid">
                <div><span className="eyebrow">QUÉ ENTRA</span><p>{currentPhase.entra}</p></div>
                <div><span className="eyebrow">QUÉ PASA</span><p>{currentPhase.pasa}</p></div>
                <div><span className="eyebrow">QUÉ SALE</span><p>{currentPhase.sale}</p></div>
              </div>
            </section>
            {step==="registration" ? <RegistrationForm demo={demo} state={state} />
             : step==="diagnosis" ? <DiagnosisForm key={person!.id} demo={demo} state={state} done={() => setView("psychometric")} />
             : step==="psychometric" ? <PsychometricForm key={person!.id} demo={demo} state={state} person={person!} done={() => setView("softskills")} />
             : step==="softskills" ? <SoftSkillsLesson done={() => setView("profile")} />
             : step==="profile" ? <ProfileForm key={person!.id} demo={demo} state={state} done={() => setView("questionnaire")} />
             : step==="questionnaire" ? <QuestionnaireForm key={person!.id} demo={demo} state={state} person={person!} done={() => setView("summary")} />
             : step==="cv" ? <CvBuilder key={person!.id} demo={demo} state={state} person={person!} onBack={() => setView("summary")} />
             : person && <><section className="panel"><JourneyView key={person.id} demo={demo} state={state} person={person} onEdit={() => setView("questionnaire")} onCv={() => setView("cv")} /></section><PilotShare state={state} person={person} /><details className="panel profile-disclosure"><summary>Consultar mi expediente y perfil laboral</summary><ProfileDetails person={person} /></details><div className="form-actions"><button className="button secondary" onClick={() => setView("profile")}>Editar mi perfil</button><Link className="inline-link" href={`/equipo/participantes?persona=${person.id}`}>Así acompaña el equipo mi expediente<ArrowRight size={16} /></Link></div></>}
            {demo.hasPendingDraft && <p className="small muted">Guarda los cambios pendientes antes de cambiar de paso.</p>}
          </div>
        </div>
        </>;
      })()}
    </>}
  </Shell>;
}
