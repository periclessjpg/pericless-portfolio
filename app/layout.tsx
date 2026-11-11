import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
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

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const defaultTitle = `${site.name} | Concept Artist & Illustrator`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // "%s" est remplacé par le titre de chaque page : "About | Pericless".
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
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-100">
        {/* Lien caché, visible au clavier : permet de sauter directement au contenu */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-neutral-100 focus:px-4 focus:py-2 focus:text-sm focus:text-neutral-950"
        >
          Skip to content
        </a>
        <MotionProvider>
          <Navbar />
          <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}