"use client";

import { useEffect, useState } from "react";
import { waLink } from "@/lib/site";
import { WhatsAppIcon } from "./Brand";
import { useQuote } from "./quote/QuoteProvider";

/** Barra fixa no celular ("Cotar agora") e botão flutuante de WhatsApp no desktop. */
export default function MobileBar() {
  const { openQuote, isOpen } = useQuote();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visible = show && !isOpen;

  return (
    <>
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/90 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] lg:hidden ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
        aria-hidden={!visible}
        inert={!visible}
      >
        <div className="flex gap-2">
          <button type="button" onClick={() => openQuote()} aria-haspopup="dialog" className="btn btn-primary flex-1">
            Cotar agora
          </button>
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-wa aspect-square px-0"
            aria-label="Conversar no WhatsApp"
          >
            <WhatsAppIcon className="size-6" />
          </a>
        </div>
      </div>

      <a
        href={waLink("Olá, Fernando! Vim pelo site da Escolha Certa.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar com o Fernando no WhatsApp"
        className={`group fixed bottom-6 right-6 z-40 hidden items-center gap-3 rounded-full bg-wa py-3 pl-3 pr-3 text-ink shadow-[0_18px_40px_-14px_rgb(37_211_102/0.8)] transition-[transform,opacity,padding] duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:pr-5 lg:flex ${
          visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <WhatsAppIcon className="size-7" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-[max-width] duration-500 group-hover:max-w-[160px] group-focus-visible:max-w-[160px]">
          Falar com o Fernando
        </span>
      </a>
    </>
  );
}
