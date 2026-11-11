import type { Project } from "../data/projects";
import ProjectCard from "./ProjectCard";
import { StaggerItem, StaggerList } from "./motion/Stagger";

type Props = {
  projects: Project[];
  /** 2 colonnes (grandes vignettes) ou 3 colonnes sur grand écran. */
  columns?: 2 | 3;
  headingLevel?: "h2" | "h3";
  /** Précharge la première image (à utiliser si la grille est en haut de page). */
  preloadFirst?: boolean;
};

const layouts = {
  2: {
    grid: "grid-cols-1 md:grid-cols-2",
    sizes: "(min-width: 768px) 50vw, 100vw",
  },
  3: {
    grid: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    sizes: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  },
};

export default function ProjectGrid({
  projects,
  columns = 3,
  headingLevel = "h3",
  preloadFirst = false,
}: Props) {
  const layout = layouts[columns];

  if (projects.length === 0) {
    return <p className="text-neutral-500">No projects yet.</p>;
  }

  return (
    <StaggerList className={`grid gap-x-8 gap-y-16 md:gap-x-12 md:gap-y-24 ${layout.grid}`}>
      {projects.map((project, index) => (
        <StaggerItem key={project.slug}>
          <ProjectCard
            project={project}
            sizes={layout.sizes}
            headingLevel={headingLevel}
            preload={preloadFirst && index === 0}
          />
        </StaggerItem>
      ))}
    </StaggerList>
  );
}
