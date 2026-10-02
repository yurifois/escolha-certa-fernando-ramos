import { Plus } from "lucide-react";

export type FaqItem = { q: string; a: string };

export const HOME_FAQ: FaqItem[] = [
  { q: "Quanto custa pedir uma cotação?", a: "Nada. Você só paga se decidir contratar o seguro." },
  {
    q: "Pago mais caro por usar um corretor?",
    a: "Não. A corretora é remunerada pela seguradora, e o preço da apólice é o mesmo que você teria contratando direto. A diferença é que você compara várias opções e tem alguém do seu lado depois.",
  },
  {
    q: "Em quanto tempo recebo a cotação?",
    a: "Respondo durante o horário de atendimento, em geral no mesmo dia útil. Casos que dependem de análise da seguradora podem levar um pouco mais.",
  },
  {
    q: "E se eu precisar acionar o seguro?",
    a: "Me chame no WhatsApp. Oriento o passo a passo, abro o aviso de sinistro com você e acompanho o processo com a seguradora.",
  },
  {
    q: "Atende fora de Brasília?",
    a: "Sim. O atendimento é online, pelo WhatsApp. Para plano de saúde e odontológico, a disponibilidade depende da região de cada operadora.",
  },
  {
    q: "Já tenho seguro. Vale a pena comparar?",
    a: "Vale, principalmente antes da renovação. Analiso sua apólice atual e mostro o que dá para melhorar, sem compromisso.",
  },
];

export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="faq grid">
      {items.map((f, i) => (
        <details key={f.q} className="reveal group border-t border-line last:border-b" style={{ ["--i" as string]: i }} name="faq">
          <summary className="flex min-h-16 items-center justify-between gap-6 py-6 text-left text-[1.08rem] font-semibold text-ink transition-colors hover:text-brand">
            {f.q}
            <span className="faq__icon grid size-9 shrink-0 place-items-center rounded-full bg-surface-2 text-ink group-open:bg-brand group-open:text-white">
              <Plus className="size-4" aria-hidden />
            </span>
          </summary>
          <p className="max-w-[62ch] pb-7 pr-12 text-ink-2">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
