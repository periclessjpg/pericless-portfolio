import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BackButton from "../../components/BackButton";
import LetsTalk from "../../components/LetsTalk";
import PageHeader from "../../components/PageHeader";
import ProjectBannerList from "../../components/ProjectBannerList";
import { container } from "../../components/styles";
import { conceptArtSections, getConceptArtSection } from "../../data/concept-art";
import { projects } from "../../data/projects";
import { pageMetadata } from "../../lib/metadata";

// Une sous-page par carte : /concept-art/character-design, /environment, /all.
export function generateStaticParams() {
  return conceptArtSections.map((section) => ({ section: section.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/concept-art/[section]">): Promise<Metadata> {
  const { section: slug } = await params;
  const section = getConceptArtSection(slug);
  if (!section) return { title: "Page not found" };

  return pageMetadata({
    title: `${section.title} · Concept Art`,
    description: `Concept art by Rayan Houstti: ${section.title.toLowerCase()} projects.`,
    path: `/concept-art/${section.slug}`,
  });
}

export default async function ConceptArtSectionPage({
  params,
}: PageProps<"/concept-art/[section]">) {
  const { section: slug } = await params;
  const section = getConceptArtSection(slug);
  if (!section) notFound();

  // Projets de la carte (y compris les travaux en cours), dans l'ordre du fichier de données.
  const sectionProjects = projects.filter((p) => section.categories.includes(p.category));

  return (
    <div className={`${container} pt-28 md:pt-36`}>
      <div className="mb-12 md:mb-16">
        <BackButton fallbackHref="/concept-art" />
      </div>
      <PageHeader label="Concept Art" title={section.title}>
        <p>{section.intro}</p>
      </PageHeader>
      <ProjectBannerList projects={sectionProjects} preloadFirst />
      <LetsTalk />
    </div>
  );
}
