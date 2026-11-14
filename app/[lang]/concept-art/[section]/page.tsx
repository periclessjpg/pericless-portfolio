import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  GallerySection,
  gallerySectionSlugs,
  gallerySectionTitle,
} from "../../../components/GalleryViews";
import LetsTalk from "../../../components/LetsTalk";
import { container } from "../../../components/styles";
import { pageMetadata } from "../../../lib/metadata";

// Une sous-page par carte : /concept-art/all + une par sous-dossier de public/artworks/concept-art/.
export function generateStaticParams() {
  return gallerySectionSlugs("concept-art").map((section) => ({ section }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/concept-art/[section]">): Promise<Metadata> {
  const { section } = await params;
  const title = await gallerySectionTitle("concept-art", section);
  if (!title) return { title: "404" };

  return pageMetadata({
    title: `${title} · Concept Art`,
    description: { en: `Concept Art by Rayan Houstti: ${title}.`, fr: `Concept art de Rayan Houstti : ${title}.` },
    path: `/concept-art/${section}`,
  });
}

export default async function ConceptArtSectionPage({ params }: PageProps<"/[lang]/concept-art/[section]">) {
  const { section } = await params;
  const content = await GallerySection({ category: "concept-art", slug: section });
  if (!content) notFound();

  return (
    <div className={`${container} pt-28 md:pt-36`}>
      {content}
      <LetsTalk />
    </div>
  );
}
