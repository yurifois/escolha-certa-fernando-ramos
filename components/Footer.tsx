import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { NAV, SITE, waLink, withBase } from "@/lib/site";
import { SERVICES } from "@/lib/services";
import { Arcs, Logo } from "./Brand";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark grain relative overflow-hidden bg-night pb-28 pt-20 text-white/80 lg:pb-12">
      <Arcs dark className="pointer-events-none absolute -right-40 -top-24 w-[720px] opacity-[0.07]" strokeScale={1.4} />
      <div className="relative z-10 mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo dark className="h-14 w-auto" />
            <p className="mt-6 max-w-sm text-white/70">
              Corretora de seguros em Brasília desde {SITE.founded}. Comparo seguradoras, explico as coberturas e
              acompanho você depois da contratação.
            </p>
            {SITE.susep && <p className="mt-4 text-sm text-white/60">Registro SUSEP nº {SITE.susep}</p>}
          </div>

          <nav aria-label="Rodapé" className="lg:col-span-2">
            <h2 className="t-eyebrow text-brand-400">Navegação</h2>
            <ul className="mt-5 grid gap-3">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="transition-colors hover:text-white">
                    {n.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={withBase("/cotacao/")} className="transition-colors hover:text-white">
                  Cotação online
                </a>
              </li>
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="t-eyebrow text-brand-400">Seguros</h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 lg:grid-cols-1">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <a href={withBase(`/servicos/${s.slug}/`)} className="transition-colors hover:text-white">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="t-eyebrow text-brand-400">Contato</h2>
            <ul className="mt-5 grid gap-4">
              <li className="flex gap-3">
                <Phone className="mt-1 size-4 shrink-0 text-brand-400" aria-hidden />
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="t-num hover:text-white">
                  {SITE.phone.display} <span className="text-white/50">· WhatsApp</span>
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-1 size-4 shrink-0 text-brand-400" aria-hidden />
                <a href={`mailto:${SITE.email}`} className="hover:text-white">
                  {SITE.email.split("@")[0]}@<wbr />
                  {SITE.email.split("@")[1]}
                </a>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-1 size-4 shrink-0 text-brand-400" aria-hidden />
                <a href={SITE.address.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  {SITE.address.line1}
                  <br />
                  {SITE.address.line2}
                  <br />
                  {SITE.address.city} – {SITE.address.state}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-1 size-4 shrink-0 text-brand-400" aria-hidden />
                <span>
                  {SITE.hours.map((h) => (
                    <span key={h.label} className="block">
                      {h.label}: {h.value}
                    </span>
                  ))}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/55 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {SITE.legalName}. Todos os direitos reservados.
          </p>
          <p className="flex flex-wrap gap-x-5 gap-y-2">
            <a href={withBase("/privacidade/")} className="hover:text-white">
              Política de privacidade
            </a>
            <span>Marcas de seguradoras pertencem a seus respectivos titulares.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
