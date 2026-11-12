import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { DevEditBannerSlot, DevTextEditorSlot, DevTypographyPanelSlot } from "./components/dev/DevSlots";
import { TextsProvider } from "./components/TextsProvider";
import { getTexts } from "./lib/texts";
import { typographyCss } from "./lib/typography";
import { getTypography } from "./lib/typography-server";
import MotionProvider from "./components/motion/MotionProvider";
import { site } from "./data/site";
import { siteUrl } from "./lib/metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const defaultTitle = `${site.name} | Concept Artist & Illustrator`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // "%s" est remplacé par le titre de chaque page : "About | Rayan Houstti".
  title: { default: defaultTitle, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: {
    title: defaultTitle,
    description: site.description,
    url: "/",
    siteName: site.name,
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // Textes du site (content/texts.json), transmis aux composants du navigateur.
  const texts = getTexts();
  // Typographie par rôle (content/typography.json) : polices de public/fonts/ et variables CSS.
  const typography = getTypography();

  return (
    <html
      lang="en"
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
          Skip to content
        </a>
        <MotionProvider>
          <TextsProvider texts={texts}>
            <Navbar />
            <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
              {children}
            </main>
            <Footer />
            {/* Bannière "Local edit mode" et édition des textes (npm run dev uniquement) */}
            <DevEditBannerSlot />
            <DevTextEditorSlot texts={texts} />
            <DevTypographyPanelSlot typography={typography} />
          </TextsProvider>
        </MotionProvider>
      </body>
    </html>
  );
}