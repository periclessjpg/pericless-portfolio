import { getCardChoices, getGallery, type Artwork, type GalleryCategory } from "../lib/artworks";
import { getTexts } from "../lib/texts";
import BackButton from "./BackButton";
import { DevDropZoneSlot, DevReorderSlot } from "./dev/DevSlots";
import ComingSoon from "./ComingSoon";
import PageHeader from "./PageHeader";
import ProjectBannerList, { type BannerItem } from "./ProjectBannerList";
import SectionCards, { type SectionCard } from "./SectionCards";

/** Transforme une œuvre en bande pour la liste. */
function toBanner(artwork: Artwork): BannerItem {
  return {
    key: artwork.id,
    title: artwork.title,
    kind: artwork.kind,
    image: { src: artwork.src, alt: artwork.alt, width: artwork.width, height: artwork.height },
    position: artwork.position,
    framingId: artwork.id,
  };
}

/** Éléments du panneau "Reorder" (mode édition local) : nom du fichier, titre, vignette. */
function toReorderItems(artworks: Artwork[]) {
  return artworks.map((artwork) => ({
    key: artwork.id.split("/").pop() ?? artwork.id,
    label: artwork.title,
    src: artwork.src,
  }));
}

/**
 * Image de carte : celle choisie (cards.json, "Choose image" en mode édition local)
 * si elle existe encore parmi les images de la carte, sinon la première (avec son cadrage).
 * Prépare aussi le choix de l'image pour le mode édition local.
 */
function cardImage(
  category: GalleryCategory,
  card: string,
  artworks: Artwork[],
  choices: Record<string, string>,
): Pick<SectionCard, "image" | "position" | "framingId" | "picker"> {
  const chosen = artworks.find((artwork) => artwork.id === choices[card]) ?? artworks[0];
  const picker = {
    category,
    card,
    current: chosen?.id ?? "",
    images: artworks.map((artwork) => ({ id: artwork.id, src: artwork.src, title: artwork.title })),
  };
  if (!chosen) return { picker };
  return {
    image: { src: chosen.src, alt: chosen.alt, width: chosen.width, height: chosen.height },
    position: chosen.position,
    framingId: chosen.id,
    picker,
  };
}

/**
 * Contenu d'une page de catégorie (Concept Art, Illustration) :
 * - s'il existe des sous-dossiers : une carte "All" puis une carte par sous-dossier ;
 * - sinon : directement la liste de toutes les images ;
 * - dossier vide : "Coming soon".
 */
export function GalleryOverview({ category }: { category: GalleryCategory }) {
  const gallery = getGallery(category);
  const filters = gallery.filters.map((filter) => ({ slug: filter.slug, label: filter.label }));

  if (gallery.filters.length === 0) {
    return (
      <>
        {gallery.all.length > 0 ? (
          <ProjectBannerList items={gallery.all.map(toBanner)} preloadFirst />
        ) : (
          <ComingSoon folder={`${gallery.folder}all/`} />
        )}
        {/* Mode édition local (npm run dev uniquement) */}
        <DevDropZoneSlot
          category={category}
          categoryLabel={gallery.label}
          filters={filters}
          defaultFilter="all"
          variant="banner"
        />
        <DevReorderSlot
          type="images"
          category={category}
          filter="all"
          title={gallery.label}
          items={toReorderItems(gallery.allFolder)}
        />
      </>
    );
  }

  // Image de chaque carte : choix enregistré dans public/artworks/<catégorie>/cards.json.
  const choices = getCardChoices(category);
  const cards: SectionCard[] = [
    {
      key: "all",
      href: `/${category}/all`,
      title: getTexts()["common.all"],
      titleKey: "common.all",
      ...cardImage(category, "all", gallery.all, choices),
    },
    ...gallery.filters.map((filter) => ({
      key: filter.slug,
      href: `/${category}/${filter.slug}`,
      title: filter.label,
      ...cardImage(category, filter.slug, filter.artworks, choices),
    })),
  ];
  return (
    <>
      <SectionCards cards={cards} />
      {/* Mode édition local (npm run dev uniquement) */}
      <DevDropZoneSlot
        category={category}
        categoryLabel={gallery.label}
        filters={filters}
        defaultFilter="all"
        variant="card"
      />
      <DevReorderSlot
        type="filters"
        category={category}
        title={`${gallery.label} cards`}
        items={gallery.filters.map((filter) => ({
          key: filter.slug,
          label: filter.label,
          src: filter.artworks[0]?.src,
        }))}
      />
    </>
  );
}

/** Adresses des sous-pages d'une catégorie : "all" + un par sous-dossier. */
export function gallerySectionSlugs(category: GalleryCategory) {
  return ["all", ...getGallery(category).filters.map((filter) => filter.slug)];
}

/** Titre d'une sous-page, ou undefined si elle n'existe pas. */
export function gallerySectionTitle(category: GalleryCategory, slug: string) {
  if (slug === "all") return getTexts()["common.all"];
  return getGallery(category).filters.find((filter) => filter.slug === slug)?.label;
}

/**
 * Contenu d'une sous-page (ex. /concept-art/character-design) :
 * bouton Back, titre, puis la liste des images du filtre.
 * Renvoie null si la sous-page n'existe pas (la page affiche alors une 404).
 */
export function GallerySection({ category, slug }: { category: GalleryCategory; slug: string }) {
  const gallery = getGallery(category);
  const filter = gallery.filters.find((f) => f.slug === slug);
  if (slug !== "all" && !filter) return null;

  const title = filter ? filter.label : getTexts()["common.all"];
  const artworks = filter ? filter.artworks : gallery.all;
  const folder = filter ? filter.folder : `${gallery.folder}all/`;

  return (
    <>
      <div className="mb-12 md:mb-16">
        <BackButton fallbackHref={`/${category}`} />
      </div>
      <PageHeader label={gallery.label} title={title} keys={filter ? {} : { title: "common.all" }} />
      {artworks.length > 0 ? (
        <ProjectBannerList items={artworks.map(toBanner)} preloadFirst />
      ) : (
        <ComingSoon folder={folder} />
      )}
      {/* Mode édition local (npm run dev uniquement) : dépôt dans le filtre de cette page */}
      <DevDropZoneSlot
        category={category}
        categoryLabel={gallery.label}
        filters={gallery.filters.map((f) => ({ slug: f.slug, label: f.label }))}
        defaultFilter={filter ? filter.slug : "all"}
        variant="banner"
      />
      <DevReorderSlot
        type="images"
        category={category}
        filter={filter ? filter.slug : "all"}
        title={title}
        items={toReorderItems(filter ? filter.artworks : gallery.allFolder)}
        note={
          filter
            ? undefined
            : "Here you reorder the images of the “all” folder. Images of each filter are reordered on their own page; “All” shows them in card order."
        }
      />
    </>
  );
}
