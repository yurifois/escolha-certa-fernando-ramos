import Hero from "@/components/home/Hero";
import Facts from "@/components/home/Facts";
import Showcase from "@/components/home/Showcase";
import HowItWorks from "@/components/home/HowItWorks";
import BrokerVsDirect from "@/components/home/BrokerVsDirect";
import AboutFernando from "@/components/home/AboutFernando";
import ClaimChat from "@/components/home/ClaimChat";
import Partners from "@/components/Partners";
import FaqSection from "@/components/home/FaqSection";
import FinalCta from "@/components/home/FinalCta";
import { HOME_FAQ, faqJsonLd } from "@/components/Faq";
import { SITE } from "@/lib/site";
import { SERVICES } from "@/lib/services";

const agencyLd = {
  "@context": "https://schema.org",
  "@type": "InsuranceAgency",
  name: SITE.legalName,
  url: SITE.url,
  logo: `${SITE.url}/images/brand/logo.png`,
  image: `${SITE.url}/og.jpg`,
  telephone: `+${SITE.phone.e164}`,
  email: SITE.email,
  foundingDate: String(SITE.founded),
  founder: { "@type": "Person", name: SITE.broker },
  address: {
    "@type": "PostalAddress",
    streetAddress: `${SITE.address.line1}, ${SITE.address.line2}`,
    addressLocality: SITE.address.city,
    addressRegion: SITE.address.state,
    addressCountry: "BR",
  },
  areaServed: "BR",
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "13:00" },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Seguros e planos",
    itemListElement: SERVICES.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title, url: `${SITE.url}/servicos/${s.slug}/` },
    })),
  },
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(agencyLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(HOME_FAQ)) }} />
      <Hero />
      <Facts />
      <Showcase />
      <HowItWorks />
      <BrokerVsDirect />
      <AboutFernando />
      <ClaimChat />
      <Partners />
      <FaqSection />
      <FinalCta />
    </>
  );
}
