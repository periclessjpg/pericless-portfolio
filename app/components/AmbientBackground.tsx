"use client";

// Fond d'ambiance : l'œuvre affichée au milieu de l'écran apparaît dans le fond noir,
// très floue et sombre, comme à travers du verre liquide, avec un fondu lent d'une
// image à l'autre.
//
// - Les images concernées portent l'attribut data-ambient (hero, Selected Works, cartes,
//   bandes, grilles, portrait).
// - Le fond est une miniature de l'image déjà chargée (64 px de large), agrandie à la
//   taille de l'écran : l'agrandissement la rend naturellement floue et "liquide",
//   pour un coût quasi nul. Calculée dans le navigateur : rien à préparer.
// - Un vignettage et des fondus haut/bas la font émerger du noir ; un léger reflet de
//   verre et une dérive très lente (désactivée si "réduire les animations") donnent
//   l'effet "liquid glass".
// - Sans image au milieu de l'écran, le fond revient doucement au noir d'origine.

import { useEffect, useRef, type CSSProperties } from "react";

/** Réglages de l'effet (tu peux les modifier). */
export const AMBIENT = {
  /** Visibilité de l'image floue dans le fond, de 0 (invisible) à 1. */
  imageOpacity: 0.55,
  /** Flou ajouté, en pixels (la miniature agrandie est déjà floue). */
  blur: 48,
  /** Saturation des couleurs (1 = normale). */
  saturation: 1.8,
  /** Luminosité de l'image floue (1 = normale ; plus bas = plus sombre, textes plus lisibles). */
  brightness: 0.55,
  /** Durée du fondu entre deux images, en secondes. */
  duration: 1.8,
  /** Délai avant de revenir au noir quand aucune image n'est au milieu de l'écran (ms). */
  resetDelay: 700,
};

/** Fond d'origine du site (neutral-950). */
const BASE = "#0a0a0a";

/** Miniatures déjà calculées (adresse "data:" d'une image de 64 px), par adresse d'image. */
const cache = new Map<string, string | null>();

/** Miniature de l'image (64 px de large, proportions gardées), ou null si illisible. */
function thumbnail(img: HTMLImageElement): string | null {
  const key = img.currentSrc || img.src;
  if (cache.has(key)) return cache.get(key) ?? null;

  let url: string | null = null;
  try {
    const width = 64;
    const height = Math.max(1, Math.round((width * img.naturalHeight) / img.naturalWidth));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (context) {
      context.drawImage(img, 0, 0, width, height);
      url = canvas.toDataURL("image/jpeg", 0.8);
    }
  } catch {
    // Image illisible (ex. venant d'un autre site) : pas de fond.
    url = null;
  }
  cache.set(key, url);
  return url;
}

// Deux calques superposés pour le fondu enchaîné d'une image à l'autre.
const layerClass =
  "absolute -inset-[10%] bg-cover bg-center opacity-0 motion-safe:animate-[ambient-drift_32s_ease-in-out_infinite_alternate]";

export default function AmbientBackground() {
  const layerA = useRef<HTMLDivElement>(null);
  const layerB = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layers = [layerA, layerB];
    const visible = new Map<HTMLImageElement, number>();
    let resetTimer: number | undefined;
    let current: string | null = null;
    let front = 0;

    /** Fondu vers une nouvelle miniature (ou vers le noir si null). */
    function show(url: string | null) {
      if (url === current) return;
      current = url;
      const [a, b] = [layers[front].current, layers[1 - front].current];
      if (!a || !b) return;
      if (!url) {
        a.style.opacity = "0";
        b.style.opacity = "0";
        return;
      }
      // Le calque caché reçoit la nouvelle image et apparaît ; l'autre s'efface.
      b.style.backgroundImage = `url("${url}")`;
      b.style.opacity = String(AMBIENT.imageOpacity);
      a.style.opacity = "0";
      front = 1 - front;
    }

    /** Choisit l'image la plus visible au milieu de l'écran. */
    function update() {
      let best: HTMLImageElement | null = null;
      let bestRatio = 0;
      for (const [img, ratio] of visible) {
        if (ratio > bestRatio) {
          best = img;
          bestRatio = ratio;
        }
      }
      window.clearTimeout(resetTimer);
      if (!best) {
        resetTimer = window.setTimeout(() => show(null), AMBIENT.resetDelay);
        return;
      }
      const img = best;
      if (img.complete && img.naturalWidth > 0) {
        const url = thumbnail(img);
        if (url) show(url);
      } else {
        img.addEventListener("load", update, { once: true });
      }
    }

    // Zone d'observation : la bande du milieu de l'écran (40 % de la hauteur).
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const img = entry.target as HTMLImageElement;
          if (entry.isIntersecting) visible.set(img, entry.intersectionRatio);
          else visible.delete(img);
        }
        update();
      },
      { rootMargin: "-30% 0px -30% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );

    const observed = new Set<Element>();
    function scan() {
      document.querySelectorAll("img[data-ambient]").forEach((img) => {
        if (!observed.has(img)) {
          observed.add(img);
          observer.observe(img);
        }
      });
      // Images retirées de la page (changement de page) : on arrête de les suivre.
      for (const img of observed) {
        if (!img.isConnected) {
          observer.unobserve(img);
          observed.delete(img);
          visible.delete(img as HTMLImageElement);
        }
      }
    }

    scan();
    // Nouvelles images (changement de page, filtres, chargement) : on les suit aussi.
    let frame = 0;
    const mutations = new MutationObserver(() => {
      // Au plus une fois par image affichée par le navigateur.
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        scan();
      });
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
      window.cancelAnimationFrame(frame);
      window.clearTimeout(resetTimer);
    };
  }, []);

  const layerStyle: CSSProperties = {
    filter: `blur(${AMBIENT.blur}px) saturate(${AMBIENT.saturation}) brightness(${AMBIENT.brightness})`,
    transition: `opacity ${AMBIENT.duration}s ease`,
  };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ backgroundColor: BASE }}
    >
      {/* Image floue (deux calques pour le fondu enchaîné) */}
      <div ref={layerA} className={layerClass} style={layerStyle} />
      <div ref={layerB} className={layerClass} style={layerStyle} />

      {/* Émerge du noir : vignettage ovale + fondus en haut et en bas */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(ellipse 75% 65% at 50% 45%, transparent 0%, rgba(10,10,10,0.55) 60%, ${BASE} 100%), linear-gradient(to bottom, ${BASE} 0%, transparent 18%, transparent 80%, ${BASE} 100%)`,
        }}
      />

      {/* Reflet de verre liquide : lueur douce en diagonale */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(125deg, rgba(255,255,255,0.05) 0%, transparent 35%, transparent 60%, rgba(255,255,255,0.025) 78%, transparent 100%), radial-gradient(ellipse 50% 35% at 25% 20%, rgba(255,255,255,0.04), transparent 70%)",
        }}
      />
    </div>
  );
}
