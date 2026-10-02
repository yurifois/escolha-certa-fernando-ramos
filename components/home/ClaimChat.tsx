"use client";

import { useEffect, useRef } from "react";
import { CheckCheck, FileText, LifeBuoy, Route } from "lucide-react";
import { withBase } from "@/lib/site";

type Msg = { from: "cliente" | "fernando"; text: string; time: string };

// Exemplo ilustrativo. Validar o texto com o Fernando antes de publicar.
const CHAT: Msg[] = [
  { from: "cliente", text: "Fernando, bati o carro agora há pouco. Ninguém se machucou, mas não sei o que fazer primeiro.", time: "18:42" },
  { from: "fernando", text: "Que bom que está todo mundo bem. Primeiro: fotos dos dois carros, da placa do outro veículo e do local.", time: "18:43" },
  { from: "fernando", text: "Me manda também sua CNH e o documento do carro. Eu abro o aviso de sinistro com a seguradora.", time: "18:43" },
  { from: "cliente", text: "Mandei tudo. E o guincho?", time: "18:47" },
  { from: "fernando", text: "Já acionei a assistência 24h, chega em uns 40 minutos. Te aviso cada passo por aqui.", time: "18:48" },
];

const POINTS = [
  { icon: LifeBuoy, title: "Orientação na hora", text: "O que fazer primeiro, que fotos tirar, quais documentos separar." },
  { icon: FileText, title: "Aviso de sinistro com você", text: "Abro o processo junto com a seguradora, sem você ficar perdido em formulários." },
  { icon: Route, title: "Acompanhamento até o fim", text: "Do guincho ao conserto ou à indenização, você sabe em que pé está." },
];

export default function ClaimChat() {
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const bubbles = Array.from(list.querySelectorAll<HTMLElement>(".bubble"));
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        bubbles.forEach((b, i) => setTimeout(() => b.classList.add("is-in"), 250 + i * 650));
      },
      { threshold: 0.35 },
    );
    io.observe(list);
    return () => io.disconnect();
  }, []);

  return (
    <section aria-labelledby="sinistro-title" className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto grid max-w-[1320px] items-center gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-10">
        <div className="lg:col-span-5">
          <p className="reveal t-eyebrow text-brand">Na hora do aperto</p>
          <h2 id="sinistro-title" className="reveal t-display-lg mt-5 max-w-[14ch] text-balance" style={{ ["--i" as string]: 1 }}>
            Você não fica <span className="t-accent">sozinho.</span>
          </h2>
          <p className="reveal t-lead mt-6 max-w-[44ch] text-ink-2" style={{ ["--i" as string]: 2 }}>
            É no sinistro que se descobre se o seguro foi bem escolhido, e se o corretor está presente.
          </p>
          <ul className="mt-10 grid gap-6" data-stagger>
            {POINTS.map((p) => {
              const Icon = p.icon;
              return (
                <li key={p.title} className="reveal flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand">
                    <Icon className="size-5" strokeWidth={1.7} aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink">{p.title}</h3>
                    <p className="mt-1 text-ink-2">{p.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="reveal lg:col-span-6 lg:col-start-7" style={{ ["--i" as string]: 2 }}>
          <figure className="relative mx-auto max-w-[480px]">
            <div className="absolute -inset-6 -z-10 rounded-[40px] bg-[radial-gradient(closest-side,rgb(63_64_149/0.16),transparent)]" aria-hidden />
            <div className="overflow-hidden rounded-[30px] bg-surface shadow-[var(--shadow-3)] edge-light">
              <div className="flex items-center gap-3 bg-[#0b141a] px-5 py-4 text-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={withBase("/images/fernando/banco-b.webp")}
                  alt=""
                  width={40}
                  height={40}
                  loading="lazy"
                  className="size-10 rounded-full object-cover object-[55%_18%]"
                />
                <div className="leading-tight">
                  <p className="font-semibold">Fernando · Escolha Certa</p>
                  <p className="text-xs text-white/60">online</p>
                </div>
              </div>
              <ol
                ref={listRef}
                className="grid gap-2 bg-[#efe7de] bg-[radial-gradient(rgb(0_0_0/0.035)_1px,transparent_1px)] bg-[length:14px_14px] px-4 py-6 sm:px-5"
                aria-label="Exemplo de conversa durante um sinistro"
              >
                {CHAT.map((m, i) => (
                  <li
                    key={i}
                    className={`bubble max-w-[84%] rounded-2xl px-3.5 py-2 text-[0.92rem] leading-snug text-[#111b21] shadow-[0_1px_0.5px_rgb(0_0_0/0.13)] ${
                      m.from === "cliente" ? "ml-auto rounded-tr-md bg-[#d9fdd3]" : "rounded-tl-md bg-white"
                    }`}
                  >
                    <span className="sr-only">{m.from === "cliente" ? "Cliente: " : "Fernando: "}</span>
                    {m.text}
                    <span className="ml-2 inline-flex translate-y-1 items-center gap-1 text-[11px] text-[#667781]" aria-hidden>
                      {m.time}
                      {m.from === "cliente" && <CheckCheck className="size-3.5 text-[#53bdeb]" />}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <figcaption className="mt-4 text-center text-xs text-muted">Exemplo ilustrativo de atendimento.</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
