"use client";

import { useState } from "react";
import { categories, type Category, type Project } from "../data/projects";
import ProjectGrid from "./ProjectGrid";
import ProjectList from "./ProjectList";
import { focusRing } from "./styles";

type Filter = "All" | Category;

type Props = {
  projects: Project[];
  /** Catégories proposées dans le filtre (par défaut : toutes). */
  filterBy?: Category[];
  /** "grid" : grille de vignettes ; "list" : liste verticale (Concept Art). */
  layout?: "grid" | "list";
};

/** Boutons All + une catégorie par bouton, puis la grille ou la liste filtrée. */
export default function CategoryFilter({
  projects,
  filterBy = categories,
  layout = "grid",
}: Props) {
  const filters: Filter[] = ["All", ...filterBy];
  const [active, setActive] = useState<Filter>("All");
  const visible =
    active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <div>
      <div
        role="group"
        aria-label="Filter projects by category"
        className="mb-12 flex flex-wrap gap-x-8 gap-y-3 md:mb-16"
      >
        {filters.map((filter) => {
          const selected = filter === active;
          return (
            <button
              key={filter}
              type="button"
              aria-pressed={selected}
              onClick={() => setActive(filter)}
              className={`border-b pb-1 text-sm transition-colors duration-300 ${focusRing} ${
                selected
                  ? "border-neutral-100 text-neutral-100"
                  : "border-transparent text-neutral-500 hover:text-neutral-100"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* Annonce le résultat aux lecteurs d'écran */}
      <p aria-live="polite" className="sr-only">
        {visible.length} {visible.length === 1 ? "project" : "projects"} shown
      </p>

      {/* key={active} : la cascade d'apparition se rejoue à chaque changement de filtre */}
      {layout === "list" ? (
        <ProjectList key={active} projects={visible} preloadFirst />
      ) : (
        <ProjectGrid key={active} projects={visible} columns={3} headingLevel="h2" preloadFirst />
      )}
    </div>
  );
}
