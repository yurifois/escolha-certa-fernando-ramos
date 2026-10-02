import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Minus } from "lucide-react";
import { SERVICES, SERVICE_BY_SLUG } from "@/lib/services";
import type { ServiceSlug } from "@/lib/quote";
import { SITE, waLink, withBase } from "@/lib/site";
import { QuoteButton } from "@/components/quote/QuoteProvider";
import { Arcs, WhatsAppIcon } from "@/components/Brand";
import ServiceIcon from "@/components/ServiceIcon";
import { PartnerGrid } from "@/components/Partners";
import { FaqList, faqJsonLd } from "@/components/Faq";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = SERVICE_BY_SLUG[slug as ServiceSlug];
  if (!s) return {};
  return {
    title: `${s.title} em Brasília`,
    description: `${s.tagline} ${s.promise} Cotação sem custo pelo WhatsApp com ${SITE.broker}.`,
    alternates: { canonical: `/servicos/${s.slug}/` },
    openGraph: {
      title: `${s.title} · Escolha Certa`,
      description: s.promise,
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Escolha Certa Corretora de Seguros" }],
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const s = SERVICE_BY_SLUG[slug as ServiceSlug];
  if (!s) notFound();
  const others = SERVICES.filter((x) => x.slug !== s.slug);

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    serviceType: s.title,
    description: s.intro,
    areaServed: "BR",
    provider: { "@type": "InsuranceAgency", name: SITE.legalName, telephone: `+${SITE.phone.e164}`, url: SITE.url },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(s.faq)) }} />

      {/* Hero compacto */}
      <section className="grain relative isolate overflow-hidden pb-16 pt-[calc(var(--header-h)+36px)] sm:pb-24 lg:pt-[calc(var(--header-h)+64px)]"
        style={{ backgroundImage: "radial-gradient(900px 600px at 100% 0%, var(--color-paper-lav), transparent 70%)" }}
      >
        <Arcs draw className="pointer-events-none absolute -right-40 top-16 hidden w-[760px] opacity-30 lg:block" />
        <div className="relative z-10 mx-auto grid max-w-[1320px] gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-10">
          <div className="lg:col-span-7">
            <nav aria-label="Trilha" className="rise">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
                <li>
                  <a href={withBase("/")} className="inline-flex min-h-11 items-center gap-1.5 hover:text-brand">
                    <ArrowLeft className="size-4" aria-hidden /> Início
                  </a>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <a href={withBase("/#seguros")} className="inline-flex min-h-11 items-center hover:text-brand">
                    Seguros
                  </a>
                </li>
                <li aria-hidden>/</li>
                <li aria-current="page" className="text-ink-2">
                  {s.short}
                </li>
              </ol>
            </nav>
            <div className="rise mt-10 flex items-center gap-3" style={{ ["--i" as string]: 1 }}>
              <span className="grid size-12 place-items-center rounded-2xl bg-brand text-white">
                <ServiceIcon icon={s.icon} className="size-6" />
              </span>
              <span className="t-eyebrow text-brand">{s.tagline}</span>
            </div>
            <h1 className="rise t-display-xl mt-6 max-w-[14ch] text-balance" style={{ ["--i" as string]: 2 }}>
              {s.title}
            </h1>
            <p className="rise t-lead mt-6 max-w-[48ch] text-ink-2" style={{ ["--i" as string]: 3 }}>
              {s.promise}
            </p>
            <div className="rise mt-9 flex flex-wrap gap-3" style={{ ["--i" as string]: 4 }}>
              <QuoteButton service={s.slug} className="btn btn-wa px-6 text-base">
                <WhatsAppIcon className="size-5" /> Cotar {s.short}
              </QuoteButton>
              <a href={waLink(`Olá, Fernando! Tenho uma dúvida sobre ${s.title}.`)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost px-6 text-base">
                Tirar uma dúvida
              </a>
            </div>
          </div>

          <aside className="rise self-end lg:col-span-4 lg:col-start-9" style={{ ["--i" as string]: 3 }}>
            <div className="flex items-center gap-5 rounded-[var(--radius-card)] bg-surface p-5 shadow-[var(--shadow-2)] edge-light">
              <div className="arch h-[112px] w-[84px] shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={withBase("/images/fernando/banco-b.webp")} alt="" width={738} height={1108} className="h-full w-full object-cover object-[55%_22%]" />
              </div>
              <div>
                <p className="font-[family-name:var(--font-display)] text-xl leading-tight">{SITE.brokerShort} cuida desta cotação</p>
                <p className="mt-1.5 text-sm text-ink-2">Atendimento pessoal, do primeiro contato até a renovação.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Para quem */}
      <section className="border-y border-line bg-surface py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1320px] gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-10">
          <div className="lg:col-span-5">
            <h2 className="reveal t-h2 max-w-[16ch]">
              Para quem <span className="t-accent">faz sentido</span>
            </h2>
            <p className="reveal mt-6 max-w-[52ch] text-ink-2" style={{ ["--i" as string]: 1 }}>
              {s.intro}
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-6 lg:col-start-7" data-stagger>
            {s.forWho.map((w, i) => (
              <li key={w} className="reveal flex gap-4 rounded-2xl bg-paper p-5 edge-light">
                <span className="t-num font-[family-name:var(--font-display)] text-2xl italic leading-none text-[#a48a5c]" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-ink">{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Coberturas */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-10">
          <h2 className="reveal t-h2 max-w-[22ch]">
            O que costuma estar coberto, <span className="t-accent">e o que fica de fora.</span>
          </h2>
          <div className="mt-12 grid gap-4 lg:grid-cols-12">
            <div className="reveal rounded-[var(--radius-card)] bg-surface p-7 edge-light sm:p-10 lg:col-span-7">
              <h3 className="t-eyebrow text-brand">Costuma estar coberto</h3>
              <ul className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {s.covered.map((c) => (
                  <li key={c} className="flex gap-3 text-ink">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand text-white">
                      <Check className="size-3.5" aria-hidden />
                    </span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="reveal rounded-[var(--radius-card)] bg-surface-2/70 p-7 sm:p-10 lg:col-span-5" style={{ ["--i" as string]: 1 }}>
              <h3 className="t-eyebrow text-ink-2">Costuma ficar de fora</h3>
              <ul className="mt-6 grid gap-4">
                {s.usuallyOut.map((c) => (
                  <li key={c} className="flex gap-3 text-ink-2">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-surface text-ink-2 ring-1 ring-line">
                      <Minus className="size-3.5" aria-hidden />
                    </span>
                    {c}
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-sm text-muted">
                Coberturas e exclusões variam conforme a seguradora e o plano. Na cotação, mostro exatamente o que cada
                proposta inclui.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seguradoras */}
      {s.insurers.length > 0 && (
        <section className="border-y border-line bg-surface py-20 sm:py-24">
          <div className="mx-auto grid max-w-[1320px] gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-10">
            <div className="lg:col-span-4">
              <h2 className="reveal t-h2 max-w-[14ch]">
                Seguradoras que <span className="t-accent">comparo</span>
              </h2>
              <p className="reveal mt-4 max-w-[36ch] text-ink-2" style={{ ["--i" as string]: 1 }}>
                Algumas das parceiras que oferecem {s.title.toLowerCase()}. A disponibilidade varia conforme o perfil e a
                região.
              </p>
            </div>
            <div className="reveal lg:col-span-8" style={{ ["--i" as string]: 1 }}>
              <PartnerGrid ids={s.insurers} />
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-10">
          <h2 className="reveal t-h2 max-w-[12ch] lg:col-span-4">
            Dúvidas <span className="t-accent">comuns</span>
          </h2>
          <div className="lg:col-span-7 lg:col-start-6">
            <FaqList items={s.faq} />
          </div>
        </div>
      </section>

      {/* CTA + outros seguros */}
      <section className="px-3 pb-24 sm:px-6 sm:pb-32 lg:px-10">
        <div className="on-dark grain relative isolate mx-auto max-w-[1320px] overflow-hidden rounded-[32px] bg-brand-950 px-6 py-14 text-white sm:rounded-[40px] sm:px-12 sm:py-20">
          <Arcs dark className="pointer-events-none absolute -right-32 -top-20 w-[760px] opacity-[0.1]" strokeScale={1.6} />
          <div className="relative z-10 grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <h2 className="t-display-lg max-w-[14ch]">
                Pronto para <span className="t-accent">comparar?</span>
              </h2>
              <p className="t-lead mt-5 max-w-[44ch] text-white/75">
                Responda algumas perguntas e a conversa continua no WhatsApp, com as propostas lado a lado.
              </p>
              <QuoteButton service={s.slug} className="btn btn-wa mt-8 px-7 text-base">
                <WhatsAppIcon className="size-5" /> Cotar {s.short}
              </QuoteButton>
            </div>
            <div className="lg:col-span-5">
              <p className="t-eyebrow text-brand-400">Outros seguros</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {others.map((o) => (
                  <li key={o.slug}>
                    <a
                      href={withBase(`/servicos/${o.slug}/`)}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/[0.06] px-4 text-sm text-white/90 ring-1 ring-white/15 transition-colors hover:bg-white hover:text-brand-950"
                    >
                      <ServiceIcon icon={o.icon} className="size-4" /> {o.short}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
