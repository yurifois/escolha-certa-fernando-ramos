import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: "Como a Escolha Certa Corretora de Seguros trata os dados informados no site.",
  alternates: { canonical: "/privacidade/" },
};

export default function PrivacidadePage() {
  return (
    <article className="mx-auto max-w-[760px] px-4 pb-28 pt-[calc(var(--header-h)+48px)] sm:px-6">
      <p className="t-eyebrow text-brand">LGPD</p>
      <h1 className="t-display-lg mt-4">Política de privacidade</h1>
      <div className="mt-10 grid gap-6 text-ink-2 [&_h2]:mt-6 [&_h2]:font-[family-name:var(--font-display)] [&_h2]:text-2xl [&_h2]:text-ink">
        <p>
          Esta política explica como a {SITE.legalName} trata as informações que você fornece neste site, em conformidade
          com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
        </p>
        <h2>O que coletamos</h2>
        <p>
          O formulário de cotação não envia dados para nenhum servidor. As respostas ficam apenas no seu navegador
          enquanto você preenche (para não se perderem se a janela fechar) e são transformadas em uma mensagem que você
          mesmo envia pelo WhatsApp. O rascunho é apagado ao abrir a conversa e some ao fechar o navegador.
        </p>
        <h2>Como usamos</h2>
        <p>
          As informações que chegam pelo WhatsApp são usadas exclusivamente para elaborar cotações, prestar consultoria e
          acompanhar sua apólice. Para cotar, podemos compartilhar os dados necessários com as seguradoras consultadas.
        </p>
        <h2>Dados sensíveis</h2>
        <p>
          Não pedimos informações de saúde no site. Quando forem necessárias para um produto específico, serão tratadas
          diretamente na conversa, com a sua autorização.
        </p>
        <h2>Seus direitos</h2>
        <p>
          Você pode pedir a qualquer momento acesso, correção ou exclusão dos seus dados pelo e-mail{" "}
          <a href={`mailto:${SITE.email}`} className="font-semibold text-brand underline underline-offset-2">
            {SITE.email}
          </a>{" "}
          ou pelo WhatsApp {SITE.phone.display}.
        </p>
        <h2>Cookies</h2>
        <p>Este site não usa cookies de rastreamento nem ferramentas de publicidade.</p>
      </div>
    </article>
  );
}
