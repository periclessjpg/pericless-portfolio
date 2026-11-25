"use client";

import { motion, useReducedMotion, useScroll, useTransform, type TargetAndTransition } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { framingClass, framingStyle } from "../lib/framing";
import { heroCssVars, heroPhoneSettings, type HeroSettings } from "../lib/hero-settings";
import BlurText from "./BlurText";
import { easeOut } from "./motion/easing";
import Reveal from "./motion/Reveal";
import ScrollIndicator from "./ScrollIndicator";
import { container } from "./styles";

type Props = {
  /** Réglages (public/artworks/hero/settings.json, valeurs vérifiées). */
  settings: HeroSettings;
  /** Image de fond (dossier public/artworks/hero/), ou null. */
  image: { src: string; alt: string; position?: string; positionMobile?: string } | null;
  /** Titre principal de la page (invisible à l'écran, lu par Google et les lecteurs d'écran). */
  title: string;
  /** Accroche affichée ("" = aucune). */
  tagline: string;
  /** Texte de "Scroll to explore". */
  scrollLabel: string;
  /** Section vers laquelle mène "Scroll to explore". */
  scrollTarget: string;
  /** Outils posés sur l'image (mode édition local uniquement). */
  imageTools?: ReactNode;
  /**
   * Diaporama (2 images ou plus) : remplace l'image seule. Chaque image a ses outils
   * (cadrage, remplacement…), affichés quand elle est à l'écran.
   */
  slides?: HeroSlide[];
  /** Outils sous le texte (mode édition local uniquement). */
  editTools?: ReactNode;
};

/** Une image du diaporama du hero. */
export type HeroSlide = {
  key: string;
  src: string;
  alt: string;
  position?: string;
  positionMobile?: string;
  /** Outils du mode édition local pour cette image. */
  tools?: ReactNode;
};

/** Durée du fondu enchaîné entre deux images du diaporama, en millisecondes. */
const SLIDE_FADE = 1600;

/**
 * Diaporama du hero, comme le menu de GTA V : chaque image reste quelques secondes en
 * glissant lentement (travelling, sens alterné d'une image à l'autre), puis laisse place
 * à la suivante en fondu enchaîné. Sans animation si le visiteur l'a demandé.
 */
/** Image affichée et image précédente (encore visible pendant le fondu) ; change toutes les `duration` s. */
function useSlideshow(count: number, duration: number) {
  const [state, setState] = useState<{ index: number; previous: number | null }>({ index: 0, previous: null });

  // Passe à l'image suivante toutes les `duration` secondes.
  useEffect(() => {
    if (count < 2) return;
    const timer = window.setInterval(() => {
      setState((s) => ({ index: (s.index + 1) % count, previous: s.index }));
    }, duration * 1000);
    return () => window.clearInterval(timer);
  }, [count, duration]);

  // Fin du fondu : l'image précédente est remise à zéro (son travelling repartira de zéro).
  useEffect(() => {
    if (state.previous === null) return;
    const timer = window.setTimeout(() => setState((s) => ({ ...s, previous: null })), SLIDE_FADE + 100);
    return () => window.clearTimeout(timer);
  }, [state.previous]);

  return state;
}

function HeroSlideshow({
  slides,
  duration,
  index,
  previous,
}: {
  slides: HeroSlide[];
  duration: number;
  index: number;
  previous: number | null;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <>
      {slides.map((slide, i) => {
        const active = i === index;
        const moving = active || i === previous;
        return (
          <div
            key={slide.key}
            className="absolute inset-0 transition-opacity ease-in-out"
            style={{ opacity: active ? 1 : 0, transitionDuration: `${SLIDE_FADE}ms` }}
            aria-hidden={active ? undefined : true}
          >
            <div
              className="absolute inset-0 will-change-transform"
              style={
                {
                  // Sens du glissement alterné d'une image à l'autre.
                  "--slide-dir": i % 2 === 0 ? 1 : -1,
                  // Le travelling dure tout l'affichage, fondu de sortie compris.
                  animation:
                    moving && !reduceMotion
                      ? `hero-slide-travel ${duration + SLIDE_FADE / 1000}s linear forwards`
                      : "none",
                } as CSSProperties
              }
            >
              <Image
                // Le fond d'ambiance suit l'image affichée.
                data-ambient={active || undefined}
                src={slide.src}
                alt={slide.alt}
                fill
                preload={i === 0}
                sizes="100vw"
                className={`${framingClass} object-cover`}
                style={{
                  ...framingStyle(slide.position, slide.positionMobile),
                  opacity: "var(--hero-img-opacity)",
                  filter: "var(--hero-filter)",
                  transform: "scale(var(--hero-zoom))",
                }}
              />
            </div>
          </div>
        );
      })}
    </>
  );
}

// Position du texte, pilotée par les variables CSS du hero (voir heroCssVars).
const textPosition = {
  justifyContent: "var(--hero-justify)",
  alignItems: "var(--hero-align)",
  textAlign: "var(--hero-text-align)",
} as Record<string, string> as CSSProperties;
const scrollPosition = {
  display: "var(--hero-scroll-display)",
  alignSelf: "var(--hero-align)",
} as Record<string, string> as CSSProperties;

/**
 * Hero (haut de l'accueil), entièrement réglable : hauteur, image, opacité, zoom,
 * filtres, voile, dégradé, position et style du texte, animation et parallaxe.
 * Les réglages sont appliqués par des variables CSS (--hero-…), ce qui permet au
 * panneau du mode édition de les modifier en direct.
 */
export default function HeroView({
  settings,
  image,
  title,
  tagline,
  scrollLabel,
  scrollTarget,
  imageTools,
  slides = [],
  editTools,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  // Diaporama : à partir de 2 images choisies dans "Customize hero".
  const slideshow = slides.length >= 2;
  const current = useSlideshow(slideshow ? slides.length : 1, settings.slideDuration);

  // Parallaxe : l'image descend plus lentement que la page pendant le défilement.
  const shift = reduceMotion ? 0 : settings.parallax / 2;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${shift}%`]);

  // Arrivée de l'image au chargement.
  const intro: TargetAndTransition | false =
    settings.animation === "fade"
      ? { opacity: 0 }
      : settings.animation === "zoom"
        ? { opacity: 0, scale: 1.15 }
        : false;

  return (
    <section
      ref={ref}
      id="hero"
      aria-labelledby="hero-title"
      className="relative overflow-hidden"
      // Réglages ordinateur et téléphone ; app/globals.css choisit selon la largeur de l'écran.
      style={
        {
          ...heroCssVars(settings, "d"),
          ...heroCssVars(heroPhoneSettings(settings), "m"),
          minHeight: "var(--hero-height)",
        } as CSSProperties
      }
    >
      {(slideshow || image) && (
        <motion.div className="absolute inset-x-0 bottom-0" style={{ top: `-${shift}%`, y }}>
          <motion.div
            className="absolute inset-0"
            initial={intro}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: settings.animationDuration, ease: easeOut }}
          >
            {slideshow ? (
              <HeroSlideshow
                slides={slides}
                duration={settings.slideDuration}
                index={current.index}
                previous={current.previous}
              />
            ) : image ? (
              <>
                {/* Travelling lent automatique (style écran de chargement GTA V) : l'image glisse et
                zoome très lentement, puis repart dans l'autre sens. Réglages "Slow camera move" et
                "Camera move duration" ; désactivé si le visiteur a demandé moins d'animations. */}
                <div className="absolute inset-0 will-change-transform motion-safe:animate-[hero-travel_var(--hero-travel-duration)_ease-in-out_infinite_alternate]">
                  <Image
                    data-ambient
                    src={image.src}
                    alt={image.alt}
                    fill
                    preload
                    sizes="100vw"
                    className={`${framingClass} object-cover`}
                    style={{
                      ...framingStyle(image.position, image.positionMobile),
                      opacity: "var(--hero-img-opacity)",
                      filter: "var(--hero-filter)",
                      transform: "scale(var(--hero-zoom))",
                    }}
                  />
                </div>
              </>
            ) : null}
          </motion.div>
        </motion.div>
      )}

      {/* Voile coloré puis dégradé, pour régler la lisibilité du texte */}
      <div aria-hidden="true" className="absolute inset-0" style={{ background: "var(--hero-overlay)" }} />
      <div aria-hidden="true" className="absolute inset-0" style={{ backgroundImage: "var(--hero-gradient)" }} />

      {/* Mode édition local : outils de l'image affichée (au-dessus du voile, pour rester cliquables) */}
      {slideshow ? slides[current.index]?.tools : imageTools}

      <div
        className={`${container} relative flex flex-col pb-12 pt-32 md:pb-16`}
        style={{ minHeight: "var(--hero-height)" }}
      >
        <div className="flex flex-1 flex-col" style={textPosition}>
          <h1 id="hero-title" className="sr-only">
            {title}
          </h1>
          {/* Accroche (facultative, app/data/site.ts) : apparaît mot par mot au chargement */}
          {/* Vide : rien sur le site publié ; en mode édition local, un repère "(empty)" cliquable */}
          <div style={{ fontSize: "var(--hero-text-size)", color: "var(--hero-text-color)" }}>
            <BlurText as="p" delay={0.2} textKey="home.tagline" className="max-w-xl leading-snug">
              {tagline}
            </BlurText>
          </div>
        </div>

        <div style={scrollPosition}>
          <Reveal delay={0.8}>
            <ScrollIndicator targetId={scrollTarget} label={scrollLabel} />
          </Reveal>
        </div>

        {editTools}
      </div>
    </section>
  );
}
