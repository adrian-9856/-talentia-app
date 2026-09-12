"use client";
import Link from "./safe-link";
import type { ReactNode } from "react";
import { ArrowUpRight, ArrowDown, DownloadSimple } from "@phosphor-icons/react";
import { companies, salaryReference } from "../data/labor-market.ts";
import { money, opportunityLinks } from "../domain/guidance.ts";
import type { Profile, Questionnaire } from "../domain/types.ts";

export function PageHeading({eyebrow,title,description,children}:{eyebrow:string;title:string;description:string;children?:ReactNode}) { return <div className="page-heading"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{children}</div>; }
export function PanelHeading({title,description,href,link="Explorar"}:{title:string;description?:string;href?:string;link?:string}) { return <div className="panel-heading"><div><h2>{title}</h2>{description&&<p>{description}</p>}</div>{href&&<Link className="inline-link" href={href}>{link}<ArrowUpRight size={15}/></Link>}</div>; }
export function Metric({label,value,detail,accent=false,children}:{label:string;value:string|number;detail:string;accent?:boolean;children?:ReactNode}) { return <article className={`metric-card ${accent?"featured":""}`}><span>{label}</span><strong>{value}</strong><small>{detail}</small>{children}</article>; }
export function ChartLegend({items}:{items:{label:string;color:string}[]}) {return <div className="chart-legend">{items.map(item=><span key={item.label}><i style={{background:item.color}}/>{item.label}</span>)}</div>;}
export function SourceNote(){return <div className="source-note"><strong>Referencia oficial · Guatemala 2026</strong><p>Salarios mensuales de jornada completa. CE1: departamento de Guatemala; CE2: resto del país. La región corresponde al centro de trabajo. Base e incentivo se muestran por separado.</p><a href={salaryReference.sources[0].url} target="_blank" rel="noreferrer">{salaryReference.sources[0].title}<ArrowUpRight size={13}/></a><a href={salaryReference.sources[1].url} target="_blank" rel="noreferrer">Consultar tablas 6 y 7 · Memoria MINTRAB<ArrowUpRight size={13}/></a></div>;}
export function ExportButton({rows,filename}:{rows:(string|number)[][];filename:string}) {
  function download(){
    const csv=rows.map(row=>row.map(value=>`"${String(value).replace(/^[=+@-]/,"'$&").replaceAll('"','""')}"`).join(",")).join("\r\n");
    const url=URL.createObjectURL(new Blob(["﻿",csv],{type:"text/csv;charset=utf-8;"}));const link=document.createElement("a");link.href=url;link.download=filename;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  return <button className="button secondary" onClick={download}><DownloadSimple size={16}/>Exportar CSV</button>;
}

function ConnectionScoreBar({score}:{score:number}) {
  const color = score >= 70 ? "#4d9278" : score >= 45 ? "#c87941" : "#8a948c";
  const label = score >= 70 ? "Alta compatibilidad" : score >= 45 ? "Compatibilidad media" : "Por conversar";
  return <div className="connection-score"><div className="connection-score-label"><span>{label}</span><strong style={{color}}>{score}%</strong></div><div className="connection-score-track"><div className="connection-score-fill" style={{width:`${score}%`,background:color}}/></div></div>;
}

export function OpportunitiesForPerson({answers,profile}:{answers:Questionnaire;profile:Profile|null}) {
  const links=opportunityLinks(answers,profile);
  return <div className="opportunity-links"><p className="small muted">Conexiones por ocupación de interés. Los requisitos, el horario y el salario se conversan con la persona; estas sugerencias no envían postulaciones.</p>{links.length?links.map(({opportunity:offer,reasons,pending,connectionScore})=>{
    const company=companies.find(item=>item.id===offer.companyId)!;
    return <article className="opportunity-match" key={offer.id}><div className="match-title"><span className={`company-avatar ${company.color}`}>{company.initials}</span><div><h3>{offer.title}</h3><p>{company.name} · {company.municipality}</p></div><ArrowUpRight size={18}/></div><ConnectionScoreBar score={connectionScore}/><div className="salary-line"><strong>{money(offer.baseMin,2)}{offer.baseMax!==offer.baseMin?` – ${money(offer.baseMax)}`:""}</strong><span>base / mes + {money(offer.incentive)} incentivo</span></div><div className="match-reasons"><div><span className="eyebrow">PUNTOS EN COMÚN</span><ul>{reasons.map(text=><li key={text}>{text}</li>)}</ul></div><div><span className="eyebrow">POR CONVERSAR</span><ul>{pending.map(text=><li key={text}>{text}</li>)}</ul></div></div><Link className="inline-link" href={`/equipo/empresas?oferta=${offer.id}`}>Ver condiciones de la oportunidad<ArrowUpRight size={14}/></Link></article>;
  }):<div className="empty-inline"><h3>Aún no hay una ocupación de interés.</h3><p>El cuestionario ayuda a explorarla antes de conversar oportunidades.</p></div>}</div>;
}
export function EmptyChart(){return <div className="empty-state"><ArrowDown size={24}/><h3>No hay datos con estos filtros</h3><p>Cambia la selección para explorar otros escenarios.</p></div>;}
