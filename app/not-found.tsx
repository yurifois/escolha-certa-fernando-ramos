import { Arcs } from "@/components/Brand";
import { withBase } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="grain relative isolate flex min-h-[80svh] items-center overflow-hidden pt-[var(--header-h)]">
      <Arcs draw className="pointer-events-none absolute left-1/2 top-[18%] w-[680px] -translate-x-1/2 opacity-40" />
      <div className="relative z-10 mx-auto max-w-[640px] px-4 text-center">
        <p className="t-eyebrow text-brand">Erro 404</p>
        <h1 className="t-display-lg mt-4">
          Esta página <span className="t-accent">não existe.</span>
        </h1>
        <p className="mt-5 text-ink-2">Mas o seu seguro pode existir. Volte para o início e escolha por onde começar.</p>
        <a href={withBase("/")} className="btn btn-primary mt-8">
          Voltar ao início
        </a>
      </div>
    </section>
  );
}
