import { SITE, waLink, withBase } from "@/lib/site";
import { FaqList, HOME_FAQ } from "../Faq";
import { WhatsAppIcon } from "../Brand";

export default function FaqSection() {
  return (
    <section id="duvidas" aria-labelledby="duvidas-title" className="relative py-24 sm:py-32">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+48px)]">
            <p className="reveal t-eyebrow text-brand">Dúvidas</p>
            <h2 id="duvidas-title" className="reveal t-display-lg mt-4 max-w-[11ch]" style={{ ["--i" as string]: 1 }}>
              Perguntas que <span className="t-accent">todo mundo faz.</span>
            </h2>
            <div className="reveal mt-10 flex items-center gap-4 rounded-2xl bg-surface p-4 pr-5 edge-light" style={{ ["--i" as string]: 2 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={withBase("/images/fernando/poltrona-camera.webp")}
                alt=""
                width={56}
                height={56}
                loading="lazy"
                className="size-14 shrink-0 rounded-full object-cover object-[50%_22%]"
              />
              <div className="text-sm">
                <p className="font-semibold text-ink">Ficou alguma dúvida?</p>
                <a
                  href={waLink("Olá, Fernando! Tenho uma dúvida sobre seguros.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-[#0e6b34] hover:underline"
                >
                  <WhatsAppIcon className="size-4" /> Pergunte ao {SITE.brokerShort}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <FaqList items={HOME_FAQ} />
        </div>
      </div>
    </section>
  );
}
