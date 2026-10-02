"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { PROFILES, PROFILE_FOCUS, SERVICE_BY_SLUG, type ProfileId, type Service } from "@/lib/services";
import ServiceIcon from "../ServiceIcon";
import { useQuote } from "../quote/QuoteProvider";
import { withBase } from "@/lib/site";

const KEY = "ec-perfil";

const SIZE = [
  "sm:col-span-2 lg:col-span-7 lg:row-span-2",
  "lg:col-span-5 lg:row-span-2",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-3",
];

export default function Showcase() {
  const [profile, setProfile] = useState<ProfileId>("tudo");
  const reduce = useReducedMotion();
  const groupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const p = sessionStorage.getItem(KEY) as ProfileId | null;
      if (p && PROFILES.some((x) => x.id === p)) setProfile(p);
    } catch {}
  }, []);

  const choose = (p: ProfileId) => {
    setProfile(p);
    try {
      sessionStorage.setItem(KEY, p);
    } catch {}
  };

  const current = PROFILES.find((p) => p.id === profile)!;
  const ordered = current.order.map((s) => SERVICE_BY_SLUG[s]);

  const onKey = (e: React.KeyboardEvent) => {
    const i = PROFILES.findIndex((p) => p.id === profile);
    let n = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % PROFILES.length;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + PROFILES.length) % PROFILES.length;
    if (n < 0) return;
    e.preventDefault();
    choose(PROFILES[n].id);
    groupRef.current?.querySelectorAll<HTMLButtonElement>("[role=radio]")[n]?.focus();
  };

  return (
    <section id="seguros" aria-labelledby="seguros-title" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-10">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="reveal t-eyebrow text-brand">Seguros e planos</p>
            <h2 id="seguros-title" className="reveal t-display-lg mt-4 max-w-[14ch] text-balance" style={{ ["--i" as string]: 1 }}>
              O que você quer <span className="t-accent">proteger?</span>
            </h2>
          </div>
          <div className="reveal lg:col-span-6 lg:justify-self-end" style={{ ["--i" as string]: 2 }}>
            <p className="max-w-[44ch] text-ink-2 lg:text-right">
              Escolha por onde começar. Cotação sem custo, resposta direta.
            </p>
            <div
              ref={groupRef}
              role="radiogroup"
              aria-label="Filtrar seguros por perfil"
              onKeyDown={onKey}
              className="no-scrollbar mt-5 flex w-full justify-between gap-0.5 overflow-x-auto rounded-full bg-surface p-1 edge-light sm:justify-start sm:gap-1 sm:p-1.5 lg:w-fit"
            >
              <LayoutGroup id="perfil">
                {PROFILES.map((p) => {
                  const active = p.id === profile;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      aria-label={p.label}
                      tabIndex={active ? 0 : -1}
                      onClick={() => choose(p.id)}
                      className={`relative min-h-11 shrink-0 rounded-full px-3 text-[0.8125rem] font-semibold transition-colors min-[400px]:px-4 sm:px-5 sm:text-sm ${
                        active ? "text-white" : "text-ink-2 hover:text-brand"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="perfil-pill"
                          className="absolute inset-0 rounded-full bg-brand"
                          transition={{ type: "spring", stiffness: 420, damping: 36 }}
                        />
                      )}
                      <span className="relative min-[400px]:hidden">{p.short}</span>
                      <span className="relative hidden min-[400px]:inline">{p.label}</span>
                    </button>
                  );
                })}
              </LayoutGroup>
            </div>
            <div className="mt-3 min-h-6 lg:text-right" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={profile}
                  initial={{ opacity: 0, y: reduce ? 0 : 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduce ? 0 : -6 }}
                  transition={{ duration: 0.25 }}
                  className="text-sm text-muted"
                >
                  {current.hint}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <motion.ul layout={!reduce} className="mt-12 grid auto-rows-[minmax(220px,auto)] gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:gap-4">
          {ordered.map((s, i) => (
            <Card
              key={s.slug}
              service={s}
              index={i}
              dim={profile !== "tudo" && i >= PROFILE_FOCUS}
              profile={profile}
              reduce={!!reduce}
            />
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

function Card({
  service: s,
  index,
  dim,
  profile,
  reduce,
}: {
  service: Service;
  index: number;
  dim: boolean;
  profile: ProfileId;
  reduce: boolean;
}) {
  const { openQuote } = useQuote();
  const big = index < 2;
  const dark = index === 0;
  return (
    <motion.li
      layout={!reduce}
      transition={{ type: "spring", stiffness: 260, damping: 32, mass: 0.9 }}
      data-glow
      className={`group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] transition-[opacity,filter,box-shadow] duration-300 ${SIZE[index]} ${
        dark ? "on-dark bg-brand-950 text-white" : index === 1 ? "bg-paper-lav/60 edge-light" : "bg-surface edge-light"
      } ${dim ? "opacity-55 grayscale hover:opacity-100 hover:grayscale-0 focus-within:opacity-100 focus-within:grayscale-0" : ""} hover:shadow-[var(--shadow-2)]`}
    >
      {big && (
        <ServiceIcon
          icon={s.icon}
          className={`pointer-events-none absolute -bottom-10 -right-8 size-64 ${dark ? "text-white/[0.06]" : "text-brand/[0.07]"}`}
          strokeWidth={1}
        />
      )}
      <div className={`relative z-10 flex h-full flex-col ${big ? "p-7 sm:p-9" : "p-6"}`}>
        <div className="flex items-start justify-between gap-4">
          <span
            className={`grid shrink-0 place-items-center rounded-2xl ${big ? "size-14" : "size-12"} ${
              dark ? "bg-white/10 text-brand-400" : "bg-brand-50 text-brand"
            }`}
          >
            <ServiceIcon icon={s.icon} className={big ? "size-7" : "size-6"} />
          </span>
          <span className={`t-num text-xs font-semibold ${dark ? "text-white/40" : "text-muted"}`}>
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <h3 className={`mt-6 font-[family-name:var(--font-display)] tracking-tight ${big ? "text-[clamp(1.75rem,1.3rem+1.5vw,2.6rem)] leading-[1.05]" : "text-[1.45rem] leading-tight"}`}>
          {s.title}
        </h3>
        <p className={`mt-2 max-w-[38ch] ${dark ? "text-white/75" : "text-ink-2"} ${big ? "t-lead" : ""}`}>{s.tagline}</p>

        {big && (
          <ul className={`mt-6 grid gap-2 text-sm ${dark ? "text-white/80" : "text-ink-2"}`}>
            {s.covered.slice(0, 3).map((c) => (
              <li key={c} className="flex items-start gap-2">
                <Check className={`mt-0.5 size-4 shrink-0 ${dark ? "text-brand-400" : "text-brand"}`} aria-hidden /> {c}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-7">
          <button
            type="button"
            onClick={() => openQuote({ service: s.slug, profile })}
            aria-haspopup="dialog"
            aria-label={`Cotar ${s.title}`}
            className={`inline-flex items-center gap-2 rounded-full text-sm font-semibold transition-colors ${
              big ? "min-h-11 px-5" : "min-h-10 px-4"
            } ${dark ? "bg-white text-brand-950 hover:bg-brand-100" : "bg-brand text-white hover:bg-brand-700"}`}
          >
            {big ? `Cotar ${s.short}` : "Cotar"}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </button>
          <a
            href={withBase(`/servicos/${s.slug}/`)}
            className={`inline-flex min-h-11 items-center gap-1.5 text-sm font-medium transition-colors ${
              dark ? "text-white/80 hover:text-white" : "text-ink-2 hover:text-brand"
            }`}
          >
            Ver coberturas <span aria-hidden>→</span>
            <span className="sr-only"> de {s.title}</span>
          </a>
        </div>
      </div>
    </motion.li>
  );
}
