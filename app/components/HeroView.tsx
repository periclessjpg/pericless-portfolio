"use client";

import { motion, useReducedMotion, useScroll, useTransform, type TargetAndTransition } from "motion/react";
import Image from "next/image";
import { useRef, type CSSProperties, type ReactNode } from "react";
import { heroCssVars, type HeroSettings } from "../lib/hero-settings";
import BlurText from "./BlurText";
import { easeOut } from "./motion/easing";
import Reveal from "./motion/Reveal";
import ScrollIndicator from "./ScrollIndicator";
import { container } from "./styles";

type Props = {
  /** Réglages (public/artworks/hero/settings.json, valeurs vérifiées). */
  settings: HeroSettings;
  /** Image de fond (dossier public/artworks/hero/), ou null. */
  image: { src: string; alt: string; position?: string } | null;
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
  /** Outils sous le texte (mode édition local uniquement). */
  editTools?: ReactNode;
};

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
  editTools,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

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
      style={{ ...heroCssVars(settings), minHeight: "var(--hero-height)" } as CSSProperties}
    >
      {image && (
        <motion.div className="absolute inset-x-0 bottom-0" style={{ top: `-${shift}%`, y }}>
          <motion.div
            className="absolute inset-0"
            initial={intro}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: settings.animationDuration, ease: easeOut }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              preload
              sizes="100vw"
              className="object-cover"
              style={{
                objectPosition: image.position,
                opacity: "var(--hero-img-opacity)",
                filter: "var(--hero-filter)",
                transform: "scale(var(--hero-zoom))",
              }}
            />
          </motion.div>
        </motion.div>
      )}

      {/* Voile coloré puis dégradé, pour régler la lisibilité du texte */}
      <div aria-hidden="true" className="absolute inset-0" style={{ background: "var(--hero-overlay)" }} />
      <div aria-hidden="true" className="absolute inset-0" style={{ backgroundImage: "var(--hero-gradient)" }} />

      {imageTools}

      <div
        className={`${container} relative flex flex-col pb-12 pt-32 md:pb-16`}
        style={{ minHeight: "var(--hero-height)" }}
      >
        <div
          className="flex flex-1 flex-col"
          style={textPosition}
        >
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
