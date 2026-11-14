// Mentions légales (page /legal et /fr/legal), en anglais et en français.
//
// Site édité par un particulier, à titre non professionnel (loi n° 2004-575 du
// 21 juin 2004, LCEN, article 1-1, III, 2) : ton adresse personnelle n'a pas à être
// publiée, à condition que l'hébergeur ait tes coordonnées (c'est le cas : celles de
// ton compte Vercel).
// Si tu deviens micro-entrepreneur, il faudra ajouter : SIRET, adresse (ou adresse de
// domiciliation) et téléphone ou email.
//
// Dans les textes : {name} = ton nom, {email} = ton adresse email (textes du site).
// Pense à mettre à jour `updated` quand tu modifies ce fichier.

import type { Localized } from "../lib/i18n";

export type LegalSection = {
  title: Localized;
  /** Paragraphes (un retour à la ligne "\n" = nouvelle ligne dans le paragraphe). */
  paragraphs: Record<keyof Localized, string[]>;
};

/** Date de la dernière mise à jour, affichée en haut de la page. */
export const updated: Localized = {
  en: "November 14, 2026",
  fr: "14 novembre 2026",
};

export const legalSections: LegalSection[] = [
  {
    title: { en: "Publisher", fr: "Éditeur du site" },
    paragraphs: {
      en: [
        "This website is published by {name}, a private individual, on a non-professional basis.",
        "Publication director: {name}.\nContact: {email}",
      ],
      fr: [
        "Ce site est édité par {name}, particulier, à titre non professionnel.",
        "Directeur de la publication : {name}.\nContact : {email}",
      ],
    },
  },
  {
    title: { en: "Hosting", fr: "Hébergement" },
    paragraphs: {
      en: [
        "Vercel Inc.\n440 N Barranca Ave #4133, Covina, CA 91723, United States\nhttps://vercel.com",
      ],
      fr: [
        "Vercel Inc.\n440 N Barranca Ave #4133, Covina, CA 91723, États-Unis\nhttps://vercel.com",
      ],
    },
  },
  {
    title: { en: "Intellectual property", fr: "Propriété intellectuelle" },
    paragraphs: {
      en: [
        "All artworks, illustrations, concept art, photographs and texts on this website are the exclusive property of {name}, unless otherwise stated, and are protected by copyright.",
        "Any reproduction, modification, distribution or use, in whole or in part, including to train artificial intelligence models, is prohibited without the prior written permission of {name}.",
        "Some works may have been created for studios or clients; their characters, worlds and brands remain the property of their respective owners.",
      ],
      fr: [
        "L’ensemble des œuvres, illustrations, concept arts, photographies et textes présents sur ce site sont la propriété exclusive de {name}, sauf mention contraire, et sont protégés par le droit d’auteur (Code de la propriété intellectuelle).",
        "Toute reproduction, modification, diffusion ou utilisation, totale ou partielle, y compris pour l’entraînement de modèles d’intelligence artificielle, est interdite sans l’autorisation écrite préalable de {name} (article L. 122-4 du Code de la propriété intellectuelle).",
        "Certaines œuvres ont pu être réalisées pour des studios ou des clients ; leurs personnages, univers et marques restent la propriété de leurs détenteurs respectifs.",
      ],
    },
  },
  {
    title: { en: "Personal data", fr: "Données personnelles" },
    paragraphs: {
      en: [
        "This website has no contact form, no user account and no advertising or audience-tracking tools.",
        "If you write to {email}, your email address and message are used only to reply to you. They are never shared or sold, and are deleted when no longer needed for our exchange.",
        "The host (Vercel) may record technical data, such as IP addresses, in its server logs to ensure the security and proper functioning of the website.",
        "In accordance with the General Data Protection Regulation (GDPR) and the French Data Protection Act, you have the right to access, rectify and delete your data, and to object to its processing. To exercise these rights, write to {email}. You may also file a complaint with the CNIL (www.cnil.fr).",
      ],
      fr: [
        "Ce site ne comporte ni formulaire de contact, ni compte utilisateur, ni outil de publicité ou de mesure d’audience.",
        "Si vous écrivez à {email}, votre adresse email et votre message servent uniquement à vous répondre. Ils ne sont jamais transmis ni vendus, et sont supprimés lorsqu’ils ne sont plus utiles à notre échange.",
        "L’hébergeur (Vercel) peut enregistrer des données techniques, comme les adresses IP, dans les journaux de ses serveurs, afin d’assurer la sécurité et le bon fonctionnement du site.",
        "Conformément au Règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés, vous disposez d’un droit d’accès, de rectification, d’effacement et d’opposition sur vos données. Pour l’exercer, écrivez à {email}. Vous pouvez aussi adresser une réclamation à la CNIL (www.cnil.fr).",
      ],
    },
  },
  {
    title: { en: "Cookies", fr: "Cookies" },
    paragraphs: {
      en: [
        "This website uses a single cookie, named “lang”, which remembers the language you choose with the EN / FR selector, for one year. It contains no personal data, is not used for tracking and is not shared with anyone. As it only serves the language you asked for, it does not require your consent.",
      ],
      fr: [
        "Ce site utilise un seul cookie, nommé « lang », qui retient pendant un an la langue choisie avec le sélecteur EN / FR. Il ne contient aucune donnée personnelle, ne sert à aucun suivi et n’est transmis à personne. Comme il sert uniquement à afficher la langue que vous avez demandée, il ne nécessite pas votre consentement.",
      ],
    },
  },
  {
    title: { en: "External links", fr: "Liens externes" },
    paragraphs: {
      en: [
        "This website contains links to other websites (ArtStation, Instagram, LinkedIn). {name} has no control over their content or their use of your data, which are governed by their own policies.",
      ],
      fr: [
        "Ce site contient des liens vers d’autres sites (ArtStation, Instagram, LinkedIn). {name} n’a aucun contrôle sur leur contenu ni sur l’usage qu’ils font de vos données, qui relèvent de leurs propres politiques.",
      ],
    },
  },
];
