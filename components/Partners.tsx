import { ACTIVE_PARTNERS, opticalHeight, type Partner } from "@/lib/partners";

function LogoImg({ p, base = 52, maxW = 150 }: { p: Partner; base?: number; maxW?: number }) {
  let h = opticalHeight(p.ratio, base);
  if (h * p.ratio > maxW) h = Math.round(maxW / p.ratio);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={p.logo}
      alt={p.name}
      height={h}
      width={Math.round(h * p.ratio)}
      loading="lazy"
      decoding="async"
      className="partner-logo"
      style={{ height: h }}
    />
  );
}

function Row({ items, reverse, dur }: { items: Partner[]; reverse?: boolean; dur: string }) {
  return (
    <div className="marquee py-1.5" data-reverse={reverse ? "" : undefined} style={{ ["--dur" as string]: dur }}>
      {[0, 1].map((copy) => (
        <ul key={copy} className="marquee__track" aria-hidden={copy === 1 ? "true" : undefined}>
          {items.map((p) => (
            <li key={p.id} className="partner-tile grid h-24 w-[188px] shrink-0 place-items-center rounded-2xl bg-surface px-5 edge-light">
              <LogoImg p={p} />
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

export default function Partners() {
  const half = Math.ceil(ACTIVE_PARTNERS.length / 2);
  const a = ACTIVE_PARTNERS.slice(0, half);
  const b = ACTIVE_PARTNERS.slice(half);
  return (
    <section id="parceiros" aria-labelledby="parceiros-title" className="relative border-y border-line bg-paper py-24 sm:py-28">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-10">
        <div className="grid items-end gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="reveal t-eyebrow text-brand">Parceiros</p>
            <h2 id="parceiros-title" className="reveal t-h2 mt-4 max-w-[20ch] text-balance" style={{ ["--i" as string]: 1 }}>
              Seguradoras que eu <span className="t-accent">comparo por você.</span>
            </h2>
          </div>
          <p className="reveal max-w-[40ch] text-ink-2 lg:col-span-5 lg:justify-self-end lg:text-right" style={{ ["--i" as string]: 2 }}>
            Trabalho com as principais seguradoras e operadoras do país. Você vê as opções lado a lado, sem precisar
            falar com cada uma.
          </p>
        </div>
      </div>

      <div className="reveal mt-12 hidden md:block" style={{ ["--i" as string]: 2 }}>
        <Row items={a} dur="58s" />
        <Row items={b} reverse dur="64s" />
      </div>
      <div className="reveal mt-10 md:hidden">
        <Row items={ACTIVE_PARTNERS} dur="48s" />
      </div>

      <ul className="sr-only">
        {ACTIVE_PARTNERS.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>

      <p className="mx-auto mt-10 max-w-[1320px] px-4 text-xs text-muted sm:px-6 lg:px-10">
        Marcas pertencem a seus respectivos titulares. A disponibilidade de produtos varia conforme a seguradora e a região.
      </p>
    </section>
  );
}

export function PartnerGrid({ ids }: { ids: string[] }) {
  const list = ACTIVE_PARTNERS.filter((p) => ids.includes(p.id));
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {list.map((p) => (
        <li key={p.id} className="partner-tile grid h-24 place-items-center rounded-2xl bg-surface px-4 edge-light">
          <LogoImg p={p} />
        </li>
      ))}
    </ul>
  );
}
