"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ShieldCheck } from "lucide-react";
import { isOpenNow } from "@/lib/quote";
import { SITE, waLink, withBase } from "@/lib/site";
import { ACTIVE_PARTNERS } from "@/lib/partners";
import { Arcs, WhatsAppIcon } from "../Brand";
import { useQuote } from "../quote/QuoteProvider";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const { openQuote } = useQuote();
  const [status, setStatus] = useState<{ open: boolean; label: string } | null>(null);

  useEffect(() => {
    setStatus(isOpenNow());
    const id = setInterval(() => setStatus(isOpenNow()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Luz que segue o mouse (lerp) + parallax mínimo do badge/foto
  useEffect(() => {
    const el = ref.current;
    if (!el || !matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let tx = el.clientWidth * 0.7,
      ty = el.clientHeight * 0.4,
      cx = tx,
      cy = ty,
      raf = 0,
      running = true;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
    };
    const loop = () => {
      if (!running) return;
      cx += (tx - cx) * 0.07;
      cy += (ty - cy) * 0.07;
      el.style.setProperty("--lx", `${cx.toFixed(1)}px`);
      el.style.setProperty("--ly", `${cy.toFixed(1)}px`);
      if (photoRef.current) {
        const dx = (cx / el.clientWidth - 0.5) * -10;
        const dy = (cy / el.clientHeight - 0.5) * -8;
        photoRef.current.style.setProperty("--px", `${dx.toFixed(2)}px`);
        photoRef.current.style.setProperty("--py", `${dy.toFixed(2)}px`);
      }
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting;
      if (running) raf = requestAnimationFrame(loop);
      else cancelAnimationFrame(raf);
    });
    io.observe(el);
    el.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="grain relative isolate overflow-hidden pt-[calc(var(--header-h)+28px)] lg:min-h-[min(100svh,980px)] lg:pt-[calc(var(--header-h)+48px)]"
      style={{
        backgroundImage:
          "radial-gradient(560px circle at var(--lx, 72%) var(--ly, 38%), rgb(63 64 149 / 0.10), transparent 65%), radial-gradient(900px 600px at 100% 0%, var(--color-paper-lav), transparent 70%)",
      }}
    >
      <div className="relative z-10 mx-auto grid max-w-[1320px] items-end gap-y-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-x-10 lg:px-10">
        {/* Texto */}
        <div className="pb-6 lg:col-span-7 lg:pb-28">
          <div className="rise flex flex-wrap items-center gap-3" style={{ ["--i" as string]: 0 }}>
            <span className="t-eyebrow text-ink-2">Corretora de seguros<span className="hidden sm:inline"> · Brasília</span> desde {SITE.founded}</span>
            <span
              className={`inline-flex min-h-7 items-center gap-2 rounded-full px-3 text-xs font-semibold transition-opacity ${
                status ? "opacity-100" : "opacity-0"
              } ${status?.open ? "bg-[#e3f7ea] text-[#0e6b34]" : "bg-surface-2 text-ink-2"}`}
              aria-live="polite"
            >
              <span className={`pulse-dot size-2 rounded-full ${status?.open ? "bg-[#16a34a] text-[#16a34a]" : "bg-muted text-muted"}`} />
              {status?.label ?? "Atendimento"}
            </span>
          </div>

          <h1 id="hero-title" className="t-display-xl mt-6">
            <span className="rise-clip block pb-[0.06em]" style={{ ["--i" as string]: 1 }}>
              Seguro bom é o que
            </span>
            <span className="rise-clip block pb-[0.06em]" style={{ ["--i" as string]: 2 }}>
              funciona no
            </span>
            <span className="rise-clip block pb-[0.08em]" style={{ ["--i" as string]: 3 }}>
              <span className="t-accent">dia ruim.</span>
            </span>
          </h1>

          <p className="rise mt-5 max-w-[46ch] text-base leading-[1.6] text-ink-2 sm:mt-7 sm:text-[length:var(--fs-lead)] sm:leading-[1.55]" style={{ ["--i" as string]: 3 }}>
            <span className="sm:hidden">
              Sou o Fernando, corretor em Brasília. Comparo preço e coberturas e acompanho você quando precisar acionar.
            </span>
            <span className="hidden sm:inline">
              Sou o Fernando, corretor aqui em Brasília. Comparo as seguradoras, explico o que cada apólice cobre de
              verdade e continuo do seu lado quando você precisar acionar.
            </span>
          </p>

          <div className="rise mt-6 flex flex-wrap items-center gap-3 sm:mt-9" style={{ ["--i" as string]: 4 }}>
            <button type="button" onClick={() => openQuote()} aria-haspopup="dialog" className="btn btn-wa px-6 text-base">
              <WhatsAppIcon className="size-5" />
              Cotar pelo WhatsApp
            </button>
            <a href="#seguros" className="inline-flex min-h-11 items-center gap-2 px-1 font-semibold text-ink-2 hover:text-brand sm:hidden">
              Ver os seguros <ArrowDown className="size-4" aria-hidden />
            </a>
            <a href="#seguros" className="btn btn-ghost hidden px-6 text-base sm:inline-flex">
              Ver os seguros <ArrowDown className="size-4" aria-hidden />
            </a>
          </div>

          <TrustList className="rise mt-10 hidden lg:flex" />
        </div>

        {/* Retrato em arco */}
        <div className="relative mx-auto mt-20 w-full max-w-[420px] sm:mt-32 lg:col-span-5 lg:mr-[-40px] lg:mt-0 lg:max-w-none">
          <div
            ref={photoRef}
            className="relative"
            style={{ transform: "translate3d(var(--px,0),var(--py,0),0)", transition: "transform 120ms linear" }}
          >
            <Arcs draw className="absolute -left-[18%] -top-[33%] z-0 w-[136%]" strokeScale={1.1} />
            <div className="arch rise relative z-10 aspect-[738/1000] bg-[#b3a7b1] shadow-[var(--shadow-3)]" style={{ ["--i" as string]: 2 }}>
              <picture>
                <source srcSet={withBase("/images/fernando/banco-a.webp")} type="image/webp" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={withBase("/images/fernando/banco-a.jpg")}
                  alt="Fernando Queiroz Ramos, corretor de seguros da Escolha Certa, sorrindo, de terno grafite e camisa lilás"
                  width={738}
                  height={1108}
                  fetchPriority="high"
                  className="h-full w-full object-cover object-[50%_20%]"
                />
              </picture>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[rgb(21_22_58/0.35)] to-transparent" />
            </div>

            <div
              className="rise absolute -left-1 bottom-10 z-20 flex items-center gap-4 rounded-2xl bg-surface/95 py-3.5 pl-4 pr-5 shadow-[var(--shadow-2)] backdrop-blur edge-light sm:-left-10"
              style={{ ["--i" as string]: 5 }}
            >
              <span className="font-[family-name:var(--font-display)] text-4xl leading-none text-brand t-num">
                {SITE.founded}
              </span>
              <span className="text-sm leading-snug text-ink-2">
                Corretor em Brasília
                <br />
                <strong className="font-semibold text-ink">{SITE.broker}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[420px] px-4 pt-8 lg:hidden">
        <TrustList className="flex-col" />
      </div>
      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10 mx-auto mt-6 block w-fit pb-8 text-center text-sm text-muted underline-offset-4 hover:text-brand hover:underline lg:hidden"
      >
        ou fale direto: {SITE.phone.display}
      </a>
    </section>
  );
}

function TrustList({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-2 ${className}`} style={{ ["--i" as string]: 5 }}>
      {["Cotação sem custo", `${ACTIVE_PARTNERS.length} seguradoras e operadoras`, "Atendimento pessoal, do início ao sinistro"].map((t) => (
        <li key={t} className="flex items-center gap-2">
          <ShieldCheck className="size-4 shrink-0 text-brand" aria-hidden /> {t}
        </li>
      ))}
    </ul>
  );
}
