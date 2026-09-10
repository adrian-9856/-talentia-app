"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createLocalRepository, STORAGE_KEY } from "../domain/repository.ts";
import type { DemoRepository, DemoState } from "../domain/types.ts";

export function useDemo() {
  const repository = useRef<DemoRepository | null>(null);
  const pendingDraft = useRef<((repo: DemoRepository) => DemoState) | null>(null);
  const [hasPendingDraft, setHasPendingDraft] = useState(false);
  const [state, setState] = useState<DemoState | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const reload = useCallback(() => {
    try {
      repository.current ??= createLocalRepository(window.localStorage);
      setState(repository.current.load());
      if (!pendingDraft.current) setError("");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudieron abrir los datos del demo."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => {
    reload();
    const refresh = (event: StorageEvent) => { if (event.key === STORAGE_KEY || event.key === null) reload(); };
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, [reload]);
  useEffect(() => {
    const protectUnload = (event: BeforeUnloadEvent) => { if (pendingDraft.current) { event.preventDefault(); event.returnValue = ""; } };
    const protectNavigation = (event: MouseEvent) => {
      if (pendingDraft.current && event.target instanceof Element && event.target.closest("a[href]")) {
        event.preventDefault(); event.stopPropagation();
        setError("Hay cambios del formulario que no se han guardado. Usa Volver a intentar o el botón Guardar antes de cambiar de vista.");
      }
    };
    window.addEventListener("beforeunload", protectUnload);
    document.addEventListener("click", protectNavigation, true);
    return () => { window.removeEventListener("beforeunload", protectUnload); document.removeEventListener("click", protectNavigation, true); };
  }, []);
  const run = useCallback((action: (repo: DemoRepository) => DemoState, keepDraftOnError = false) => {
    if (!repository.current) throw new Error("Espera a que termine la carga del demo.");
    try {
      const next = action(repository.current);
      setState(next); setError(""); pendingDraft.current = null; setHasPendingDraft(false); return next;
    } catch (cause) {
      if (keepDraftOnError) { pendingDraft.current = action; setHasPendingDraft(true); }
      throw cause;
    }
  }, []);
  const retry = useCallback(() => {
    if (!pendingDraft.current) { reload(); return; }
    try { run(pendingDraft.current, true); } catch (cause) { setError(messageFrom(cause)); }
  }, [reload, run]);
  return { state, error, setError, loading, reload, retry, run, hasPendingDraft };
}

export function messageFrom(cause: unknown) { return cause instanceof Error ? cause.message : "No se pudo guardar. Inténtalo de nuevo."; }
