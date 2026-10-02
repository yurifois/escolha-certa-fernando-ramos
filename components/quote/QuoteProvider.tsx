"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { ServiceSlug } from "@/lib/quote";
import type { ProfileId } from "@/lib/services";
import QuoteWizard from "./QuoteWizard";

type OpenOptions = { service?: ServiceSlug; profile?: ProfileId };
type Ctx = { openQuote: (opts?: OpenOptions) => void; isOpen: boolean };

const QuoteContext = createContext<Ctx | null>(null);

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote precisa estar dentro de <QuoteProvider>");
  return ctx;
}

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const downOnBackdrop = useRef(false);
  const [isOpen, setOpen] = useState(false);
  const [opts, setOpts] = useState<OpenOptions>({});
  const [session, setSession] = useState(0);

  const openQuote = useCallback((o: OpenOptions = {}) => {
    triggerRef.current = document.activeElement as HTMLElement | null;
    setOpts(o);
    setSession((s) => s + 1);
    setOpen(true);
  }, []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (isOpen && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = "hidden";
    }
    if (!isOpen && d.open) d.close();
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setOpen(false);
    document.documentElement.style.overflow = "";
    // devolve o foco para quem abriu
    requestAnimationFrame(() => triggerRef.current?.focus?.());
  }, []);

  return (
    <QuoteContext.Provider value={{ openQuote, isOpen }}>
      {children}
      <dialog
        ref={dialogRef}
        onClose={handleClose}
        onPointerDown={(e) => {
          downOnBackdrop.current = e.target === dialogRef.current;
        }}
        onClick={(e) => {
          // fecha só se o clique começou e terminou no fundo (evita fechar ao arrastar seleção de texto)
          if (e.target === dialogRef.current && downOnBackdrop.current) dialogRef.current?.close();
          downOnBackdrop.current = false;
        }}
        aria-labelledby="quote-title"
        className="quote-dialog m-0 h-[100dvh] max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-[rgb(18_18_22/0.55)] backdrop:backdrop-blur-[3px] sm:m-auto sm:h-fit sm:max-h-[min(92dvh,860px)] sm:w-[min(94vw,720px)]"
      >
        {isOpen && (
          <div className="relative flex h-full flex-col overflow-hidden bg-paper sm:max-h-[min(92dvh,860px)] sm:rounded-[28px] sm:shadow-[var(--shadow-3)]">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="absolute right-3 top-3 z-20 grid size-11 place-items-center rounded-full text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
              aria-label="Fechar cotação"
            >
              <X className="size-5" />
            </button>
            <QuoteWizard
              key={session}
              initialService={opts.service}
              profile={opts.profile}
              variant="dialog"
              onDone={() => dialogRef.current?.close()}
            />
          </div>
        )}
      </dialog>
    </QuoteContext.Provider>
  );
}

/** Botão que abre o wizard (pode ser usado dentro de server components). */
export function QuoteButton({
  service,
  profile,
  className = "btn btn-wa",
  children,
  ...rest
}: OpenOptions & { className?: string; children: React.ReactNode } & Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "onClick"
  >) {
  const { openQuote } = useQuote();
  return (
    <button
      type="button"
      className={className}
      onClick={() => openQuote({ service, profile })}
      aria-haspopup="dialog"
      {...rest}
    >
      {children}
    </button>
  );
}
