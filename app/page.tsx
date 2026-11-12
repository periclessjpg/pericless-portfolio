import Link from "next/link";
import BlurText from "./components/BlurText";
import Reveal from "./components/motion/Reveal";
import ComingSoon from "./components/ComingSoon";
import { DevDropZoneSlot, DevFramingSlot, DevHeroPanelSlot } from "./components/dev/DevSlots";
import FullscreenProjects from "./components/FullscreenProjects";
import HeroView from "./components/HeroView";
import { container, eyebrow, focusRing, titleMedium } from "./components/styles";
import { folders, getHero, getHomeArtworks } from "./lib/artworks";
import { site } from "./data/site";

export default function Home() {
  // Images du dossier public/artworks/home/
  const featured = getHomeArtworks();
  // Hero : réglages, image de fond choisie et images du dossier public/artworks/hero/
  const hero = getHero();

  return (
    <>
      {/* HERO : entièrement réglable (public/artworks/hero/settings.json ou panneau "Customize hero" en local) */}
      <HeroView
        settings={hero.settings}
        image={hero.image && { src: hero.image.src, alt: hero.image.alt, position: hero.image.position }}
        title={`${site.name}, ${site.title}`}
        tagline={site.tagline}
        scrollTarget="selected-works"
        imageTools={
          hero.image && (
            // Mode édition local : cadrage, remplacement, suppression de l'image de fond
            <DevFramingSlot id={hero.image.id} src={hero.image.src} position={hero.image.position} />
          )
        }
        editTools={
          <>
            {/* Mode édition local (npm run dev uniquement) : ajouter des images de fond */}
            <DevDropZoneSlot category="hero" variant="banner" />
            <DevHeroPanelSlot
              settings={hero.settings}
              images={hero.images.map((image) => ({ file: image.id.split("/").pop() ?? "", title: image.title }))}
            />
          </>
        }
      />

      {/* SELECTED WORKS : images du dossier public/artworks/home/, en plein écran */}
      <section
        id="selected-works"
        aria-labelledby="selected-works-title"
        className="scroll-mt-24 pt-24 md:pt-32"
      >
        <div className={`${container} mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16`}>
          <div>
            <Reveal>
              <p className={eyebrow}>Portfolio</p>
            </Reveal>
            <BlurText
              as="h2"
              id="selected-works-title"
              className={`${titleMedium} mt-4 text-neutral-100`}
            >
              Selected Works
            </BlurText>
          </div>
          <Reveal delay={0.2}>
            <Link
              href="/projects"
              className={`text-sm text-neutral-400 underline decoration-neutral-700 underline-offset-8 transition-colors duration-300 hover:text-neutral-100 hover:decoration-neutral-100 ${focusRing}`}
            >
              View all projects
            </Link>
          </Reveal>
        </div>
        {featured.length > 0 ? (
          <FullscreenProjects artworks={featured} />
        ) : (
          <ComingSoon folder={folders.home} className={container} />
        )}
        {/* Mode édition local (npm run dev uniquement) */}
        <div className={container}>
          <DevDropZoneSlot category="home" variant="fullscreen" />
        </div>
      </section>

      {/* VISION : court texte + lien vers About */}
      <section
        aria-labelledby="vision-title"
        className={`${container} pt-32 md:pt-48`}
      >
        <div className="grid gap-8 md:grid-cols-12">
          <BlurText
            as="h2"
            id="vision-title"
            className={`${titleMedium} text-neutral-100 md:col-span-4`}
          >
            Vision
          </BlurText>
          <Reveal delay={0.2} className="md:col-span-7 md:col-start-6">
            <p className="text-xl leading-relaxed text-neutral-300 md:text-2xl md:leading-relaxed">
              {site.vision}
            </p>
            <Link
              href="/about"
              className={`mt-10 inline-block text-sm text-neutral-400 underline decoration-neutral-700 underline-offset-8 transition-colors duration-300 hover:text-neutral-100 hover:decoration-neutral-100 ${focusRing}`}
            >
              More about me
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
