"use client";
import { useState, type FormEvent } from "react";
import Link from "./safe-link";
import { ArrowRight, ArrowUpRight, Briefcase, ChatCircleText, Check, CheckCircle, Coffee, Desktop, Lightbulb, LockSimple, Path, PencilSimple, Plant, Printer, ShieldCheck, ShoppingBag, User, UsersThree, Wrench } from "@phosphor-icons/react";

const softSkillIcons: Record<string, React.ComponentType<{size?:number;weight?:"regular"|"bold"|"fill"|"duotone"}>> = {
  ChatCircleText, UsersThree, Lightbulb, ShieldCheck,
};
const occupationIcons: Record<string, {Icon: React.ComponentType<{size?:number;weight?:"regular"|"bold"|"fill"|"duotone"}>; color: string}> = {
  barista: { Icon: Coffee, color:"#a06842" },
  administracion: { Icon: Briefcase, color:"#4665e7" },
  electricidad: { Icon: Lightbulb, color:"#e0a13a" },
  refrigeracion: { Icon: Wrench, color:"#4d9ec7" },
  ventas: { Icon: ShoppingBag, color:"#33c377" },
  soporte: { Icon: Desktop, color:"#8250df" },
  agricultura: { Icon: Plant, color:"#5aa54a" },
};
import { occupations, occupationLabel, scenarios } from "../data/labor-market.ts";
import { blankPsychometric, getJourney, initialAnswers, money, participantProfile, psychometricGroupColors, psychometricGroupNames, psychometricOptions, psychometricQuestions, questionnaireFields, scorePsychometric, softSkillsCards } from "../domain/guidance.ts";
import type { CvData, CvEducationEntry, CvExperienceEntry, DemoState, Participant, PsychometricAnswers, Questionnaire, StepStatus } from "../domain/types.ts";
import { formatDate } from "./shared";
import { OpportunitiesForPerson } from "./analytics-shared";
import { messageFrom, useDemo } from "./use-demo";
type DemoHook=ReturnType<typeof useDemo>;

export function QuestionnaireForm({demo,state,person,done}:{demo:DemoHook;state:DemoState;person:Participant;done:()=>void}){
  const [failedDraft,setFailedDraft]=useState<Partial<Questionnaire>|null>(null);const [confirmed,setConfirmed]=useState(false);
  const saved=getJourney(state,person);
  const unsaved=demo.hasPendingDraft?failedDraft:null;
  const draft={...(state.questionnaireDrafts?.[person.id]??saved?.answers??initialAnswers(person)),...unsaved};
  const needsConfirmation=!!(saved?.reviewedAt||saved?.steps.some(step=>step.status!=="pendiente"));
  function change(key:keyof Questionnaire,value:string){const next={...unsaved,[key]:value};setConfirmed(false);try{demo.run(repo=>repo.saveQuestionnaireDraft(person.id,next),true);setFailedDraft(null);}catch(cause){setFailedDraft(next);demo.setError(messageFrom(cause));}}
  function submit(event:FormEvent){event.preventDefault();if(needsConfirmation&&!confirmed)return;try{demo.run(repo=>repo.saveQuestionnaire(person.id,draft));done();}catch(cause){demo.setError(messageFrom(cause));}}
  return <form className="form-card questionnaire-form" onSubmit={submit}>
    <div className="form-card-header"><span className="eyebrow">PASO 5 · CUESTIONARIO LABORAL</span><h2>¿Hacia dónde quieres ir?</h2><p>Tus respuestas ayudan a preparar una propuesta de ruta. Puedes dejar cualquier pregunta pendiente.</p></div>
    <fieldset className="occupation-picker">
      <legend>¿Qué trabajo te interesa?</legend>
      <div className="occupation-grid">
        {occupations.map(item=>{
          const cfg=occupationIcons[item.id];
          const selected=draft.occupation===item.id;
          const Icon=cfg?.Icon;
          return <button type="button" key={item.id} className={`occupation-card ${selected?"selected":""}`} onClick={()=>change("occupation",item.id)} style={{"--occ-color":cfg?.color??"#4665e7"} as React.CSSProperties}>
            <span className="occupation-card-icon">{Icon?<Icon size={30} weight={selected?"fill":"duotone"}/>:<Briefcase size={30}/>}</span>
            <strong>{item.label}</strong>
            <small>{item.area}</small>
            {selected&&<span className="occupation-card-check"><Check size={12} weight="bold"/></span>}
          </button>;
        })}
        <button type="button" className={`occupation-card explore ${draft.occupation===""?"selected":""}`} onClick={()=>change("occupation","")}>
          <span className="occupation-card-icon"><Path size={30} weight="duotone"/></span>
          <strong>Quiero explorar</strong>
          <small>Todavía no lo sé</small>
        </button>
      </div>
    </fieldset>
    <div className="field-grid">
      <label className="field">Expectativa de salario base mensual (Q)<input type="number" min="0.01" max="100000" step="0.01" value={draft.expectedSalary} onChange={event=>change("expectedSalary",event.target.value)} placeholder="Ejemplo: 4500"/><span className="field-hint">Sin bonificación incentivo. Para tu disponibilidad: {participantProfile(person)?.availability||"por definir"}. No es tu ingreso actual.</span></label>
      <label className="field">Meses de experiencia en esta ocupación<input type="number" min="0" max="600" step="1" value={draft.experienceMonths} onChange={event=>change("experienceMonths",event.target.value)} placeholder="0 si estás comenzando"/><span className="field-hint">Incluye prácticas o experiencia informal, identificándolas en tu perfil.</span></label>
      {questionnaireFields.map(field=><label className="field" key={field.key}>{field.label}<select value={draft[field.key]} onChange={event=>change(field.key,event.target.value)}><option value="">Lo conversaré después</option>{field.options.map(option=><option key={option}>{option}</option>)}</select></label>)}
    </div>
    {needsConfirmation&&<div className="consent-box"><label><input type="checkbox" checked={confirmed} onChange={event=>setConfirmed(event.target.checked)}/><span>Preparar una nueva ruta y reiniciar el avance de sus actividades. La revisión anterior quedará pendiente.</span></label><p>Tu perfil y el historial de estados se conservan.</p></div>}
    <div className="form-actions"><span className="small muted">El equipo revisa la propuesta contigo.</span><button className="button primary" disabled={needsConfirmation&&!confirmed}>Preparar mi ruta<ArrowRight size={16}/></button></div>
  </form>;
}

export function PsychometricForm({demo,state,person,done}:{demo:DemoHook;state:DemoState;person:Participant;done:()=>void}){
  const saved=state.psychometrics?.[person.id];
  const isLocked=!!saved;
  const draft={...(state.psychometricDrafts?.[person.id]??saved??blankPsychometric())};
  const allAnswered=psychometricQuestions.every(q=>draft[q.id as keyof PsychometricAnswers]);
  const [submitted,setSubmitted]=useState(false);
  const [showResult,setShowResult]=useState(isLocked);
  const answered=psychometricQuestions.filter(q=>draft[q.id as keyof PsychometricAnswers]).length;
  const firstUnansweredIdx=psychometricQuestions.findIndex(q=>!draft[q.id as keyof PsychometricAnswers]);
  const [index,setIndex]=useState(firstUnansweredIdx>=0?firstUnansweredIdx:0);
  const q=psychometricQuestions[index];
  const currentValue=draft[q.id as keyof PsychometricAnswers];
  const isLast=index===psychometricQuestions.length-1;
  function pick(value:string){
    if(isLocked)return;
    try{demo.run(repo=>repo.savePsychometricDraft(person.id,{[q.id]:value}),true);}
    catch(cause){demo.setError(messageFrom(cause));return;}
    if(!isLast){setTimeout(()=>setIndex(i=>Math.min(psychometricQuestions.length-1,i+1)),180);}
  }
  function submit(){if(!allAnswered||isLocked)return;try{demo.run(repo=>repo.savePsychometric(person.id,draft as PsychometricAnswers));setShowResult(true);}catch(cause){demo.setError(messageFrom(cause));}}
  function finish(){setSubmitted(true);setTimeout(()=>done(),1400);}
  if(submitted) return <div className="psych-success"><div className="psych-success-icon">✓</div><h2>¡Perfil completado!</h2><p>Gracias por tomarte el tiempo de responder. El equipo utilizará tus respuestas para preparar una ruta más personalizada para ti.</p><p className="small muted">Pasando al siguiente paso...</p></div>;
  if(showResult&&allAnswered){
    const result=scorePsychometric(draft as PsychometricAnswers);
    const groups=["R","I","A","S","E","C"] as const;
    const sortedGroups=[...groups].sort((a,b)=>(result[b]-result[a]));
    const dominantColor=psychometricGroupColors[result.dominante];
    return <div className="form-card psych-hero" style={{"--dom-color":dominantColor} as React.CSSProperties}>
      <div className="psych-hero-badge">Tu perfil</div>
      <div className="psych-hero-eyebrow">Eres del tipo</div>
      <h1 className="psych-hero-title">{psychometricGroupNames[result.dominante]}</h1>
      <p className="psych-hero-lead">Tus fortalezas dominantes se orientan hacia este perfil. Esto nos ayuda a diseñar una ruta laboral que encaje con quién eres.</p>
      <div className="psych-hero-bars">
        {sortedGroups.map((g,i)=>{
          const score=result[g];
          const isDom=g===result.dominante;
          return <div className={`psych-bar-row ${isDom?"dominant":""}`} key={g} style={{"--g-color":psychometricGroupColors[g],"--anim-delay":`${i*90}ms`} as React.CSSProperties}>
            <span className="psych-bar-name">{psychometricGroupNames[g]}</span>
            <div className="psych-bar-track"><div className="psych-bar-fill" style={{width:`${score}%`}}/></div>
            <span className="psych-bar-pct">{score}%</span>
          </div>;
        })}
      </div>
      {isLocked && <div className="psych-locked-notice">
        <LockSimple size={16} weight="fill"/>
        <div><strong>Test bloqueado</strong><p>Ya completaste el test. Si necesitas cambiar tus respuestas, pídele al equipo que lo desbloquee desde el panel de administración.</p></div>
      </div>}
      <div className="form-actions psych-hero-actions">
        <button type="button" className="button primary" onClick={finish}>Continuar a habilidades blandas <ArrowRight size={16}/></button>
      </div>
    </div>;
  }
  return <div className="form-card psych-single">
    <div className="form-card-header"><span className="eyebrow">PASO 4 · CONOCE TUS FORTALEZAS</span><h2>¿Cómo eres en el trabajo?</h2></div>
    <div className="psych-progress-hero"><div className="psych-progress-track"><div style={{width:`${Math.round((answered/psychometricQuestions.length)*100)}%`}}/></div><span>{answered} / {psychometricQuestions.length}</span></div>
    <div className="psych-question-hero" key={q.id}>
      <span className="psych-question-num">Pregunta {index+1} de {psychometricQuestions.length}</span>
      <p className="psych-question-text">{q.label}</p>
      <div className="psych-options-hero">
        {psychometricOptions.map(opt=><button type="button" key={opt} className={`psych-option-hero ${currentValue===opt?"selected":""}`} onClick={()=>pick(opt)}>
          <span>{opt}</span>
        </button>)}
      </div>
    </div>
    <div className="form-actions">
      <button type="button" className="button secondary" disabled={index===0} onClick={()=>setIndex(i=>Math.max(0,i-1))}>← Anterior</button>
      <span className="small muted">No hay respuestas correctas.</span>
      {isLast
        ? <button type="button" className="button primary" disabled={!allAnswered} onClick={submit}>Ver mi resultado <ArrowRight size={16}/></button>
        : <button type="button" className="button secondary" disabled={!currentValue} onClick={()=>setIndex(i=>Math.min(psychometricQuestions.length-1,i+1))}>Siguiente <ArrowRight size={16}/></button>}
    </div>
  </div>;
}

const emptyExperience=():CvExperienceEntry=>({title:"",company:"",dateRange:"",bullets:""});
const emptyEducation=():CvEducationEntry=>({degree:"",institution:"",dateRange:"",bullets:""});

function initials(name:string){return name.split(" ").filter(Boolean).slice(0,2).map(w=>w[0]?.toUpperCase()??"").join("");}
function toBulletLines(text:string){return text.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);}

export function SoftSkillsLesson({done}:{done:()=>void}){
  const [index,setIndex]=useState(0);
  const card=softSkillsCards[index];
  const isLast=index===softSkillsCards.length-1;
  const Icon=softSkillIcons[card.icon];
  return <div className="form-card softskills-lesson">
    <div className="form-card-header"><span className="eyebrow">FASE 2 · HABILIDADES BLANDAS · ⏱ 3 MIN</span><h2>¿Qué son y por qué importan?</h2><p>Las habilidades blandas son las que usas todos los días con otras personas. Las empresas las valoran tanto o más que las técnicas.</p></div>
    <div className="softskills-progress">{softSkillsCards.map((_,i)=><span key={i} className={i<=index?"active":""}/>)}</div>
    <div className="softskills-card" style={{"--skill-color":card.color} as React.CSSProperties}>
      <div className="softskills-icon">{Icon&&<Icon size={48} weight="duotone"/>}</div>
      <div className="softskills-content">
        <h3>{card.title}</h3>
        <p>{card.body}</p>
        <p className="softskills-example">{card.example}</p>
      </div>
    </div>
    <div className="form-actions">
      <button type="button" className="button secondary" disabled={index===0} onClick={()=>setIndex(i=>Math.max(0,i-1))}>← Anterior</button>
      <span className="small muted">{index+1} de {softSkillsCards.length}</span>
      {!isLast?<button type="button" className="button primary" onClick={()=>setIndex(i=>i+1)}>Siguiente <ArrowRight size={16}/></button>
        :<button type="button" className="button primary" onClick={done}>Ya lo entendí <Check size={16}/></button>}
    </div>
  </div>;
}

export function CvBuilder({demo,state,person,onBack}:{demo:DemoHook;state:DemoState;person:Participant;onBack:()=>void}){
  const profile=participantProfile(person);
  const saved=state.cvData?.[person.id];
  const seedExperience=():CvExperienceEntry[]=>{
    if(saved?.experiences?.length) return saved.experiences;
    if(profile?.experience) return [{title:profile.interest||"",company:"",dateRange:"",bullets:profile.experience}];
    return [emptyExperience()];
  };
  const seedEducation=():CvEducationEntry[]=>{
    if(saved?.education?.length) return saved.education;
    if(profile?.education) return [{degree:profile.education,institution:"",dateRange:"",bullets:profile.trainingType&&profile.trainingType!=="sin_respuesta"?profile.trainingType:""}];
    return [emptyEducation()];
  };
  const [form,setForm]=useState<CvData>({
    jobTitle:saved?.jobTitle??profile?.interest??"",
    summary:saved?.summary??profile?.objective??"",
    languages:saved?.languages??"",
    references:saved?.references??"",
    photo:saved?.photo??"",
    address:saved?.address??"",
    socialHandle:saved?.socialHandle??"",
    website:saved?.website??"",
    additionalInfo:saved?.additionalInfo??"",
    experiences:seedExperience(),
    education:seedEducation(),
  });
  const [wasSaved,setWasSaved]=useState(!!saved);
  function change<K extends keyof CvData>(key:K,value:CvData[K]){setForm(f=>({...f,[key]:value}));setWasSaved(false);}
  function changeExp(i:number,key:keyof CvExperienceEntry,value:string){setForm(f=>({...f,experiences:(f.experiences??[]).map((e,idx)=>idx===i?{...e,[key]:value}:e)}));setWasSaved(false);}
  function addExp(){setForm(f=>({...f,experiences:[...(f.experiences??[]),emptyExperience()]}));setWasSaved(false);}
  function removeExp(i:number){setForm(f=>({...f,experiences:(f.experiences??[]).filter((_,idx)=>idx!==i)}));setWasSaved(false);}
  function moveExp(i:number,dir:-1|1){setForm(f=>{const arr=[...(f.experiences??[])];const j=i+dir;if(j<0||j>=arr.length)return f;[arr[i],arr[j]]=[arr[j],arr[i]];return {...f,experiences:arr};});setWasSaved(false);}
  function changeEdu(i:number,key:keyof CvEducationEntry,value:string){setForm(f=>({...f,education:(f.education??[]).map((e,idx)=>idx===i?{...e,[key]:value}:e)}));setWasSaved(false);}
  function addEdu(){setForm(f=>({...f,education:[...(f.education??[]),emptyEducation()]}));setWasSaved(false);}
  function removeEdu(i:number){setForm(f=>({...f,education:(f.education??[]).filter((_,idx)=>idx!==i)}));setWasSaved(false);}
  function moveEdu(i:number,dir:-1|1){setForm(f=>{const arr=[...(f.education??[])];const j=i+dir;if(j<0||j>=arr.length)return f;[arr[i],arr[j]]=[arr[j],arr[i]];return {...f,education:arr};});setWasSaved(false);}
  function onPhoto(event:React.ChangeEvent<HTMLInputElement>){
    const file=event.target.files?.[0]; if(!file) return;
    if(file.size>2*1024*1024){demo.setError("La foto debe pesar menos de 2 MB.");return;}
    const reader=new FileReader();
    reader.onload=()=>{change("photo",typeof reader.result==="string"?reader.result:"");};
    reader.readAsDataURL(file);
  }
  function submit(event:FormEvent){event.preventDefault();try{demo.run(repo=>repo.saveCvData(person.id,form));setWasSaved(true);}catch(cause){demo.setError(messageFrom(cause));}}
  function downloadPdf(){
    const original=document.title;
    const safe=person.name.trim().replace(/\s+/g,"_").replace(/[^\w\-]/g,"");
    document.title=`CV_${safe||"TALENTIA"}`;
    const restore=()=>{document.title=original;window.removeEventListener("afterprint",restore);};
    window.addEventListener("afterprint",restore);
    window.print();
  }
  const skillsList=(profile?.skills??"").split(/[\n,]+/).map(s=>s.trim()).filter(Boolean);
  const languagesList=form.languages.split(/[,;\n]+/).map(s=>s.trim()).filter(Boolean);
  const additionalList=toBulletLines(form.additionalInfo??"");
  const contactLines=[person.phone,form.address,person.municipality+((person as {zona?:string}).zona?`, ${(person as {zona?:string}).zona}`:""),person.email,form.socialHandle,form.website].filter(Boolean) as string[];
  const experiences=(form.experiences??[]).filter(e=>e.title||e.company||e.bullets||e.dateRange);
  const education=(form.education??[]).filter(e=>e.degree||e.institution||e.bullets||e.dateRange);
  return <div className="cv-builder">
    <div className="cv-form-panel"><form onSubmit={submit}>
      <div className="form-card-header"><span className="eyebrow">PASO 7 · MI CV</span><h2>Tu hoja de vida lista</h2><p>Tus datos de perfil ya están incluidos. Ajusta lo que necesites y descarga.</p></div>
      <div className="field-grid">
        <label className="field wide">Foto (opcional, máx. 2 MB)<div className="cv-photo-row"><div className="cv-photo-thumb">{form.photo?<img src={form.photo} alt=""/>:<span>{initials(person.name)||"?"}</span>}</div><div className="cv-photo-controls"><input type="file" accept="image/*" onChange={onPhoto}/>{form.photo&&<button type="button" className="text-button danger" onClick={()=>change("photo","")}>Quitar foto</button>}</div></div></label>
        <label className="field wide">Cargo o título profesional<input value={form.jobTitle} maxLength={100} onChange={e=>change("jobTitle",e.target.value)} placeholder="Ej. Técnica en Administración · Asistente Contable"/></label>
        <label className="field wide">Resumen profesional<textarea rows={4} maxLength={600} value={form.summary} onChange={e=>change("summary",e.target.value)} placeholder="2-3 oraciones: qué sabes hacer, tu experiencia clave y qué buscas."/><span className="field-hint">Pre-llenado desde tu objetivo.</span></label>
        <label className="field">Dirección<input value={form.address??""} maxLength={120} onChange={e=>change("address",e.target.value)} placeholder="Calle, colonia"/></label>
        <label className="field">Usuario / red social<input value={form.socialHandle??""} maxLength={80} onChange={e=>change("socialHandle",e.target.value)} placeholder="@usuario"/></label>
        <label className="field wide">Sitio web (opcional)<input value={form.website??""} maxLength={120} onChange={e=>change("website",e.target.value)} placeholder="www.ejemplo.com"/></label>
        <label className="field wide">Idiomas<input value={form.languages} maxLength={200} onChange={e=>change("languages",e.target.value)} placeholder="Español (nativo), Inglés básico"/></label>
        <label className="field wide">Información adicional<textarea rows={3} maxLength={500} value={form.additionalInfo??""} onChange={e=>change("additionalInfo",e.target.value)} placeholder="Una línea por punto (voluntariados, cursos, disponibilidad)."/><span className="field-hint">Se muestran como viñetas en la barra lateral.</span></label>
      </div>

      <div className="cv-subform"><div className="cv-subform-header"><h3>Experiencia profesional</h3><button type="button" className="text-button" onClick={addExp}>+ Agregar puesto</button></div>
        {(form.experiences??[]).map((exp,i)=><div className="cv-entry" key={i}>
          <div className="cv-entry-head"><strong>Puesto {i+1}</strong><div className="cv-entry-actions">{i>0&&<button type="button" className="icon-button" onClick={()=>moveExp(i,-1)} title="Subir">↑</button>}{i<(form.experiences??[]).length-1&&<button type="button" className="icon-button" onClick={()=>moveExp(i,1)} title="Bajar">↓</button>}{(form.experiences??[]).length>1&&<button type="button" className="text-button danger" onClick={()=>removeExp(i)}>Quitar</button>}</div></div>
          <div className="field-grid">
            <label className="field">Cargo<input value={exp.title} maxLength={80} onChange={e=>changeExp(i,"title",e.target.value)} placeholder="Directora de Arquitectura"/></label>
            <label className="field">Fecha<input value={exp.dateRange} maxLength={40} onChange={e=>changeExp(i,"dateRange",e.target.value)} placeholder="2016 - Presente"/></label>
            <label className="field wide">Empresa<input value={exp.company} maxLength={80} onChange={e=>changeExp(i,"company",e.target.value)} placeholder="Nombre de la empresa"/></label>
            <label className="field wide">Logros / responsabilidades<textarea rows={3} maxLength={500} value={exp.bullets} onChange={e=>changeExp(i,"bullets",e.target.value)} placeholder="Una línea por viñeta."/></label>
          </div>
        </div>)}
      </div>

      <div className="cv-subform"><div className="cv-subform-header"><h3>Educación profesional</h3><button type="button" className="text-button" onClick={addEdu}>+ Agregar estudio</button></div>
        {(form.education??[]).map((ed,i)=><div className="cv-entry" key={i}>
          <div className="cv-entry-head"><strong>Estudio {i+1}</strong><div className="cv-entry-actions">{i>0&&<button type="button" className="icon-button" onClick={()=>moveEdu(i,-1)} title="Subir">↑</button>}{i<(form.education??[]).length-1&&<button type="button" className="icon-button" onClick={()=>moveEdu(i,1)} title="Bajar">↓</button>}{(form.education??[]).length>1&&<button type="button" className="text-button danger" onClick={()=>removeEdu(i)}>Quitar</button>}</div></div>
          <div className="field-grid">
            <label className="field">Título<input value={ed.degree} maxLength={80} onChange={e=>changeEdu(i,"degree",e.target.value)} placeholder="Maestría en Arquitectura"/></label>
            <label className="field">Fecha<input value={ed.dateRange} maxLength={40} onChange={e=>changeEdu(i,"dateRange",e.target.value)} placeholder="2012 - 2014"/></label>
            <label className="field wide">Institución<input value={ed.institution} maxLength={80} onChange={e=>changeEdu(i,"institution",e.target.value)} placeholder="Universidad Ensigna"/></label>
            <label className="field wide">Detalle<textarea rows={3} maxLength={500} value={ed.bullets} onChange={e=>changeEdu(i,"bullets",e.target.value)} placeholder="Una línea por viñeta."/></label>
          </div>
        </div>)}
      </div>

      <div className="field-grid"><label className="field wide">Referencias<textarea rows={3} maxLength={500} value={form.references} onChange={e=>change("references",e.target.value)} placeholder="Nombre · Cargo · Teléfono o correo"/></label></div>

      <div className="form-actions"><button type="button" className="button secondary" onClick={downloadPdf}><Printer size={16}/>Descargar PDF</button><button className="button primary" type="submit">{wasSaved?"✓ Guardado":"Guardar CV"}</button></div>
    </form></div>

    <div className="ats-cv" id="cv-print-area">
      <div className="ats-columns">
        <aside className="ats-sidebar">
          <div className="ats-photo">{form.photo?<img src={form.photo} alt=""/>:<span className="ats-photo-fallback">{initials(person.name)}</span>}</div>
          <div className="ats-s-section"><h2>CONTACTO</h2><ul>{contactLines.map((c,i)=><li key={i}>{c}</li>)}</ul></div>
          {additionalList.length>0&&<div className="ats-s-section"><h2>INFORMACIÓN ADICIONAL</h2><ul>{additionalList.map((l,i)=><li key={i}>{l}</li>)}</ul></div>}
          {skillsList.length>0&&<div className="ats-s-section"><h2>HABILIDADES</h2><ul>{skillsList.map((s,i)=><li key={i}>{s}</li>)}</ul></div>}
          {languagesList.length>0&&<div className="ats-s-section"><h2>IDIOMAS</h2><ul>{languagesList.map((l,i)=><li key={i}>{l}</li>)}</ul></div>}
        </aside>
        <main className="ats-main">
          <header className="ats-heading">
            <h1>{person.name.toUpperCase()}</h1>
            {form.summary&&<p className="ats-summary">{form.summary}</p>}
            <hr className="ats-divider"/>
          </header>

          {experiences.length>0&&<section className="ats-m-section"><h2>EXPERIENCIA PROFESIONAL</h2>
            {experiences.map((exp,i)=><div className="ats-entry" key={i}>
              <div className="ats-entry-head"><strong>{exp.title||"Cargo"}</strong>{exp.dateRange&&<span className="ats-entry-date">{exp.dateRange}</span>}</div>
              {exp.company&&<div className="ats-entry-sub">{exp.company}</div>}
              {toBulletLines(exp.bullets).length>0&&<ul className="ats-entry-bullets">{toBulletLines(exp.bullets).map((b,j)=><li key={j}>{b}</li>)}</ul>}
            </div>)}
          </section>}

          {education.length>0&&<section className="ats-m-section"><h2>EDUCACIÓN PROFESIONAL</h2>
            {education.map((ed,i)=><div className="ats-entry" key={i}>
              <div className="ats-entry-head"><strong>{ed.degree||"Título"}</strong>{ed.dateRange&&<span className="ats-entry-date">{ed.dateRange}</span>}</div>
              {ed.institution&&<div className="ats-entry-sub">{ed.institution}</div>}
              {toBulletLines(ed.bullets).length>0&&<ul className="ats-entry-bullets">{toBulletLines(ed.bullets).map((b,j)=><li key={j}>{b}</li>)}</ul>}
            </div>)}
          </section>}

          {form.references&&<section className="ats-m-section"><h2>REFERENCIAS</h2><p style={{whiteSpace:"pre-wrap"}}>{form.references}</p></section>}
        </main>
      </div>
      <div className="ats-footer-line">Generado por TALENTIA · {new Date().toLocaleDateString("es-GT")}</div>
    </div>

    <div className="cv-back-action"><button className="text-button" onClick={onBack}>← Volver a mi ruta</button></div>
  </div>;
}

export function JourneyView({demo,state,person,team=false,onEdit,onCv}:{demo:DemoHook;state:DemoState;person:Participant;team?:boolean;onEdit?:()=>void;onCv?:()=>void}){
  const journey=getJourney(state,person);const profile=participantProfile(person);const [notice,setNotice]=useState("");const [tab,setTab]=useState<"route"|"opportunities">("route");
  if(!journey)return <div className="empty-state"><Path size={32}/><h3>El próximo paso es conversar.</h3><p>Completa el cuestionario de esta persona para preparar una ruta y explorar oportunidades.</p>{onEdit?<button className="button primary" onClick={onEdit}>Completar cuestionario<ArrowRight size={16}/></button>:<Link className="button secondary" href="/participante" onClick={event=>{try{demo.run(repo=>repo.selectParticipant(person.id));}catch(cause){event.preventDefault();demo.setError(messageFrom(cause));}}}>Abrir vista participante</Link>}</div>;
  const completed=journey.steps.filter(step=>step.status==="completado").length;
  const isScenario=person.source==="sample"&&!state.journeys?.[person.id];
  const psychResult=state.psychometrics?.[person.id]?scorePsychometric(state.psychometrics[person.id]):null;
  function update(id:string,status:StepStatus){try{demo.run(repo=>repo.updateRouteStep(person.id,id,status));setNotice("Actividad actualizada. La propuesta queda disponible para revisión del equipo.");}catch(cause){demo.setError(messageFrom(cause));}}
  function review(){try{demo.run(repo=>repo.reviewRoute(person.id));setNotice("Revisión registrada por Equipo demo. No se envió ninguna postulación.");}catch(cause){demo.setError(messageFrom(cause));}}
  return <div className="journey-workspace"><div className="journey-summary"><div><span className="eyebrow">{isScenario?"RUTA DE EJEMPLO · DATOS FICTICIOS":"PROPUESTA DE ACOMPAÑAMIENTO"}</span><h2>Un camino hacia {occupationLabel(journey.answers.occupation).toLowerCase()}.</h2><p>{profile?.objective||scenarios[person.id]?.story||"Construyamos un próximo paso a partir de tus intereses."}</p></div><div className="journey-progress"><strong>{completed}<span> / {journey.steps.length}</span></strong><span>actividades completadas</span><progress value={completed} max={journey.steps.length} aria-label="Avance de actividades"/></div></div>
    {team&&psychResult&&<div className="journey-psych-badge"><span className="eyebrow">PERFIL PSICOMÉTRICO</span><strong style={{color:psychometricGroupColors[psychResult.dominante]}}>{psychometricGroupNames[psychResult.dominante]}</strong><div className="psych-mini-bars">{(["R","I","A","S","E","C"] as const).map(g=><div key={g} title={`${psychometricGroupNames[g]}: ${psychResult[g]}%`}><div style={{height:`${psychResult[g]}%`,background:psychometricGroupColors[g]}}/><span>{g}</span></div>)}</div></div>}
    <div className="journey-facts"><div><span>Interés</span><strong>{occupationLabel(journey.answers.occupation)}</strong></div><div><span>Experiencia declarada</span><strong>{journey.answers.experienceMonths!==""?`${journey.answers.experienceMonths} meses`:"Por conversar"}</strong></div><div><span>Expectativa base / mes</span><strong>{journey.answers.expectedSalary?money(+journey.answers.expectedSalary):"Por conversar"}</strong></div><div><span>Disponibilidad</span><strong>{profile?.availability||"Por definir"}</strong></div></div>
    {notice&&<div className="notice success-notice" role="status">{notice}</div>}
    <div className="detail-tabs"><button className={tab==="route"?"active":""} aria-pressed={tab==="route"} onClick={()=>setTab("route")}>Ruta de acompañamiento</button><button className={tab==="opportunities"?"active":""} aria-pressed={tab==="opportunities"} onClick={()=>setTab("opportunities")}>Oportunidades para conversar</button>{onEdit&&<button className="edit-answers" onClick={onEdit}><PencilSimple size={14}/>Editar respuestas</button>}</div>
    {tab==="route"?<div className="journey-content"><ol className="route-steps">{journey.steps.map((step,index)=><li key={step.id} className={`route-step ${step.status}`}><span className="route-marker">{step.status==="completado"?<Check size={16} weight="bold"/>:String(index+1).padStart(2,"0")}</span><div className="route-step-content"><div className="route-step-heading"><div><span className="step-owner">{step.owner}</span><h3>{step.title}</h3></div>{step.id!=="revision"?<label className="step-state"><span className="sr-only">Estado de {step.title}</span><select value={step.status} onChange={event=>update(step.id,event.target.value as StepStatus)}><option value="pendiente">Pendiente</option><option value="en_proceso">En proceso</option><option value="completado">Completado</option></select></label>:<span className={`badge ${journey.reviewedAt?"green":"amber"}`}>{journey.reviewedAt?"Revisada":"Por revisar"}</span>}</div><p>{step.action}</p><div className="why-step"><strong>Por qué este paso</strong><span>{step.reason}</span></div></div></li>)}</ol><div className={`route-review ${journey.reviewedAt?"reviewed":""}`}><CheckCircle size={26}/><div><strong>{journey.reviewedAt?"Propuesta revisada por el equipo":"La orientación se construye contigo"}</strong><p>{journey.reviewedAt?`${journey.reviewedBy} · ${formatDate(journey.reviewedAt)}`:"Esta ruta se basa en las respuestas del cuestionario. El equipo y la participante confirman los pasos y las condiciones."}</p></div>{team&&!journey.reviewedAt&&<button className="button primary" onClick={review}>Registrar revisión<Check size={16}/></button>}</div>
    {onCv&&<div className="cv-route-cta"><div><strong>¿Lista para armar tu CV?</strong><p>Tu perfil laboral y psicometría ya están listos. Construye tu hoja de vida en el siguiente paso.</p></div><button className="button secondary" onClick={onCv}>Crear mi CV →</button></div>}
    </div>:<div className="journey-content"><OpportunitiesForPerson answers={journey.answers} profile={profile}/><Link className="inline-link salary-route-link" href="/equipo/salarios">Explorar referencias salariales<ArrowUpRight size={15}/></Link></div>}
  </div>;
}
