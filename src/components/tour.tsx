"use client";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { ArrowLeft, ArrowRight, X } from "@phosphor-icons/react";

export type TourStep = {
  target: string; // CSS selector; use "" for "welcome" step (centered card without spotlight)
  title: string;
  body: string;
  placement?: "top" | "bottom" | "left" | "right" | "auto";
};

type Props = { storageKey: string; steps: TourStep[]; startEvent?: string };

type Rect = { top: number; left: number; width: number; height: number };

function getRect(selector: string): Rect | null {
  if (!selector) return null;
  const el = document.querySelector(selector) as HTMLElement | null;
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

export function Tour({ storageKey, steps, startEvent }: Props) {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(storageKey);
      if (!seen) {
        const timer = setTimeout(() => setActive(true), 400);
        return () => clearTimeout(timer);
      }
    } catch { /* ignore */ }
  }, [storageKey]);

  useEffect(() => {
    if (!startEvent) return;
    const handler = () => { setStep(0); setActive(true); };
    window.addEventListener(startEvent, handler);
    return () => window.removeEventListener(startEvent, handler);
  }, [startEvent]);

  const updateRect = useCallback(() => {
    if (!active) return;
    const target = steps[step]?.target;
    const nextRect = target ? getRect(target) : null;
    setRect(nextRect);
    if (target && nextRect) {
      const el = document.querySelector(target) as HTMLElement | null;
      if (el) {
        const inView = nextRect.top >= 0 && nextRect.top + nextRect.height <= window.innerHeight;
        if (!inView) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [active, step, steps]);

  useLayoutEffect(() => { updateRect(); }, [updateRect]);
  useEffect(() => {
    if (!active) return;
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);
    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [active, updateRect]);

  function finish() {
    setActive(false);
    try { localStorage.setItem(storageKey, "1"); } catch { /* ignore */ }
  }
  function next() { if (step < steps.length - 1) setStep(step + 1); else finish(); }
  function prev() { if (step > 0) setStep(step - 1); }

  if (!active) return null;
  const current = steps[step];
  if (!current) { finish(); return null; }

  const PAD = 10;
  const spotlightStyle = rect ? {
    top: rect.top - PAD,
    left: rect.left - PAD,
    width: rect.width + PAD * 2,
    height: rect.height + PAD * 2,
  } : null;

  // Compute tooltip position
  const TOOLTIP_W = 400;
  const TOOLTIP_MARGIN = 16;
  let ttStyle: React.CSSProperties = { left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: TOOLTIP_W };
  if (spotlightStyle) {
    const targetCenterX = spotlightStyle.left + spotlightStyle.width / 2;
    const targetCenterY = spotlightStyle.top + spotlightStyle.height / 2;
    const spaceBelow = window.innerHeight - (spotlightStyle.top + spotlightStyle.height);
    const spaceRight = window.innerWidth - (spotlightStyle.left + spotlightStyle.width);
    let placement = current.placement ?? "auto";
    if (placement === "auto") {
      if (spaceBelow > 200) placement = "bottom";
      else if (spotlightStyle.top > 200) placement = "top";
      else if (spaceRight > TOOLTIP_W + 40) placement = "right";
      else placement = "left";
    }
    if (placement === "bottom") ttStyle = { top: spotlightStyle.top + spotlightStyle.height + TOOLTIP_MARGIN, left: Math.max(16, Math.min(window.innerWidth - TOOLTIP_W - 16, targetCenterX - TOOLTIP_W / 2)), width: TOOLTIP_W, transform: "none" };
    else if (placement === "top") ttStyle = { top: Math.max(16, spotlightStyle.top - TOOLTIP_MARGIN - 220), left: Math.max(16, Math.min(window.innerWidth - TOOLTIP_W - 16, targetCenterX - TOOLTIP_W / 2)), width: TOOLTIP_W, transform: "none" };
    else if (placement === "right") ttStyle = { top: Math.max(16, targetCenterY - 110), left: spotlightStyle.left + spotlightStyle.width + TOOLTIP_MARGIN, width: TOOLTIP_W, transform: "none" };
    else ttStyle = { top: Math.max(16, targetCenterY - 110), left: Math.max(16, spotlightStyle.left - TOOLTIP_MARGIN - TOOLTIP_W), width: TOOLTIP_W, transform: "none" };
  }

  return <div className="tour-overlay" role="dialog" aria-modal="true" aria-labelledby="tour-title">
    {spotlightStyle
      ? <div className="tour-spotlight" style={spotlightStyle}/>
      : <div className="tour-backdrop"/>}
    <div className="tour-tooltip" style={ttStyle}>
      <div className="tour-tooltip-head">
        <span className="tour-tooltip-count">Paso {step + 1} de {steps.length}</span>
        <button type="button" className="tour-close" onClick={finish} aria-label="Cerrar tour"><X size={16}/></button>
      </div>
      <h3 id="tour-title">{current.title}</h3>
      <p>{current.body}</p>
      <div className="tour-tooltip-actions">
        <button type="button" className="text-button" onClick={finish}>Saltar</button>
        <div className="tour-dots">
          {steps.map((_, i) => <span key={i} className={i === step ? "active" : i < step ? "done" : ""}/>)}
        </div>
        <div className="tour-nav">
          {step > 0 && <button type="button" className="button secondary" onClick={prev}><ArrowLeft size={14}/>Anterior</button>}
          <button type="button" className="button primary" onClick={next}>{step === steps.length - 1 ? "Entendido" : <>Siguiente <ArrowRight size={14}/></>}</button>
        </div>
      </div>
    </div>
  </div>;
}
