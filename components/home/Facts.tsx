"use client";

import { useEffect, useRef } from "react";
import { SITE } from "@/lib/site";
import { ACTIVE_PARTNERS } from "@/lib/partners";
import { SERVICES } from "@/lib/services";

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function CountUp({ to, from = 0 }: { to: number; from?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.textContent = String(from);
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const dur = 1500;
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / dur);
          el.textContent = String(Math.round(from + (to - from) * easeOut(p)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, from]);
  return (
    <span ref={ref} className="t-num">
      {to}
    </span>
  );
}

export default function Facts() {
  const items = [
    { value: <CountUp from={2010} to={SITE.founded} />, label: "ano em que a Escolha Certa começou" },
    { value: <CountUp to={ACTIVE_PARTNERS.length} />, label: "seguradoras e operadoras comparadas" },
    { value: <CountUp to={SERVICES.length} />, label: "linhas de seguro e planos" },
    { value: <span>Seg–Sáb</span>, label: "atendimento pessoal pelo WhatsApp" },
  ];
  return (
    <section aria-label="Fatos, sem enfeite" className="relative z-10 border-y border-line bg-surface/70 backdrop-blur">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-10">
        <dl className="grid grid-cols-2 lg:grid-cols-[1.1fr_1fr_1fr_1.1fr]" data-stagger>
          {items.map((it, i) => (
            <div
              key={i}
              className={`reveal flex flex-col gap-1 py-7 pr-4 sm:py-9 ${i % 2 === 1 ? "pl-4 sm:pl-8" : ""} ${
                i > 0 ? "lg:border-l lg:border-line lg:pl-8" : ""
              } ${i % 2 === 1 ? "border-l border-line lg:border-l" : ""} ${i < 2 ? "border-b border-line lg:border-b-0" : ""}`}
            >
              <dt className="order-2 max-w-[22ch] text-sm leading-snug text-ink-2">{it.label}</dt>
              <dd className="order-1 font-[family-name:var(--font-display)] text-[clamp(2rem,1.4rem+2vw,3.1rem)] leading-none tracking-tight text-ink">
                {it.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
