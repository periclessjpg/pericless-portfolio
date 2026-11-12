"use client";

import { AnimatePresence, motion, type Variants } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { site } from "../data/site";
import { easeOut } from "./motion/easing";
import { container, focusRing, label } from "./styles";


const links = [
  { href: "/concept-art", label: "Concept Art" },
  { href: "/illustration", label: "Illustration" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/** Même style pour le texte de gauche, le bouton Menu et les liens du menu (défini dans styles.ts). */
const labelStyle = label;

// Animation du menu : les liens sortent du mot "Menu" l'un après l'autre.
const list: Variants = {
  open: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
  closed: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
};
const item: Variants = {
  open: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
  closed: { opacity: 0, y: -12, transition: { duration: 0.3, ease: easeOut } },
};

/** true dès que la page a défilé de quelques pixels (fond de la barre du haut). */
function subscribeScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}
function useScrolled() {
  return useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 24,
    () => false,
  );
}

/** Le lien est actif sur sa page et ses sous-pages. */
function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  // On retient la page sur laquelle le menu a été ouvert :
  // si on change de page, le menu se ferme tout seul.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;

  const scrolled = useScrolled();
  const headerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Quand le menu est ouvert : bloque le défilement de la page,
  // place le focus sur le premier lien, ferme avec la touche Échap.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenOn(null);
        buttonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Garde le focus clavier à l'intérieur du menu ouvert (Tab / Maj+Tab).
  function trapFocus(event: KeyboardEvent<HTMLElement>) {
    if (!open || event.key !== "Tab" || !headerRef.current) return;
    const focusables = Array.from(
      headerRef.current.querySelectorAll<HTMLElement>("a[href], button"),
    ).filter((el) => el.getClientRects().length > 0);
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <header ref={headerRef} onKeyDown={trapFocus} className="fixed inset-x-0 top-0 z-50">
      {/* Voile sombre derrière le menu : apparaît en fondu, un clic le referme */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            aria-hidden="true"
            onClick={() => setOpenOn(null)}
            className="fixed inset-0 bg-neutral-950/85 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.1 } }}
            transition={{ duration: 0.6, ease: easeOut }}
          />
        )}
      </AnimatePresence>

      {/* Barre transparente en haut de la page ; fond sombre discret dès qu'on fait défiler */}
      <div
        className={`relative z-10 transition-[background-color,backdrop-filter] duration-700 ${
          scrolled && !open
            ? "bg-neutral-950/80 backdrop-blur-md"
            : "bg-transparent [text-shadow:0_1px_12px_rgb(0_0_0/0.45)]"
        }`}
      >
        <div className={`${container} flex items-start justify-between gap-6 py-5 md:py-6`}>
          {/* En haut à gauche : métier puis nom, sur deux lignes (ramène à l'accueil) */}
          <Link href="/" className={`${labelStyle} flex flex-col gap-1 text-neutral-100 ${focusRing}`}>
            <span>{site.title}</span>
            {/* Sur l'accueil, le nom est un peu plus gros */}
            <span className={pathname === "/" ? "text-sm sm:text-lg" : undefined}>
              {site.name}
            </span>
          </Link>

          <div className="relative">
            {/* Bouton Menu : même style que le texte de gauche */}
            <button
              ref={buttonRef}
              type="button"
              onClick={() => setOpenOn(open ? null : pathname)}
              aria-expanded={open}
              aria-controls="site-menu"
              className={`${labelStyle} block text-neutral-100 ${focusRing}`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? "close" : "menu"}
                  className="block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {open ? "Close" : "Menu"}
                </motion.span>
              </AnimatePresence>
            </button>

            {/* Liens du menu : sortent du mot "Menu" en fondu */}
            <nav id="site-menu" aria-label="Main" className="absolute right-0 top-full pt-8">
              <AnimatePresence>
                {open && (
                  <motion.ul
                    key="links"
                    className="flex flex-col items-end gap-5 text-right"
                    variants={list}
                    initial="closed"
                    animate="open"
                    exit="closed"
                  >
                    {links.map((link, index) => {
                      const active = isActive(pathname, link.href);
                      return (
                        <motion.li key={link.href} variants={item}>
                          <Link
                            ref={index === 0 ? firstLinkRef : undefined}
                            href={link.href}
                            onClick={() => setOpenOn(null)}
                            aria-current={active ? "page" : undefined}
                            className={`${labelStyle} whitespace-nowrap transition-colors duration-300 ${focusRing} ${
                              active ? "text-neutral-100" : "text-neutral-400 hover:text-neutral-100"
                            }`}
                          >
                            {link.label}
                          </Link>
                        </motion.li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
