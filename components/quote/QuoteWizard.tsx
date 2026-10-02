"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Copy, Lock, PencilLine } from "lucide-react";
import {
  CONTACT_DEFAULTS,
  CONTACT_FIELDS,
  QUOTE_FIELDS,
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  isOpenNow,
  maskPhone,
  validateField,
  validateStep,
  type QuoteField,
  type QuoteValues,
  type ServiceSlug,
} from "@/lib/quote";
import { PROFILES, SERVICES, SERVICE_BY_SLUG, type ProfileId } from "@/lib/services";
import { SITE, withBase } from "@/lib/site";
import ServiceIcon from "@/components/ServiceIcon";
import { WhatsAppIcon } from "@/components/Brand";

const DRAFT_KEY = "ec-cotacao-rascunho";
const STEP_LABELS = ["Seguro", "Detalhes", "Contato", "Revisão"] as const;
const STEP1_TITLE: Record<ServiceSlug, string> = {
  automovel: "Conte sobre o carro",
  residencial: "Conte sobre o imóvel",
  empresarial: "Conte sobre a empresa",
  vida: "Conte um pouco sobre você",
  viagem: "Conte sobre a viagem",
  condominial: "Conte sobre o condomínio",
  fianca: "Conte sobre a locação",
  saude: "Quem vai usar o plano?",
  odonto: "Quem vai usar o plano?",
};

type Draft = { service: ServiceSlug | null; values: QuoteValues };

function readDraft(): Draft | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Draft) : null;
  } catch {
    return null;
  }
}
function writeDraft(d: Draft | null) {
  try {
    if (d) sessionStorage.setItem(DRAFT_KEY, JSON.stringify(d));
    else sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    /* modo privado: segue sem rascunho */
  }
}

export default function QuoteWizard({
  initialService,
  profile,
  variant,
  onDone,
}: {
  initialService?: ServiceSlug;
  profile?: ProfileId;
  variant: "dialog" | "page";
  onDone?: () => void;
}) {
  const reduce = useReducedMotion();
  const uid = useId();
  const [service, setService] = useState<ServiceSlug | null>(initialService ?? null);
  const [step, setStep] = useState(initialService ? 1 : 0);
  const [dir, setDir] = useState(1);
  const [values, setValues] = useState<QuoteValues>({ ...CONTACT_DEFAULTS });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [announce, setAnnounce] = useState("");
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<{ open: boolean; label: string } | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  // Rascunho: restaura uma vez
  useEffect(() => {
    const d = readDraft();
    if (d) {
      const keepServiceFields = !initialService || initialService === d.service;
      const restored: QuoteValues = { ...CONTACT_DEFAULTS };
      for (const f of CONTACT_FIELDS) if (d.values[f.id] !== undefined) restored[f.id] = d.values[f.id];
      if (keepServiceFields && d.service) {
        for (const f of QUOTE_FIELDS[d.service]) if (d.values[f.id] !== undefined) restored[f.id] = d.values[f.id];
      }
      setValues(restored);
      if (!initialService && d.service) {
        setService(d.service);
        setStep(1);
      }
    }
    setStatus(isOpenNow());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (step < 4) writeDraft({ service, values });
  }, [service, values, step]);

  // Foco no título a cada etapa (leitores de tela) — sem roubar o foco na primeira pintura
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
    bodyRef.current?.scrollTo({ top: 0 });
  }, [step]);

  const svc = service ? SERVICE_BY_SLUG[service] : null;
  const serviceFields = service ? QUOTE_FIELDS[service] : [];
  const fieldsForStep: QuoteField[] = step === 1 ? serviceFields : step === 2 ? CONTACT_FIELDS : [];
  const profileLabel = profile && profile !== "tudo" ? PROFILES.find((p) => p.id === profile)?.label : undefined;

  const orderedServices = useMemo(() => {
    const order = PROFILES.find((p) => p.id === (profile ?? "tudo"))!.order;
    return order.map((slug) => SERVICE_BY_SLUG[slug]);
  }, [profile]);

  const message = useMemo(() => {
    if (!svc || step < 3) return "";
    try {
      return buildWhatsAppMessage({
        serviceLabel: svc.short,
        serviceFields,
        contactFields: CONTACT_FIELDS,
        values,
        profile: profileLabel,
      });
    } catch (e) {
      return e instanceof Error ? e.message : "";
    }
  }, [svc, serviceFields, values, profileLabel, step]);

  const waUrl = message ? buildWhatsAppUrl(message, SITE.phone.e164) : "";

  const go = useCallback((next: number) => {
    setDir(next > step ? 1 : -1);
    setErrors({});
    setAnnounce("");
    setStep(next);
  }, [step]);

  const chooseService = (slug: ServiceSlug) => {
    if (slug !== service) {
      // troca de seguro: limpa só os campos específicos do anterior
      setValues((v) => {
        const next: QuoteValues = {};
        for (const f of CONTACT_FIELDS) next[f.id] = v[f.id] ?? CONTACT_DEFAULTS[f.id] ?? "";
        return next;
      });
    }
    setService(slug);
    setDir(1);
    setErrors({});
    setStep(1);
  };

  const setValue = (field: QuoteField, raw: string | string[]) => {
    const value = field.id === "whatsapp" && typeof raw === "string" ? maskPhone(raw) : raw;
    setValues((v) => {
      const next = { ...v, [field.id]: value };
      if (errors[field.id]) {
        const err = validateField(field, value, next);
        setErrors((e) => {
          const copy = { ...e };
          if (err) copy[field.id] = err;
          else delete copy[field.id];
          return copy;
        });
      }
      return next;
    });
  };

  const blurValidate = (field: QuoteField) => {
    let v = values[field.id];
    if (typeof v === "string" && field.transform && field.id !== "whatsapp" && v.trim()) {
      v = field.transform(v);
      setValues((prev) => ({ ...prev, [field.id]: v as string }));
    }
    const err = validateField(field, v, { ...values, [field.id]: v ?? "" });
    setErrors((e) => {
      const copy = { ...e };
      if (err) copy[field.id] = err;
      else delete copy[field.id];
      return copy;
    });
  };

  const next = () => {
    const errs = validateStep(fieldsForStep, values);
    if (Object.keys(errs).length) {
      setErrors(errs);
      const first = fieldsForStep.find((f) => errs[f.id]);
      const n = Object.keys(errs).length;
      setAnnounce(`${n === 1 ? "Um campo precisa" : `${n} campos precisam`} de atenção. ${first?.label}: ${errs[first!.id]}`);
      requestAnimationFrame(() => {
        const el = document.querySelector<HTMLElement>(`[data-field="${uid}-${first?.id}"]`);
        el?.focus();
        el?.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
      });
      return;
    }
    go(step + 1);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      /* sem permissão de área de transferência */
    }
  };

  const progress = step >= 4 ? 1 : (step + 1) / 4;
  const variants = {
    enter: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * 28 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * -20 }),
  };

  const titles: Record<number, { eyebrow: string; title: string; sub?: string }> = {
    0: {
      eyebrow: "Cotação sem custo",
      title: "O que você quer proteger?",
      sub: "Escolha um seguro. Leva cerca de um minuto.",
    },
    1: {
      eyebrow: svc ? svc.title : "",
      title: svc ? STEP1_TITLE[svc.slug] : "",
      sub: "Só o essencial para eu comparar as seguradoras. O resto a gente vê na conversa.",
    },
    2: { eyebrow: "Contato", title: "Para quem eu respondo?", sub: "Seu WhatsApp é por onde a conversa vai continuar." },
    3: {
      eyebrow: "Revisão",
      title: "Confira a mensagem",
      sub: "Confira seus dados. A mensagem só será enviada quando você confirmar no WhatsApp.",
    },
    4: { eyebrow: "Pronto", title: "Conversa aberta no WhatsApp", sub: "É só tocar em enviar por lá. Eu respondo em horário de atendimento." },
  };
  const t = titles[step];

  return (
    <div className={`flex min-h-0 flex-1 flex-col ${variant === "page" ? "rounded-[28px] bg-paper shadow-[var(--shadow-3)] edge-light" : ""}`}>
      {/* Cabeçalho com o arco de progresso */}
      <div className="relative shrink-0 px-5 pt-6 sm:px-9 sm:pt-8">
        <div className="flex items-center gap-4">
          <ProgressArc progress={progress} />
          <ol className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-muted" aria-label="Etapas">
            {STEP_LABELS.map((label, i) => (
              <li
                key={label}
                aria-current={i === Math.min(step, 3) ? "step" : undefined}
                className={`flex items-center gap-1.5 ${i <= step ? "text-brand" : ""} ${i === Math.min(step, 3) ? "font-semibold" : ""}`}
              >
                <span
                  className={`grid size-5 place-items-center rounded-full text-[10px] t-num ${
                    i < step ? "bg-brand text-white" : i === step ? "bg-brand-100 text-brand" : "bg-surface-2 text-muted"
                  }`}
                >
                  {i < step ? <Check className="size-3" aria-hidden /> : i + 1}
                </span>
                {label}
              </li>
            ))}
          </ol>
        </div>
        <p className="t-eyebrow mt-6 text-brand">{t.eyebrow}</p>
        <h2
          id={variant === "dialog" ? "quote-title" : undefined}
          ref={headingRef}
          tabIndex={-1}
          className="t-h2 mt-2 max-w-[22ch] text-balance outline-none"
        >
          {t.title}
        </h2>
        {t.sub && <p className="mt-2 max-w-[52ch] text-ink-2">{t.sub}</p>}
      </div>

      <p className="sr-only" aria-live="polite">
        {announce}
      </p>

      {/* Corpo */}
      <div ref={bodyRef} className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 pt-6 sm:px-9">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={step}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduce ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === 0 && (
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {orderedServices.map((s) => {
                  const selected = s.slug === service;
                  return (
                    <button
                      key={s.slug}
                      type="button"
                      onClick={() => chooseService(s.slug)}
                      aria-pressed={selected}
                      data-glow
                      className={`group flex min-h-[92px] flex-col items-start justify-between gap-3 rounded-2xl p-4 text-left transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-0.5 ${
                        selected
                          ? "bg-brand text-white shadow-[var(--shadow-2)]"
                          : "bg-surface text-ink edge-light hover:shadow-[var(--shadow-2)]"
                      }`}
                    >
                      <ServiceIcon icon={s.icon} className={`relative z-10 size-6 ${selected ? "text-white" : "text-brand"}`} />
                      <span className="relative z-10 text-[0.95rem] font-semibold leading-tight">{s.short}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {(step === 1 || step === 2) && (
              <div className="grid gap-5">
                {step === 1 && svc && (
                  <button
                    type="button"
                    onClick={() => go(0)}
                    className="-mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-brand-50 py-1.5 pl-2 pr-3 text-sm font-medium text-brand hover:bg-brand-100"
                  >
                    <ServiceIcon icon={svc.icon} className="size-4" />
                    {svc.short}
                    <span className="text-muted">· trocar</span>
                  </button>
                )}
                {fieldsForStep
                  .filter((f) => !f.showIf || f.showIf(values))
                  .map((f) => (
                    <Field
                      key={f.id}
                      uid={uid}
                      field={f}
                      value={values[f.id]}
                      error={errors[f.id]}
                      onChange={(v) => setValue(f, v)}
                      onBlur={() => blurValidate(f)}
                    />
                  ))}
                {step === 2 && (
                  <p className="flex items-start gap-2 text-sm text-muted">
                    <Lock className="mt-0.5 size-4 shrink-0" aria-hidden />
                    <span>
                      Seus dados só vão para a conversa no WhatsApp. Nada fica guardado neste site.{" "}
                      <a href={withBase("/privacidade/")} className="underline underline-offset-2 hover:text-brand">
                        Política de privacidade
                      </a>
                      .
                    </span>
                  </p>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="grid gap-5">
                <div className="rounded-2xl bg-surface-2 p-3">
                  <div className="rounded-xl border border-line bg-white p-5 text-base leading-[1.6] text-ink">
                    <WhatsAppText text={message} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => go(1)} className="btn btn-ghost min-h-11 px-4 text-sm">
                    <PencilLine className="size-4" aria-hidden /> Editar respostas
                  </button>
                  <button type="button" onClick={copy} className="btn btn-ghost min-h-11 px-4 text-sm">
                    {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
                    {copied ? "Mensagem copiada" : "Copiar mensagem"}
                  </button>
                </div>
                {status && !status.open && (
                  <p className="rounded-2xl bg-brand-50 px-4 py-3 text-sm text-ink-2">
                    Estamos fora do horário agora. Sua mensagem fica registrada no WhatsApp e eu respondo{" "}
                    {status.label.replace("Fechado agora · volto ", "")}.
                  </p>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="grid gap-5">
                <div className="flex items-center gap-4 rounded-2xl bg-surface p-5 edge-light">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-wa text-ink">
                    <Check className="size-6" aria-hidden />
                  </span>
                  <p className="text-ink-2">
                    Abrimos o WhatsApp com a sua mensagem pronta.{" "}
                    <a href={waUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand underline underline-offset-2">
                      Se o WhatsApp não abriu, toque aqui.
                    </a>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={copy} className="btn btn-ghost min-h-11 px-4 text-sm">
                    {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
                    {copied ? "Mensagem copiada" : "Copiar mensagem"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setValues((v) => {
                        const keep: QuoteValues = {};
                        for (const f of CONTACT_FIELDS) keep[f.id] = f.id === "observacoes" ? "" : v[f.id];
                        return keep;
                      });
                      setService(null);
                      go(0);
                    }}
                    className="btn btn-ghost min-h-11 px-4 text-sm"
                  >
                    Cotar outro seguro
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Rodapé de ações */}
      {step > 0 && (
        <div className="shrink-0 border-t border-line bg-paper/90 px-5 py-4 backdrop-blur sm:px-9">
          <div className="flex items-center justify-between gap-3">
            {step < 4 ? (
              <button type="button" onClick={() => go(step - 1)} className="btn btn-ghost min-h-12 px-4">
                <ArrowLeft className="size-4" aria-hidden /> Voltar
              </button>
            ) : (
              <span />
            )}
            {step < 3 && (
              <button type="button" onClick={next} className="btn btn-primary min-h-12">
                Continuar <ArrowRight className="size-4" aria-hidden />
              </button>
            )}
            {step === 3 && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  writeDraft(null);
                  setTimeout(() => go(4), 150);
                }}
                className="btn btn-wa min-h-12"
              >
                <WhatsAppIcon className="size-5" /> Abrir conversa no WhatsApp
              </a>
            )}
            {step === 4 && variant === "dialog" && (
              <button type="button" onClick={onDone} className="btn btn-primary min-h-12">
                Fechar
              </button>
            )}
            {step === 4 && variant === "page" && (
              <a href={withBase("/")} className="btn btn-primary min-h-12">
                Voltar ao início
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── Campo ───────────────────────── */

const inputCls =
  "w-full min-h-12 rounded-xl bg-surface px-4 text-base text-ink shadow-[inset_0_0_0_1px_var(--color-line)] transition-shadow placeholder:text-muted/60 focus:outline-none focus:shadow-[inset_0_0_0_1.5px_var(--color-brand),0_0_0_4px_rgb(63_64_149/0.12)] aria-[invalid=true]:shadow-[inset_0_0_0_1.5px_#b42318]";

function Field({
  uid,
  field,
  value,
  error,
  onChange,
  onBlur,
}: {
  uid: string;
  field: QuoteField;
  value: string | string[] | undefined;
  error?: string;
  onChange: (v: string | string[]) => void;
  onBlur: () => void;
}) {
  const id = `${uid}-${field.id}`;
  const errId = `${id}-err`;
  const helpId = `${id}-help`;
  const describedBy = [error ? errId : "", field.helper ? helpId : ""].filter(Boolean).join(" ") || undefined;
  const label = (
    <>
      {field.label}
      {field.required ? (
        <span className="text-brand" aria-hidden>
          {" "}
          *
        </span>
      ) : (
        <span className="font-normal text-muted"> (opcional)</span>
      )}
    </>
  );
  const str = typeof value === "string" ? value : "";
  const arr = Array.isArray(value) ? value : [];

  const meta = (
    <>
      {field.helper && !error && (
        <p id={helpId} className="mt-1.5 text-sm text-muted">
          {field.helper}
        </p>
      )}
      {error && (
        <p id={errId} className="mt-1.5 text-sm font-medium text-[#b42318]">
          {error}
        </p>
      )}
    </>
  );

  if (field.type === "chips" || field.type === "multichips") {
    const multi = field.type === "multichips";
    return (
      <fieldset aria-describedby={describedBy} aria-invalid={!!error || undefined}>
        <legend className="mb-2.5 text-[0.95rem] font-semibold text-ink">{label}</legend>
        <div className="flex flex-wrap gap-2" onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && onBlur()}>
          {field.options!.map((opt, i) => {
            const checked = multi ? arr.includes(opt) : str === opt;
            return (
              <label key={opt} className="relative">
                <input
                  type={multi ? "checkbox" : "radio"}
                  name={id}
                  value={opt}
                  checked={checked}
                  data-field={i === 0 ? id : undefined}
                  onChange={() => {
                    if (!multi) return onChange(opt);
                    if (opt === "Ninguém" || opt === "Quero orientação") return onChange(checked ? [] : [opt]);
                    const base = arr.filter((x) => x !== "Ninguém" && x !== "Quero orientação");
                    onChange(checked ? base.filter((x) => x !== opt) : [...base, opt]);
                  }}
                  className="peer absolute inset-0 opacity-0"
                />
                <span className="pointer-events-none inline-flex min-h-11 items-center gap-1.5 rounded-full bg-surface px-4 text-[0.95rem] text-ink shadow-[inset_0_0_0_1px_var(--color-line)] transition-colors peer-hover:shadow-[inset_0_0_0_1px_var(--color-brand)] peer-checked:bg-brand peer-checked:text-white peer-checked:shadow-none peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand">
                  {checked && <Check className="size-4" aria-hidden />}
                  {opt}
                </span>
              </label>
            );
          })}
        </div>
        {meta}
      </fieldset>
    );
  }

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[0.95rem] font-semibold text-ink">
        {label}
      </label>
      {field.type === "select" ? (
        <div className="relative">
          <select
            id={id}
            data-field={id}
            value={str}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            aria-invalid={!!error || undefined}
            aria-describedby={describedBy}
            className={`${inputCls} appearance-none pr-10 ${str ? "" : "text-muted"}`}
          >
            <option value="">Selecione</option>
            {field.options!.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <svg className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted" viewBox="0 0 16 16" aria-hidden>
            <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
      ) : field.type === "textarea" ? (
        <>
          <textarea
            id={id}
            data-field={id}
            value={str}
            rows={3}
            maxLength={field.maxLength}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            aria-invalid={!!error || undefined}
            aria-describedby={describedBy}
            className={`${inputCls} min-h-[96px] resize-y py-3`}
          />
          {field.maxLength && (
            <p className="mt-1 text-right text-xs text-muted t-num" aria-hidden>
              {str.length}/{field.maxLength}
            </p>
          )}
        </>
      ) : (
        <input
          id={id}
          data-field={id}
          type={field.type === "date" ? "date" : field.id === "whatsapp" ? "tel" : "text"}
          inputMode={field.type === "number" ? (field.id === "aluguel" || field.id === "encargos" ? "decimal" : "numeric") : field.inputMode}
          autoComplete={field.autoComplete ?? "off"}
          value={str}
          min={field.type === "date" ? new Date().toLocaleDateString("sv-SE") : undefined}
          maxLength={field.maxLength}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={!!error || undefined}
          aria-describedby={describedBy}
          aria-required={field.required || undefined}
          className={inputCls}
        />
      )}
      {meta}
    </div>
  );
}

/* ───────────────────────── Arco de progresso ───────────────────────── */

function ProgressArc({ progress }: { progress: number }) {
  return (
    <svg viewBox="0 0 64 36" className="h-9 w-16 shrink-0" aria-hidden>
      <path d="M6 32 A26 26 0 0 1 58 32" pathLength={1} fill="none" stroke="var(--color-line)" strokeWidth="5" strokeLinecap="round" />
      <path
        d="M6 32 A26 26 0 0 1 58 32"
        pathLength={1}
        fill="none"
        stroke="var(--color-brand)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="1"
        strokeDashoffset={1 - progress}
        style={{ transition: "stroke-dashoffset 600ms var(--ease-out-expo)" }}
      />
      <path d="M14 22 A22 22 0 0 1 50 12" pathLength={1} fill="none" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round" opacity={progress >= 1 ? 1 : 0.18} style={{ transition: "opacity 400ms linear" }} />
    </svg>
  );
}

/* Renderiza *negrito* do WhatsApp */
function WhatsAppText({ text }: { text: string }) {
  return (
    <div className="whitespace-pre-wrap break-words">
      {text.split("\n").map((line, i) => (
        <span key={i}>
          {line.split(/(\*[^*]+\*)/g).map((part, j) =>
            part.startsWith("*") && part.endsWith("*") && part.length > 2 ? (
              <strong key={j}>{part.slice(1, -1)}</strong>
            ) : (
              <span key={j}>{part}</span>
            ),
          )}
          {"\n"}
        </span>
      ))}
    </div>
  );
}
