"use client";

import { useSearchParams } from "next/navigation";
import QuoteWizard from "@/components/quote/QuoteWizard";
import { QUOTE_FIELDS, type ServiceSlug } from "@/lib/quote";
import { PROFILES, type ProfileId } from "@/lib/services";

export default function CotacaoClient() {
  const params = useSearchParams();
  const s = params.get("servico");
  const p = params.get("perfil");
  const service = s && s in QUOTE_FIELDS ? (s as ServiceSlug) : undefined;
  const profile = p && PROFILES.some((x) => x.id === p) ? (p as ProfileId) : undefined;
  return (
    <div className="flex min-h-[560px] flex-col">
      <QuoteWizard initialService={service} profile={profile} variant="page" />
    </div>
  );
}
