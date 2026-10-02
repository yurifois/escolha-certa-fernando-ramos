"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { MessageCircle, Scale, Handshake } from "lucide-react";
import { useQuote } from "../quote/QuoteProvider";

const STEPS = [
  {
    n: "01",
    icon: MessageCircle,
    title: "Você conta",
    text: "Responde quatro ou cinco perguntas rápidas sobre o que quer proteger. Leva cerca de um minuto, e a conversa continua no seu WhatsApp.",
  },
  {
    n: "02",
    icon: Scale,
    title: "Eu comparo",
    text: "Coloco lado a lado preço, coberturas e franquias das seguradoras que fazem sentido para o seu caso, e explico as diferenças que o preço esconde.",
  },
  {
    n: "03",
    icon: Handshake,
    title: "Você decide",
    text: "Escolhe com clareza, sem pressão. Depois, sigo ao seu lado: renovação, dúvidas do dia a dia e, se precisar, o sinistro.",
  },
];

// Arco de 180° (pathLength normalizado) e os pontos dos 3 nós sobre ele
const ARC = "M 30 230 A 200 200 0 0 1 430 230";
const NODES = [0.17, 0.5, 0.83].map((t) => {
  const a = Math.PI * (1 - t);
  return { x: 230 + 200 * Math.cos(a), y: 230 - 200 * Math.sin(a) };
});

export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { openQuote } = useQuote();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.65", "end 0.75"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const length = useTransform(reduce ? scrollYProgress : smooth, [0, 1], [0.02, 1]);
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(v < 0.3 ? 0 : v < 0.62 ? 1 : 2);
  });

  return (
    <section
      id="como-funciona"
      ref={ref}
      aria-labelledby="como-title"
      className="relative bg-surface py-24 sm:py-32"
    >
      <div className="mx-auto grid max-w-[1320px] gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+48px)]">
            <p className="reveal t-eyebrow text-brand">Como funciona</p>
            <h2 id="como-title" className="reveal t-display-lg mt-4 max-w-[12ch]" style={{ ["--i" as string]: 1 }}>
              Três passos. <span className="t-accent">Uma conversa.</span>
            </h2>

            <svg viewBox="0 0 460 250" className="mt-10 hidden w-full max-w-[440px] lg:block" aria-hidden>
              <path d={ARC} fill="none" stroke="var(--color-line)" strokeWidth="8" strokeLinecap="round" />
              <motion.path
                d={ARC}
                fill="none"
                stroke="var(--color-brand)"
                strokeWidth="8"
                strokeLinecap="round"
                style={{ pathLength: length }}
              />
              <path d="M 150 22 A 230 230 0 0 1 452 246" fill="none" stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
              {NODES.map((p, i) => (
                <g key={i}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={i <= active ? 15 : 11}
                    fill={i <= active ? "var(--color-brand)" : "var(--color-surface)"}
                    stroke={i <= active ? "var(--color-brand)" : "var(--color-line)"}
                    strokeWidth="3"
                    style={{ transition: "all 400ms var(--ease-out-expo)" }}
                  />
                  <text
                    x={p.x}
                    y={p.y + 4.5}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="700"
                    fill={i <= active ? "#fff" : "var(--color-muted)"}
                    style={{ transition: "fill 300ms linear" }}
                  >
                    {i + 1}
                  </text>
                </g>
              ))}
            </svg>

            <button
              type="button"
              onClick={() => openQuote()}
              aria-haspopup="dialog"
              className="btn btn-primary mt-10 hidden lg:inline-flex"
            >
              Começar pelo passo 1
            </button>
          </div>
        </div>

        <ol className="grid gap-4 lg:col-span-7 lg:gap-6 lg:pt-4">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const on = i <= active;
            return (
              <li
                key={s.n}
                data-glow
                className={`reveal relative overflow-hidden rounded-[var(--radius-card)] p-7 transition-[background-color,box-shadow,opacity,transform] duration-500 ease-[cubic-bezier(.22,1,.36,1)] sm:p-10 lg:min-h-[300px] ${
                  on ? "bg-paper shadow-[var(--shadow-2)] edge-light" : "bg-paper/60 edge-light"
                }`}
                style={{ ["--i" as string]: i }}
              >
                <div className="relative z-10 flex items-start justify-between gap-6">
                  <span
                    className={`font-[family-name:var(--font-display)] text-[clamp(3.5rem,2.5rem+3vw,6rem)] leading-[0.85] tracking-tight transition-colors duration-500 t-num ${
                      on ? "text-sand" : "text-line"
                    }`}
                  >
                    {s.n}
                  </span>
                  <span
                    className={`grid size-12 place-items-center rounded-2xl transition-colors duration-500 ${
                      on ? "bg-brand text-white" : "bg-surface-2 text-muted"
                    }`}
                  >
                    <Icon className="size-6" strokeWidth={1.6} aria-hidden />
                  </span>
                </div>
                <h3 className="t-h3 relative z-10 mt-8">{s.title}</h3>
                <p className="relative z-10 mt-3 max-w-[50ch] text-ink-2">{s.text}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
