"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, Coffee, FolderOpen, DeviceMobile } from "@phosphor-icons/react";
import Link from "./safe-link";
import { getJourney } from "../domain/guidance.ts";
import { ErrorNotice, initials, Loading, Shell } from "./shared";
import { PageHeading } from "./analytics-shared";
import { JourneyView } from "./journey-components";
import { useDemo } from "./use-demo";
const cases=[{id:"p010",label:"Primer empleo",title:"Julia y su primera barra de café",text:"Sin experiencia en café. Interés en aprender y expectativa de Q4,500 base.",icon:Coffee},{id:"p008",label:"Experiencia informal",title:"Helena convierte tareas en experiencia",text:"Agenda, recibos y archivo: reconocer lo que ya sabe hacer.",icon:FolderOpen},{id:"p012",label:"Acompañamiento digital",title:"Laura necesita un canal accesible",text:"Prácticas técnicas y un teléfono compartido. Una ruta con apoyo.",icon:DeviceMobile}];
export default function RoutesScreen(){
  const demo=useDemo();const {state,loading,error}=demo;const params=useSearchParams();const [selectedId,setSelectedId]=useState<string|null>(null);
  const selected=state?.participants.find(person=>person.id===(selectedId??params.get("persona")??"p010"))??state?.participants[0];
  const journey=selected?getJourney(state!,selected):null;
  return <Shell viewRole="team"><PageHeading eyebrow="DEL CUESTIONARIO AL PRÓXIMO PASO" title="Cada persona, una ruta." description="Acompañamiento concreto, explicado y revisado por el equipo."/>
    {error&&<ErrorNotice message={error} retry={demo.retry}/>}{loading?<Loading/>:state&&<><div className="story-grid">{cases.filter(item=>state.participants.some(person=>person.id===item.id)).map(item=><button key={item.id} className={`story-card ${selected?.id===item.id?"active":""}`} aria-pressed={selected?.id===item.id} onClick={()=>setSelectedId(item.id)}><span className="story-icon"><item.icon size={23}/></span><span className="eyebrow">{item.label}</span><strong>{item.title}</strong><p>{item.text}</p><span className="story-action">Explorar caso<ArrowUpRight size={16}/></span></button>)}</div><section className="panel route-panel"><div className="route-person-picker"><div className="person-cell"><span className="avatar">{selected?initials(selected.name):""}</span><label className="field"><span>Expediente de demostración</span><select value={selected?.id??""} onChange={event=>setSelectedId(event.target.value)}>{state.participants.map(person=><option key={person.id} value={person.id}>{person.name}</option>)}</select></label></div>{selected&&<Link className="inline-link" href={`/equipo/participantes?persona=${selected.id}`}>Ver expediente completo<ArrowUpRight size={14}/></Link>}<span className={`badge ${journey?.reviewedAt?"green":"amber"}`}>{journey?.reviewedAt?"Revisión registrada":"Revisión pendiente"}</span></div>{selected?<JourneyView key={selected.id} demo={demo} state={state} person={selected} team/>:<div className="empty-state">Registra una persona ficticia para comenzar.</div>}</section></>}
  </Shell>;
}
