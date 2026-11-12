"use client";

import { useState } from "react";
import type { Artwork } from "../lib/artworks";
import ArtworkGrid from "./ArtworkGrid";
import { focusRing } from "./styles";

type Props = {
  artworks: Artwork[];
  /** Noms des filtres proposés après "All" (ex. "Concept Art", "Illustration"). */
  categories: string[];
};

/** Boutons All + une catégorie par bouton, puis la grille d'œuvres filtrée. */
export default function ArtworkFilter({ artworks, categories }: Props) {
  const filters = ["All", ...categories];
  const [active, setActive] = useState("All");
  const visible = active === "All" ? artworks : artworks.filter((a) => a.category === active);

  return (
    <div>
      <div
        role="group"
        aria-label="Filter artworks by category"
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
        {visible.length} {visible.length === 1 ? "artwork" : "artworks"} shown
      </p>

      {/* key={active} : la cascade d'apparition se rejoue à chaque changement de filtre */}
      <ArtworkGrid key={active} artworks={visible} preloadFirst />
    </div>
  );
}
