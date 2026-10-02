import { SITE, withBase } from "@/lib/site";
import { Arcs } from "../Brand";

export default function AboutFernando() {
  return (
    <section
      id="fernando"
      aria-labelledby="fernando-title"
      className="on-dark grain relative isolate overflow-hidden bg-brand-950 text-white"
    >
      <Arcs dark className="pointer-events-none absolute -right-48 top-10 w-[900px] opacity-[0.08]" strokeScale={1.6} />
      <div className="relative z-10 mx-auto grid max-w-[1320px] lg:grid-cols-12">
        {/* Retrato grande, fundido ao escuro */}
        <div className="relative lg:col-span-6">
          <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[5/5] lg:absolute lg:inset-0 lg:aspect-auto">
            <picture>
              <source srcSet={withBase("/images/fernando/poltrona-olhar.webp")} type="image/webp" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={withBase("/images/fernando/poltrona-olhar.jpg")}
                alt="Fernando Queiroz Ramos sentado em uma poltrona, olhando para o lado, sorrindo"
                width={738}
                height={1108}
                loading="lazy"
                className="reveal-clip h-full w-full object-cover object-[60%_25%]"
              />
            </picture>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,var(--color-brand-950)_100%)] lg:bg-[linear-gradient(90deg,transparent_45%,var(--color-brand-950)_98%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[rgb(21_22_58/0.12)] mix-blend-multiply" />
          </div>
        </div>

        <div className="relative px-4 pb-24 pt-4 sm:px-6 lg:col-span-6 lg:px-10 lg:py-32">
          <p className="reveal t-eyebrow text-brand-400">Quem está do outro lado</p>
          <h2 id="fernando-title" className="reveal t-display-lg mt-5 max-w-[13ch]" style={{ ["--i" as string]: 1 }}>
            Prazer, <span className="t-accent">Fernando.</span>
          </h2>
          <div className="reveal mt-8 grid max-w-[54ch] gap-4 text-white/80" style={{ ["--i" as string]: 2 }}>
            <p>
              Fundei a Escolha Certa em {SITE.founded} com uma ideia simples: seguro tem que ser entendido antes de ser
              comprado. Atendo cada cliente pessoalmente, pelo WhatsApp ou no escritório, na Quadra 204.
            </p>
            <p>
              Trabalho com as principais seguradoras do país e acompanho de perto o que muda no mercado, para que você
              tenha acesso às melhores opções e entenda cada uma delas.
            </p>
          </div>

          <figure className="reveal relative mt-12 max-w-[46ch] border-l-2 border-brand-400 pl-6" style={{ ["--i" as string]: 3 }}>
            <blockquote className="font-[family-name:var(--font-display)] text-[clamp(1.35rem,1.1rem+0.9vw,1.85rem)] italic leading-snug text-white">
              “Preço importa. O que o seguro cobre também. Eu ajudo você a comparar os dois.”
            </blockquote>
          </figure>

          <div className="reveal mt-12 flex items-center gap-5" style={{ ["--i" as string]: 4 }}>
            <div className="arch relative h-[104px] w-[78px] shrink-0 ring-1 ring-white/15">
              <picture>
                <source srcSet={withBase("/images/fernando/banco-b.webp")} type="image/webp" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={withBase("/images/fernando/banco-b.jpg")}
                  alt=""
                  width={738}
                  height={1108}
                  loading="lazy"
                  className="h-full w-full object-cover object-[55%_22%]"
                />
              </picture>
            </div>
            <div>
              <p className="font-[family-name:var(--font-display)] text-2xl italic text-white">{SITE.broker}</p>
              <p className="mt-1 text-sm text-white/65">
                Corretor de seguros · fundador da Escolha Certa
                {SITE.susep ? ` · SUSEP ${SITE.susep}` : ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
