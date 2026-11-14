import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { DevEditBannerSlot, DevTextEditorSlot, DevTypographyPanelSlot } from "../components/dev/DevSlots";
import { TextsProvider } from "../components/TextsProvider";
import { LOCALES, OG_LOCALES } from "../lib/i18n";
import { getLocale } from "../lib/locale";
import { getBaseTextsFor, getTextsFor } from "../lib/texts";
import { typographyCss } from "../lib/typography";
import { getTypography } from "../lib/typography-server";
import MotionProvider from "../components/motion/MotionProvider";
import { site } from "../data/site";
import { languageAlternates, siteDescription, siteUrl } from "../lib/metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Une version du site par langue (adresses /… en anglais, /fr/… en français).
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const defaultTitle = `${site.name} | ${getTextsFor(locale)["nav.title"]}`;
  return {
    metadataBase: new URL(siteUrl),
    // "%s" est remplacé par le titre de chaque page : "About | Rayan Houstti".
    title: { default: defaultTitle, template: `%s | ${site.name}` },
    description: siteDescription[locale],
    alternates: languageAlternates("/", locale),
    openGraph: {
      title: defaultTitle,
      description: siteDescription[locale],
      url: "/",
      siteName: site.name,
      type: "website",
      locale: OG_LOCALES[locale],
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  // Langue de la page : "en" ou "fr" (lue dans l'adresse).
  const locale = await getLocale();
  // Textes du site dans cette langue (content/texts.json, content/texts.fr.json),
  // transmis aux composants du navigateur.
  const texts = getTextsFor(locale);
  // Typographie par rôle (content/typography.json) : polices de public/fonts/ et variables CSS.
  const typography = getTypography();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <head>
        {/* Valeurs nettoyées par sanitizeTypography : aucun code ne peut y être injecté */}
        <style id="site-typography" dangerouslySetInnerHTML={{ __html: typographyCss(typography) }} />
      </head>
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-100">
        {/* Lien caché, visible au clavier : permet de sauter directement au contenu */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-neutral-100 focus:px-4 focus:py-2 focus:text-sm focus:text-neutral-950"
        >
          {texts["common.skip"]}
        </a>
        <MotionProvider>
          {/* Sur le site publié, l'adresse email n'est pas envoyée avec les textes :
              elle n'apparaît que sous forme codée (EmailLink), contre le spam. */}
          <TextsProvider
            texts={process.env.NODE_ENV === "development" ? texts : { ...texts, "common.email": "" }}
            locale={locale}
          >
            <Navbar />
            <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
              {children}
            </main>
            <Footer />
            {/* Bannière "Local edit mode" et édition des textes (npm run dev uniquement) */}
            <DevEditBannerSlot />
            <DevTextEditorSlot texts={texts} defaults={getBaseTextsFor(locale)} locale={locale} />
            <DevTypographyPanelSlot typography={typography} />
          </TextsProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
