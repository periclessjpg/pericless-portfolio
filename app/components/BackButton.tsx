"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { hasPreviousPageOnSite } from "../lib/navigation-history";
import { focusRing } from "./styles";

type Props = {
  /** Page où aller si le visiteur est arrivé directement sur cette page. */
  fallbackHref: string;
};

/**
 * Bouton "Back" : revient à la page précédente du site (accueil, Concept Art…).
 * Si le visiteur est arrivé directement ici (lien partagé), va vers fallbackHref.
 */
export default function BackButton({ fallbackHref }: Props) {
  const router = useRouter();

  return (
    <Link
      href={fallbackHref}
      onClick={(event) => {
        if (hasPreviousPageOnSite()) {
          event.preventDefault();
          router.back();
        }
      }}
      className={`group inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 transition-colors duration-300 hover:text-neutral-100 sm:text-sm sm:tracking-[0.3em] ${focusRing}`}
    >
      <span
        aria-hidden="true"
        className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
      >
        ←
      </span>
      Back
    </Link>
  );
}
