import type { Metadata, Viewport } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientEffects from "@/components/ClientEffects";
import { QuoteProvider } from "@/components/quote/QuoteProvider";
import MobileBar from "@/components/MobileBar";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

const description =
  "Corretora de seguros em Brasília. Fernando Queiroz Ramos compara seguradoras para você: auto, residencial, vida, empresarial, viagem, condominial, fiança locatícia, plano de saúde e odontológico. Cotação sem custo pelo WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Escolha Certa Corretora de Seguros · Brasília",
    template: "%s · Escolha Certa Corretora de Seguros",
  },
  description,
  applicationName: SITE.legalName,
  authors: [{ name: SITE.broker }],
  keywords: [
    "corretora de seguros Brasília",
    "seguro auto Brasília",
    "seguro de vida",
    "plano de saúde Brasília",
    "seguro residencial",
    "fiança locatícia",
    "seguro empresarial",
    "corretor de seguros DF",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE.legalName,
    title: "Escolha Certa · Seguro bom é o que funciona no dia ruim",
    description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Escolha Certa Corretora de Seguros" }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f7f6f9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${hanken.variable}`} suppressHydrationWarning>
      <head>
        {/* Marca o documento como "com JS" antes da pintura, para os reveals não piscarem */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <QuoteProvider>
          <a
            href="#conteudo"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
          >
            Pular para o conteúdo
          </a>
          <Header />
          <main id="conteudo">{children}</main>
          <Footer />
          <MobileBar />
          <ClientEffects />
        </QuoteProvider>
      </body>
    </html>
  );
}
