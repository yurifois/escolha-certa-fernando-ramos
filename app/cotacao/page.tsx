import type { Metadata } from "next";
import { Suspense } from "react";
import { SITE, waLink } from "@/lib/site";
import { Arcs, WhatsAppIcon } from "@/components/Brand";
import CotacaoClient from "./CotacaoClient";

export const metadata: Metadata = {
  title: "Cotação de seguro pelo WhatsApp",
  description:
    "Responda algumas perguntas rápidas e receba sua cotação de seguro pelo WhatsApp. Sem custo e sem compromisso.",
  alternates: { canonical: "/cotacao/" },
};

export default function CotacaoPage() {
  return (
    <section
      className="grain relative isolate min-h-[100svh] overflow-hidden pb-24 pt-[calc(var(--header-h)+32px)] lg:pt-[calc(var(--header-h)+56px)]"
      style={{ backgroundImage: "radial-gradient(900px 600px at 100% 0%, var(--color-paper-lav), transparent 70%)" }}
    >
      <Arcs draw className="pointer-events-none absolute -bottom-24 -left-56 hidden w-[720px] opacity-20 lg:block" />
      <div className="relative z-10 mx-auto grid max-w-[1320px] gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-4 lg:pt-6">
          <p className="t-eyebrow text-brand">Cotação online</p>
          <h1 className="t-display-lg mt-4 max-w-[12ch]">
            Um minuto aqui, <span className="t-accent">a conversa no WhatsApp.</span>
          </h1>
          <p className="mt-6 max-w-[40ch] text-ink-2">
            Suas respostas viram uma mensagem pronta para o {SITE.brokerShort}. Nada fica salvo neste site.
          </p>
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 font-semibold text-[#0e6b34] hover:underline"
          >
            <WhatsAppIcon className="size-5" /> Prefere falar direto? {SITE.phone.display}
          </a>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <Suspense
            fallback={<div className="h-[560px] rounded-[28px] bg-surface edge-light" aria-label="Carregando formulário" />}
          >
            <CotacaoClient />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
