"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV, SITE, waLink, withBase } from "@/lib/site";
import { Logo, WhatsAppIcon } from "./Brand";
import { useQuote } from "./quote/QuoteProvider";

export default function Header() {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const { openQuote } = useQuote();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
        stuck || open
          ? "bg-paper/80 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl backdrop-saturate-150"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[var(--header-h)] max-w-[1320px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-10">
        <a href={withBase("/")} className="shrink-0 rounded-md" aria-label="Escolha Certa, página inicial">
          <Logo className={`w-auto transition-[height] duration-500 ${stuck ? "h-10" : "h-11 sm:h-12"}`} />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="whitespace-nowrap rounded-full px-3 py-2 text-[0.95rem] font-medium text-ink-2 transition-colors hover:bg-brand-50 hover:text-brand xl:px-3.5"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-ink-2 transition-colors hover:text-brand xl:inline-flex"
          >
            <WhatsAppIcon className="size-4 text-[#128C4A]" />
            <span className="t-num">{SITE.phone.display}</span>
          </a>
          <button
            type="button"
            onClick={() => openQuote()}
            aria-haspopup="dialog"
            className="btn btn-primary hidden min-h-11 whitespace-nowrap px-5 text-sm sm:inline-flex"
          >
            Fazer cotação
          </button>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-surface-2 lg:hidden"
            aria-expanded={open}
            aria-controls="menu-movel"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Menu móvel */}
      <div
        id="menu-movel"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[var(--header-h)] overflow-y-auto bg-paper px-4 pb-10 pt-4 sm:px-6 lg:hidden"
      >
        <nav aria-label="Menu">
          <ul className="grid">
            {NAV.map((item, i) => (
              <li key={item.href} className="border-b border-line">
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline justify-between py-5 font-[family-name:var(--font-display)] text-3xl tracking-tight"
                >
                  {item.label}
                  <span className="t-num text-sm font-sans text-muted">0{i + 1}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-8 grid gap-3">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openQuote();
            }}
            className="btn btn-primary w-full"
          >
            Fazer cotação
          </button>
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-wa w-full">
            <WhatsAppIcon className="size-5" /> {SITE.phone.display}
          </a>
        </div>
      </div>
    </header>
  );
}
