import { getGallery, type Artwork, type GalleryCategory } from "../lib/artworks";
import BackButton from "./BackButton";
import { DevDropZoneSlot } from "./dev/DevSlots";
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

/** Image de carte : la première œuvre de la liste (avec son cadrage). */
function cardImage(artworks: Artwork[]): Pick<SectionCard, "image" | "position" | "framingId"> {
  const first = artworks[0];
  if (!first) return {};
  return {
    image: { src: first.src, alt: first.alt, width: first.width, height: first.height },
    position: first.position,
    framingId: first.id,
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
      </>
    );
  }

  const cards: SectionCard[] = [
    { key: "all", href: `/${category}/all`, title: "All", ...cardImage(gallery.all) },
    ...gallery.filters.map((filter) => ({
      key: filter.slug,
      href: `/${category}/${filter.slug}`,
      title: filter.label,
      ...cardImage(filter.artworks),
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
    </>
  );
}

/** Adresses des sous-pages d'une catégorie : "all" + un par sous-dossier. */
export function gallerySectionSlugs(category: GalleryCategory) {
  return ["all", ...getGallery(category).filters.map((filter) => filter.slug)];
}

/** Titre d'une sous-page, ou undefined si elle n'existe pas. */
export function gallerySectionTitle(category: GalleryCategory, slug: string) {
  if (slug === "all") return "All";
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

  const title = filter ? filter.label : "All";
  const artworks = filter ? filter.artworks : gallery.all;
  const folder = filter ? filter.folder : `${gallery.folder}all/`;

  return (
    <>
      <div className="mb-12 md:mb-16">
        <BackButton fallbackHref={`/${category}`} />
      </div>
      <PageHeader label={gallery.label} title={title} />
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
    </>
  );
}
