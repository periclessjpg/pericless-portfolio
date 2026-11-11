import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BackButton from "../../components/BackButton";
import Reveal from "../../components/motion/Reveal";
import { container, eyebrow, focusRing } from "../../components/styles";
import {
  getAdjacentProjects,
  getProject,
  isSvg,
  projects,
  type ProjectImage,
} from "../../data/projects";
import { pageMetadata } from "../../lib/metadata";

// Génère à l'avance une page par projet de app/data/projects.ts.
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };

  return pageMetadata({
    title: project.title,
    description: project.summary,
    path: `/projects/${project.slug}`,
    // Les réseaux sociaux n'affichent pas les SVG : on ne partage que les vraies images.
    image: isSvg(project.cover.src) ? undefined : project.cover,
  });
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { previous, next } = getAdjacentProjects(project.slug);
  // Si le visiteur arrive directement sur le projet, "Back" mène à sa rubrique.
  const sectionHref = project.category === "Illustration" ? "/illustration" : "/concept-art";

  return (
    <article className="pt-28 md:pt-36">
      <div className={`${container} mb-12 md:mb-16`}>
        <BackButton fallbackHref={sectionHref} />
      </div>

      {/* En-tête du projet */}
      <header className={`${container} mb-16 grid gap-12 md:mb-24 md:grid-cols-12`}>
        <Reveal className="md:col-span-7">
          <p className={eyebrow}>
            {project.category} · {project.year}
          </p>
          <h1 className="mt-6 font-display text-5xl font-medium leading-none tracking-tight sm:text-6xl md:text-8xl">
            {project.title}
          </h1>
        </Reveal>

        <Reveal delay={0.15} className="flex flex-col gap-10 md:col-span-4 md:col-start-9 md:pt-10">
          <p className="text-lg leading-relaxed text-neutral-300">{project.summary}</p>
          <dl className="grid grid-cols-2 gap-6 border-t border-neutral-800 pt-6 text-sm">
            <div>
              <dt className="text-neutral-500">Category</dt>
              <dd className="mt-1 text-neutral-100">{project.category}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Year</dt>
              <dd className="mt-1 text-neutral-100">{project.year}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-neutral-500">Tools</dt>
              <dd className="mt-1 text-neutral-100">{project.tools.join(", ")}</dd>
            </div>
          </dl>
        </Reveal>
      </header>

      {/* Images en grand format */}
      <div className={`${container} flex flex-col gap-16 md:gap-24`}>
        {project.images.map((image, index) => (
          <ProjectFigure key={`${image.src}-${index}`} image={image} preload={index === 0} />
        ))}
      </div>

      {/* Projet précédent / suivant */}
      <nav
        aria-label="More projects"
        className={`${container} mt-32 grid gap-px border-y border-neutral-900 sm:grid-cols-2`}
      >
        {previous && (
          <Link
            href={`/projects/${previous.slug}`}
            className={`group py-10 sm:pr-8 ${focusRing}`}
          >
            <span className={eyebrow}>← Previous project</span>
            <span className="mt-3 block font-display text-3xl text-neutral-400 transition-colors duration-500 group-hover:text-neutral-100 md:text-4xl">
              {previous.title}
            </span>
          </Link>
        )}
        {next && (
          <Link
            href={`/projects/${next.slug}`}
            className={`group py-10 sm:pl-8 sm:text-right ${focusRing}`}
          >
            <span className={eyebrow}>Next project →</span>
            <span className="mt-3 block font-display text-3xl text-neutral-400 transition-colors duration-500 group-hover:text-neutral-100 md:text-4xl">
              {next.title}
            </span>
          </Link>
        )}
      </nav>

      <div className={`${container} mt-12`}>
        <Link
          href="/projects"
          className={`text-sm text-neutral-400 underline decoration-neutral-700 underline-offset-8 transition-colors duration-300 hover:text-neutral-100 hover:decoration-neutral-100 ${focusRing}`}
        >
          All projects
        </Link>
      </div>
    </article>
  );
}

/**
 * Une image du projet, affichée en entier (jamais recadrée).
 * Les images horizontales prennent toute la largeur ; les images verticales ou
 * carrées sont limitées à la hauteur de l'écran pour rester visibles d'un coup d'œil.
 */
function ProjectFigure({ image, preload }: { image: ProjectImage; preload: boolean }) {
  const landscape = image.width > image.height;

  return (
    <Reveal>
      <figure>
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          preload={preload}
          unoptimized={isSvg(image.src)}
          sizes={landscape ? "(min-width: 1536px) 1408px, 100vw" : "(min-width: 768px) 90vh, 100vw"}
          className={
            landscape
              ? "h-auto w-full bg-neutral-900"
              : "mx-auto h-auto max-h-[90svh] w-auto max-w-full bg-neutral-900"
          }
        />
        {image.caption && (
          <figcaption className="mt-4 text-sm text-neutral-500">{image.caption}</figcaption>
        )}
      </figure>
    </Reveal>
  );
}
