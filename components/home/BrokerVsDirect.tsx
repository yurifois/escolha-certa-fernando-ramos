const POINTS = [
  {
    n: "i.",
    title: "Várias propostas, não uma",
    text: "Quem contrata direto vê só a proposta daquela seguradora. Eu mostro várias, e explico as diferenças que o preço esconde: franquia, limites, carências, rede.",
  },
  {
    n: "ii.",
    title: "A cotação não custa nada",
    text: "Você não paga pela consultoria. Só contrata se fizer sentido para você.",
  },
  {
    n: "iii.",
    title: "Alguém do seu lado no sinistro",
    text: "Se o seguro precisar ser acionado, você não fica sozinho preenchendo formulário e esperando resposta. Eu oriento e acompanho com a seguradora.",
  },
];

export default function BrokerVsDirect() {
  return (
    <section aria-labelledby="corretor-title" className="relative py-24 sm:py-32">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-10">
        <div className="lg:col-span-5">
          <p className="reveal t-eyebrow text-brand">Corretor ou direto na seguradora?</p>
          <h2 id="corretor-title" className="reveal t-display-lg mt-5 text-balance" style={{ ["--i" as string]: 1 }}>
            Uma seguradora vende a dela. <span className="t-accent">Um corretor compara várias.</span>
          </h2>
        </div>
        <div className="lg:col-span-6 lg:col-start-7 lg:pt-3">
          <ol className="grid" data-stagger>
            {POINTS.map((p) => (
              <li key={p.n} className="reveal grid grid-cols-[3rem_1fr] gap-x-4 border-t border-line py-8 last:border-b">
                <span
                  className="font-[family-name:var(--font-display)] text-2xl italic leading-none text-[#a48a5c]"
                  aria-hidden
                >
                  {p.n}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-ink">{p.title}</h3>
                  <p className="mt-2 max-w-[54ch] text-ink-2">{p.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
