import { Clock, Mail, MapPin } from "lucide-react";
import { SITE, withBase } from "@/lib/site";
import { SERVICES } from "@/lib/services";
import { Arcs, WhatsAppIcon } from "../Brand";
import { QuoteButton } from "../quote/QuoteProvider";
import ServiceIcon from "../ServiceIcon";

export default function FinalCta() {
  return (
    <section id="contato" aria-labelledby="cta-title" className="px-3 pb-24 sm:px-6 sm:pb-32 lg:px-10">
      <div className="on-dark grain relative isolate mx-auto max-w-[1320px] overflow-hidden rounded-[32px] bg-brand-950 text-white sm:rounded-[40px]">
        <Arcs dark className="pointer-events-none absolute -left-24 -top-10 w-[1100px] max-w-none opacity-[0.09]" strokeScale={2} />
        <div className="relative z-10 grid lg:grid-cols-12">
          <div className="px-6 pb-4 pt-14 sm:px-12 sm:pt-20 lg:col-span-7 lg:pb-20">
            <p className="reveal t-eyebrow text-brand-400">Contato</p>
            <h2 id="cta-title" className="reveal t-display-xl mt-5" style={{ ["--i" as string]: 1 }}>
              Vamos <span className="t-accent">conversar?</span>
            </h2>
            <p className="reveal t-lead mt-6 max-w-[44ch] text-white/75" style={{ ["--i" as string]: 2 }}>
              Conte o que você quer proteger. Eu respondo pessoalmente, em horário de atendimento.
            </p>

            <ul className="mt-9 flex flex-wrap gap-2" data-stagger aria-label="Cotar um seguro específico">
              {SERVICES.map((s) => (
                <li key={s.slug} className="reveal">
                  <QuoteButton
                    service={s.slug}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/[0.06] px-4 text-sm font-medium text-white/90 ring-1 ring-white/15 transition-colors hover:bg-white hover:text-brand-950"
                  >
                    <ServiceIcon icon={s.icon} className="size-4" /> {s.short}
                  </QuoteButton>
                </li>
              ))}
            </ul>

            <div className="reveal mt-10" style={{ ["--i" as string]: 3 }}>
              <QuoteButton className="btn btn-wa px-7 text-base">
                <WhatsAppIcon className="size-5" /> Cotar pelo WhatsApp
              </QuoteButton>
            </div>
          </div>

          <div className="relative hidden lg:col-span-5 lg:block">
            <div className="arch reveal absolute bottom-0 right-12 top-16 w-[78%] ring-1 ring-white/10" style={{ ["--i" as string]: 2 }}>
              <picture>
                <source srcSet={withBase("/images/fernando/poltrona-camera.webp")} type="image/webp" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={withBase("/images/fernando/poltrona-camera.jpg")}
                  alt="Fernando Queiroz Ramos sentado em uma poltrona, sorrindo para a câmera"
                  width={738}
                  height={1108}
                  loading="lazy"
                  className="h-full w-full object-cover object-[50%_20%]"
                />
              </picture>
            </div>
          </div>
        </div>

        <div className="relative z-10 grid gap-px border-t border-white/10 bg-white/10 sm:grid-cols-[1.2fr_1fr_1fr]">
          <a href={SITE.address.mapsUrl} target="_blank" rel="noopener noreferrer" className="group flex gap-4 bg-brand-950 px-6 py-7 transition-colors hover:bg-[#1b1c48] sm:px-12">
            <MapPin className="mt-1 size-5 shrink-0 text-brand-400" aria-hidden />
            <span>
              <span className="block text-sm text-white/55">Escritório</span>
              <span className="mt-1 block text-white/90">
                {SITE.address.line1} · {SITE.address.line2}, {SITE.address.city}/{SITE.address.state}
              </span>
              <span className="mt-2 inline-block text-sm font-semibold text-brand-400 group-hover:underline">Ver no mapa →</span>
            </span>
          </a>
          <div className="flex gap-4 bg-brand-950 px-6 py-7 sm:px-8">
            <Clock className="mt-1 size-5 shrink-0 text-brand-400" aria-hidden />
            <span>
              <span className="block text-sm text-white/55">Horário</span>
              {SITE.hours.map((h) => (
                <span key={h.label} className="mt-1 block text-white/90">
                  {h.label}: {h.value}
                </span>
              ))}
            </span>
          </div>
          <a href={`mailto:${SITE.email}`} className="group flex gap-4 bg-brand-950 px-6 py-7 transition-colors hover:bg-[#1b1c48] sm:px-8">
            <Mail className="mt-1 size-5 shrink-0 text-brand-400" aria-hidden />
            <span className="min-w-0">
              <span className="block text-sm text-white/55">E-mail</span>
              <span className="mt-1 block break-all text-white/90 group-hover:underline">{SITE.email}</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
