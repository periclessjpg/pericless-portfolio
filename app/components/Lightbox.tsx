"use client";

// Visionneuse plein écran : un clic sur une image de galerie l'ouvre en grand.
// - flèches ← → (boutons et clavier), Échap ou × pour fermer, glissement du doigt sur mobile ;
// - le focus reste dans la visionneuse, puis revient sur l'image cliquée à la fermeture ;
// - "réduire les animations" respecté (simple fondu, sans mouvement).

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { easeOut } from "./motion/easing";
import { focusRing, label } from "./styles";

export type LightboxItem = {
  src: string;
  alt: string;
  width: number;
  height: number;
  title: string;
  /** Texte sous le titre (filtre, catégorie…). */
  kind?: string;
};

const LightboxContext = createContext<((index: number, trigger: HTMLElement) => void) | null>(null);

const controlClass = `flex size-11 items-center justify-center rounded-full bg-neutral-950/70 text-xl text-neutral-200 backdrop-blur-sm transition-colors hover:bg-neutral-900 hover:text-neutral-100 ${focusRing}`;

/** Fournit la visionneuse à une liste d'images (une galerie). */
export function LightboxProvider({ items, children }: { items: LightboxItem[]; children: ReactNode }) {
  const [index, setIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  const triggerRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const swipeStart = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  const open = useCallback((i: number, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setDirection(0);
    setIndex(i);
  }, []);

  const close = useCallback(() => {
    setIndex(null);
    // Le focus revient sur l'image cliquée.
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  const go = useCallback(
    (step: number) => {
      if (items.length < 2) return;
      setDirection(step);
      setIndex((current) => (current === null ? current : (current + step + items.length) % items.length));
    },
    [items.length],
  );

  // Ouverte : défilement de la page bloqué, focus sur "Fermer", clavier (Échap, ← →).
  const isOpen = index !== null;
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close, go]);

  // Garde le focus clavier à l'intérieur de la visionneuse (Tab / Maj+Tab).
  function trapFocus(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab" || !dialogRef.current) return;
    const focusables = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button"));
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

  // Glissement du doigt (ou de la souris) : gauche = suivante, droite = précédente.
  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    swipeStart.current = event.clientX;
  }
  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    if (swipeStart.current === null) return;
    const delta = event.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1);
  }

  const item = index === null ? null : items[index];
  const shift = reduceMotion ? 0 : 40;

  return (
    <LightboxContext.Provider value={open}>
      {children}
      <AnimatePresence>
        {item && index !== null && (
          <motion.div
            key="lightbox"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${item.title} (${index + 1} / ${items.length})`}
            onKeyDown={trapFocus}
            className="fixed inset-0 z-[80] flex flex-col bg-neutral-950/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: easeOut }}
          >
            {/* Barre du haut : compteur et fermeture */}
            <div className="flex items-center justify-between gap-4 p-4 md:p-6">
              <p className={`${label} text-neutral-400`} aria-hidden="true">
                {index + 1} / {items.length}
              </p>
              <button ref={closeRef} type="button" onClick={close} aria-label="Close" className={controlClass}>
                ×
              </button>
            </div>

            {/* Image en grand (clic à côté de l'image = fermer) */}
            <div
              className="relative flex min-h-0 flex-1 touch-pan-y items-center justify-center px-4 md:px-20"
              onClick={(event: MouseEvent<HTMLDivElement>) => {
                if (event.target === event.currentTarget) close();
              }}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
            >
              <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                <motion.div
                  key={item.src}
                  className="relative flex h-full w-full items-center justify-center"
                  initial={{ opacity: 0, x: direction * shift }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -direction * shift }}
                  transition={{ duration: 0.4, ease: easeOut }}
                  onClick={(event: MouseEvent<HTMLDivElement>) => {
                    if (event.target === event.currentTarget) close();
                  }}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    sizes="100vw"
                    preload
                    draggable={false}
                    className="h-auto max-h-full w-auto max-w-full select-none object-contain"
                  />
                </motion.div>
              </AnimatePresence>

              {items.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous image"
                    className={`absolute left-2 top-1/2 -translate-y-1/2 md:left-6 ${controlClass}`}
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next image"
                    className={`absolute right-2 top-1/2 -translate-y-1/2 md:right-6 ${controlClass}`}
                  >
                    →
                  </button>
                </>
              )}
            </div>

            {/* Légende */}
            <div className="p-4 text-center md:p-6">
              <p className={`${label} text-neutral-100`}>{item.title}</p>
              {item.kind && <p className="mt-1 text-xs uppercase tracking-[0.2em] text-neutral-500">{item.kind}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </LightboxContext.Provider>
  );
}

/**
 * Rend son contenu cliquable pour ouvrir l'image `index` dans la visionneuse.
 * C'est un lien vers l'image elle-même : sans JavaScript, il l'ouvre directement.
 */
export function LightboxTrigger({
  index,
  href,
  className,
  children,
}: {
  index: number;
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const open = useContext(LightboxContext);
  return (
    <a
      href={href}
      aria-haspopup="dialog"
      className={className}
      onClick={(event) => {
        if (!open || event.metaKey || event.ctrlKey || event.shiftKey) return;
        event.preventDefault();
        open(index, event.currentTarget);
      }}
    >
      {children}
    </a>
  );
}
