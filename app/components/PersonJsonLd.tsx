// Fiche "qui es-tu" pour Google (données structurées JSON-LD, invisibles pour les visiteurs),
// placée sur l'accueil : nom, nom d'artiste, métier, ville, école, photo, réseaux et compétences.
// Les informations viennent des textes du site (content/texts.json) et de app/data/site.ts.
// Pas d'adresse email (elle reste protégée contre le spam).
// Pour tester : https://search.google.com/test/rich-results (une fois le site en ligne).

import { site } from "../data/site";
import { getAboutArtworks } from "../lib/artworks";
import { localizeHref } from "../lib/i18n";
import { getLocale } from "../lib/locale";
import { absoluteUrl } from "../lib/site-url";
import { getTexts } from "../lib/texts";
import { ABOUT_LIST_SIZES, type TextKey } from "../lib/texts-defaults";

export default async function PersonJsonLd() {
  const t = await getTexts();
  const locale = await getLocale();
  const { portrait } = getAboutArtworks("");
  const name = t["nav.name"].trim() || site.name;
  // Compétences de la page About (sans doublons ni emplacements vides).
  const skills = [
    ...new Set(
      Array.from({ length: ABOUT_LIST_SIZES.skills }, (_, i) => t[`about.skills.${i}` as TextKey].trim()).filter(Boolean),
    ),
  ];

  const person = {
    "@type": "Person",
    "@id": absoluteUrl("/#person"),
    name,
    ...(site.alternateName && { alternateName: site.alternateName }),
    jobTitle: t["nav.title"],
    url: absoluteUrl(localizeHref("/", locale)),
    ...(portrait && { image: absoluteUrl(portrait.src) }),
    sameAs: site.socials.map((social) => social.href),
    ...(skills.length > 0 && { knowsAbout: skills }),
    ...(site.city && {
      address: { "@type": "PostalAddress", addressLocality: site.city, addressCountry: site.country },
    }),
    ...(site.school && { alumniOf: { "@type": "EducationalOrganization", name: site.school } }),
  };

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      person,
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        url: absoluteUrl("/"),
        name,
        inLanguage: ["en", "fr"],
        author: { "@id": absoluteUrl("/#person") },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // "<" remplacé : aucun texte ne peut fermer la balise et injecter du code.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
