// Dados institucionais. Tudo que for exibido no site sai daqui.

/** Prefixo quando o site roda num subcaminho (ex.: GitHub Pages). Vazio em domínio próprio. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
/** Prefixa caminhos internos (links e imagens) com o BASE_PATH. */
export const withBase = (path: string) => `${BASE_PATH}${path}`;
// Campos `null` não aparecem no site até serem preenchidos.

export const SITE = {
  name: "Escolha Certa",
  legalName: "Escolha Certa Corretora de Seguros",
  // defina NEXT_PUBLIC_SITE_URL no build (ex.: domínio definitivo)
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.escolhacertaseguros.com.br",
  founded: 2020,
  broker: "Fernando Queiroz Ramos",
  brokerShort: "Fernando",
  /** Número de registro na SUSEP. Preencha para exibir no rodapé e na seção do Fernando. */
  susep: null as string | null,
  phone: {
    e164: "5561991740511",
    display: "(61) 99174-0511",
    tel: "+5561991740511",
  },
  email: "corretoraescolhacerta@gmail.com",
  address: {
    line1: "Quadra 204, Lote 02, Loft 06",
    line2: "Edifício Alfa Mix Center",
    city: "Brasília",
    state: "DF",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent("Edifício Alfa Mix Center, Quadra 204 Lote 02, Brasília - DF"),
  },
  hours: [
    { label: "Segunda a sexta", value: "9h às 18h" },
    { label: "Sábado", value: "9h às 13h" },
  ],
  /** Redes sociais oficiais (deixe vazio para não exibir). */
  social: {
    instagram: "",
    facebook: "",
    linkedin: "",
  },
} as const;

export const NAV = [
  { label: "Seguros", href: withBase("/#seguros") },
  { label: "Como funciona", href: withBase("/#como-funciona") },
  { label: "Fernando", href: withBase("/#fernando") },
  { label: "Parceiros", href: withBase("/#parceiros") },
  { label: "Dúvidas", href: withBase("/#duvidas") },
] as const;

export function waLink(text?: string) {
  const base = `https://wa.me/${SITE.phone.e164}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
