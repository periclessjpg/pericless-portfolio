import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  GallerySection,
  gallerySectionSlugs,
  gallerySectionTitle,
} from "../../components/GalleryViews";
import LetsTalk from "../../components/LetsTalk";
import { container } from "../../components/styles";
import { pageMetadata } from "../../lib/metadata";

// Une sous-page par carte : /illustration/all + une par sous-dossier de public/artworks/illustration/.
export function generateStaticParams() {
  return gallerySectionSlugs("illustration").map((section) => ({ section }));
}

export async function generateMetadata({
  params,
}: PageProps<"/illustration/[section]">): Promise<Metadata> {
  const { section } = await params;
  const title = gallerySectionTitle("illustration", section);
  if (!title) return { title: "Page not found" };

  return pageMetadata({
    title: `${title} · Illustration`,
    description: `Illustration by Rayan Houstti: ${title}.`,
    path: `/illustration/${section}`,
  });
}

export default async function IllustrationSectionPage({ params }: PageProps<"/illustration/[section]">) {
  const { section } = await params;
  const content = GallerySection({ category: "illustration", slug: section });
  if (!content) notFound();

  return (
    <div className={`${container} pt-28 md:pt-36`}>
      {content}
      <LetsTalk />
    </div>
  );
}
