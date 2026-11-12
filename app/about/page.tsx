import Image from "next/image";
import ArtworkGrid from "../components/ArtworkGrid";
import BlurText from "../components/BlurText";
import ComingSoon from "../components/ComingSoon";
import { DevDropZoneSlot, DevFramingSlot, DevReorderSlot } from "../components/dev/DevSlots";
import Reveal from "../components/motion/Reveal";
import PageHeader from "../components/PageHeader";
import { container, eyebrow, focusRing, titleMedium } from "../components/styles";
import { site } from "../data/site";
import { folders, getAboutArtworks } from "../lib/artworks";
import { pageMetadata } from "../lib/metadata";
import { getTexts } from "../lib/texts";
import { ABOUT_LIST_SIZES, editable, shown, type TextKey, type Texts } from "../lib/texts-defaults";

export const metadata = pageMetadata({
  title: "About",
  description: "About Rayan Houstti: background, skills, software and experience.",
  path: "/about",
});

/** Clés d'une liste de la page About : "about.skills.0", "about.skills.1"… */
function listKeys(name: "skills" | "software", size: number) {
  return Array.from({ length: size }, (_, i) => `about.${name}.${i}` as TextKey);
}

export default function AboutPage() {
  // Textes : modifiables en mode édition local (content/texts.json).
  const t = getTexts();
  // Portrait et photos : dossier public/artworks/about/ (le portrait se nomme portrait.jpg).
  const { portrait, others, all: aboutImages } = getAboutArtworks(`Portrait of ${site.name}`);

  const bioKeys = ["about.bio.0", "about.bio.1", "about.bio.2"] as const;
  const experienceIndexes = Array.from({ length: ABOUT_LIST_SIZES.experience }, (_, i) => i);

  return (
    <div className={`${container} pt-32 md:pt-44`}>
      <PageHeader
        label={t["about.eyebrow"]}
        title={t["about.title"]}
        keys={{ label: "about.eyebrow", title: "about.title" }}
      />

      <div className="grid gap-16 md:grid-cols-12 md:gap-12">
        {/* Portrait */}
        <Reveal className="md:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900">
            {portrait ? (
              <Image
                src={portrait.src}
                alt={portrait.alt}
                fill
                preload
                sizes="(min-width: 768px) 40vw, 100vw"
                style={{ objectPosition: portrait.position }}
                className="object-cover"
              />
            ) : (
              <ComingSoon
                folder={folders.about}
                className="flex h-full flex-col justify-center border-none px-6"
              />
            )}
            {/* Mode édition local : réglage du cadrage du portrait */}
            {portrait && (
              <DevFramingSlot id={portrait.id} src={portrait.src} position={portrait.position} />
            )}
          </div>
        </Reveal>

        {/* Texte */}
        <div className="flex flex-col gap-16 md:col-span-6 md:col-start-7">
          <Reveal delay={0.15}>
            <section aria-labelledby="bio-title">
              <h2 id="bio-title" className="sr-only">
                Biography
              </h2>
              <div className="flex flex-col gap-6 text-lg leading-relaxed text-neutral-300">
                {bioKeys.map((key) =>
                  shown(t[key]) ? (
                    <p key={key} className="whitespace-pre-line" {...editable(key)}>
                      {shown(t[key])}
                    </p>
                  ) : null,
                )}
              </div>
              <a
                href="/cv.pdf"
                download
                className={`mt-10 inline-flex items-center gap-3 border border-neutral-700 px-6 py-3 text-sm text-neutral-100 transition-colors duration-300 hover:border-neutral-100 hover:bg-neutral-100 hover:text-neutral-950 ${focusRing}`}
              >
                <span {...editable("about.cv")}>{shown(t["about.cv"])}</span>
                <span className="sr-only"> (PDF)</span>
              </a>
            </section>
          </Reveal>

          <div className="grid gap-12 sm:grid-cols-2">
            <ListSection
              id="skills"
              t={t}
              titleKey="about.skills.title"
              itemKeys={listKeys("skills", ABOUT_LIST_SIZES.skills)}
            />
            <ListSection
              id="software"
              t={t}
              titleKey="about.software.title"
              itemKeys={listKeys("software", ABOUT_LIST_SIZES.software)}
            />
          </div>

          <section aria-labelledby="experience-title">
            <BlurText
              as="h2"
              id="experience-title"
              textKey="about.experience.title"
              className={`${titleMedium} text-neutral-100`}
            >
              {t["about.experience.title"]}
            </BlurText>
            <Reveal delay={0.2}>
              <ul className="mt-6 border-t border-neutral-800">
                {experienceIndexes.map((i) => {
                  const role = `about.experience.${i}.role` as TextKey;
                  const studio = `about.experience.${i}.studio` as TextKey;
                  const period = `about.experience.${i}.period` as TextKey;
                  // Ligne entièrement vide : rien sur le site publié.
                  if (!shown(t[role]) && !shown(t[studio]) && !shown(t[period])) return null;
                  return (
                    <li
                      key={i}
                      className="flex flex-col gap-1 border-b border-neutral-800 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                    >
                      <div>
                        <p className="text-neutral-100" {...editable(role)}>
                          {shown(t[role])}
                        </p>
                        <p className="text-sm text-neutral-400" {...editable(studio)}>
                          {shown(t[studio])}
                        </p>
                      </div>
                      <p className={`${eyebrow} shrink-0`} {...editable(period)}>
                        {shown(t[period])}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </section>
        </div>
      </div>

      {/* Autres photos du dossier public/artworks/about/ (grille simple) */}
      {others.length > 0 && (
        <section aria-label="Photos" className="mt-32">
          <ArtworkGrid
            artworks={others}
            captions={false}
            tools={(artwork) => (
              // Mode édition local : remplacer ou supprimer (ces photos ne sont jamais recadrées)
              <DevFramingSlot id={artwork.id} src={artwork.src} framing={false} />
            )}
          />
        </section>
      )}

      {/* Mode édition local (npm run dev uniquement) : la première image sert de portrait */}
      <DevDropZoneSlot category="about" variant="portrait" />
      <DevReorderSlot
        type="images"
        category="about"
        title="About"
        items={aboutImages.map((artwork) => ({
          key: artwork.id.split("/").pop() ?? artwork.id,
          label: artwork.title,
          src: artwork.src,
        }))}
        note="The first image is the portrait, unless a file is named “portrait”."
      />
    </div>
  );
}

function ListSection({
  id,
  t,
  titleKey,
  itemKeys,
}: {
  id: string;
  t: Texts;
  titleKey: TextKey;
  itemKeys: TextKey[];
}) {
  return (
    <section aria-labelledby={`${id}-title`}>
      <BlurText as="h2" id={`${id}-title`} textKey={titleKey} className={`${titleMedium} text-neutral-100`}>
        {t[titleKey]}
      </BlurText>
      <Reveal delay={0.2}>
        <ul className="mt-6 flex flex-col gap-2 text-neutral-400">
          {itemKeys.map((key) =>
            shown(t[key]) ? (
              <li key={key} {...editable(key)}>
                {shown(t[key])}
              </li>
            ) : null,
          )}
        </ul>
      </Reveal>
    </section>
  );
}
