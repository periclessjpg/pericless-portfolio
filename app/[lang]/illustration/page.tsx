import { GalleryOverview } from "../../components/GalleryViews";
import LetsTalk from "../../components/LetsTalk";
import { container } from "../../components/styles";
import { pageMetadata } from "../../lib/metadata";
import { getTexts } from "../../lib/texts";

export async function generateMetadata() {
  return pageMetadata({
    title: "Illustration",
    description: { en: "Illustrations by Rayan Houstti.", fr: "Illustrations de Rayan Houstti." },
    path: "/illustration",
  });
}

export default async function IllustrationPage() {
  const t = await getTexts();
  return (
    <div className={container}>
      {/* Titre invisible à l'écran, lu par Google et les lecteurs d'écran */}
      <h1 className="sr-only">{t["illustration.title"]}</h1>

      {/* Images de public/artworks/illustration/ (cartes dès qu'il y a des sous-dossiers).
          L'espace au-dessus place la première ligne d'images (format 4:3) au milieu de l'écran :
          50 % de la hauteur de l'écran moins la moitié de la hauteur d'une ligne,
          avec un minimum pour rester sous la barre du haut.
          - mobile : une image par ligne (marges de 3rem, puis 4rem) ;
          - ordinateur : deux images par ligne (marges de 8rem, espace de 0,5rem entre elles). */}
      <section
        aria-label={t["illustration.title"]}
        className="pt-[max(7rem,calc(50svh_-_(100vw_-_3rem)*0.375))] sm:pt-[max(7rem,calc(50svh_-_(100vw_-_4rem)*0.375))] md:pt-[max(8rem,calc(50svh_-_(min(100vw,96rem)_-_8.5rem)*0.1875))]"
      >
        <GalleryOverview category="illustration" centered />
      </section>

      <LetsTalk />
    </div>
  );
}
