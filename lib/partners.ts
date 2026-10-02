// Seguradoras e operadoras parceiras.
// Logos obtidas no Wikimedia Commons (ver public/images/parceiros/_fontes-wikimedia.json).
// `active: false` = logo já salva no projeto, mas só aparece depois que o Fernando
// confirmar que opera com a seguradora (direção do Jev: nunca exibir parceiro não confirmado).

import { withBase } from "./site";

export type Partner = {
  id: string;
  name: string;
  logo: string;
  /** proporção largura/altura da arte, usada para equalizar o peso visual */
  ratio: number;
  active: boolean;
};

export const PARTNERS: Partner[] = [
  { id: "porto-seguro", name: "Porto Seguro", logo: withBase("/images/parceiros/porto-seguro.webp"), ratio: 183 / 240, active: true },
  { id: "bradesco-seguros", name: "Bradesco Seguros", logo: withBase("/images/parceiros/bradesco-seguros.svg"), ratio: 500 / 80, active: true },
  { id: "sulamerica", name: "SulAmérica", logo: withBase("/images/parceiros/sulamerica.svg"), ratio: 500 / 128, active: true },
  { id: "allianz", name: "Allianz", logo: withBase("/images/parceiros/allianz.svg"), ratio: 300 / 134, active: true },
  { id: "itau", name: "Itaú Seguros", logo: withBase("/images/parceiros/itau.svg"), ratio: 300 / 304, active: true },
  { id: "azul-seguros", name: "Azul Seguros", logo: withBase("/images/parceiros/azul-seguros.svg"), ratio: 500 / 307, active: true },
  { id: "hdi", name: "HDI Seguros", logo: withBase("/images/parceiros/hdi.webp"), ratio: 388 / 240, active: true },
  { id: "tokio-marine", name: "Tokio Marine", logo: withBase("/images/parceiros/tokio-marine.webp"), ratio: 262 / 240, active: true },
  { id: "msig", name: "MSIG", logo: withBase("/images/parceiros/msig.webp"), ratio: 158 / 240, active: true },
  { id: "sura", name: "Seguros Sura", logo: withBase("/images/parceiros/sura.svg"), ratio: 1000 / 388, active: true },
  { id: "amil", name: "Amil", logo: withBase("/images/parceiros/amil.svg"), ratio: 273 / 97, active: true },
  { id: "unimed", name: "Unimed", logo: withBase("/images/parceiros/unimed.svg"), ratio: 500 / 167, active: true },
  // Aguardando confirmação do Fernando:
  { id: "mapfre", name: "Mapfre", logo: withBase("/images/parceiros/mapfre.svg"), ratio: 512 / 141, active: false },
  { id: "zurich", name: "Zurich", logo: withBase("/images/parceiros/zurich.svg"), ratio: 805 / 190, active: false },
  { id: "mag-seguros", name: "MAG Seguros", logo: withBase("/images/parceiros/mag-seguros.svg"), ratio: 512 / 247, active: false },
  { id: "hapvida", name: "Hapvida", logo: withBase("/images/parceiros/hapvida.svg"), ratio: 500 / 111, active: false },
];

export const ACTIVE_PARTNERS = PARTNERS.filter((p) => p.active);
export const PARTNER_BY_ID = Object.fromEntries(PARTNERS.map((p) => [p.id, p])) as Record<string, Partner>;

/** Altura (px) que equaliza o peso ótico: marcas largas ficam mais baixas, marcas quadradas mais altas. */
export function opticalHeight(ratio: number, base = 40) {
  const h = base * Math.pow(ratio, -0.38);
  return Math.round(Math.min(base * 1.35, Math.max(base * 0.62, h)));
}
