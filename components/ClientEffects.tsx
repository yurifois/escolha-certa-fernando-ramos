"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * O estado "já apareceu" fica em data-in (não em classe): o React reescreve className
 * quando o estado do componente muda e apagaria a marca, escondendo o elemento de novo.
 *
 * Efeitos globais de dose leve/média (skill site-premium):
 * - revelar ao rolar (IntersectionObserver, anima uma vez só, com auto-stagger em [data-stagger])
 * - brilho que segue o ponteiro em [data-glow] e .btn (um único listener delegado)
 */
export default function ClientEffects() {
  const pathname = usePathname();

  useEffect(() => {
    document.querySelectorAll<HTMLElement>("[data-stagger]").forEach((group) => {
      Array.from(group.children).forEach((child, i) => {
        if (!(child as HTMLElement).style.getPropertyValue("--i")) {
          (child as HTMLElement).style.setProperty("--i", String(i));
        }
      });
    });

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          if (e.target.matches(".reveal, .reveal-clip")) e.target.setAttribute("data-in", "");
          e.target.querySelectorAll(":scope > .reveal-clip").forEach((c) => c.setAttribute("data-in", ""));
          io.unobserve(e.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    // Elemento com clip-path totalmente recortado nunca "intersecta": observa o pai.
    const scan = () => {
      document.querySelectorAll(".reveal:not([data-in])").forEach((el) => io.observe(el));
      document
        .querySelectorAll(".reveal-clip:not([data-in])")
        .forEach((el) => el.parentElement && io.observe(el.parentElement));
    };
    scan();

    // conteúdo que entra depois (ex.: troca de perfil na vitrine)
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-glow], .btn");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);

  return null;
}
