"use client";

// Adresse email protégée contre les robots qui récoltent les adresses pour envoyer du spam.
// La page ne contient qu'une version codée (base64 de l'adresse à l'envers) ; l'adresse
// lisible et le lien mailto: n'apparaissent qu'une fois la page affichée dans un vrai
// navigateur. Les visiteurs ne voient aucune différence. Utilisé via EmailLink.tsx.

import { useSyncExternalStore, type HTMLAttributes } from "react";

/** false pendant le rendu côté serveur, true une fois la page affichée dans le navigateur. */
function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function decode(code: string): string {
  try {
    return atob(code).split("").reverse().join("");
  } catch {
    return "";
  }
}

type Props = {
  /** Adresse codée par encodeEmail (EmailLink.tsx). */
  code: string;
  className?: string;
  /** Autres attributs (ex. data-text-key en mode édition local). */
  attributes?: HTMLAttributes<HTMLElement> & Record<string, string>;
};

export default function ProtectedEmail({ code, className = "", attributes }: Props) {
  const mounted = useMounted();
  const email = mounted ? decode(code) : "";

  // Avant l'affichage dans le navigateur : espace réservé invisible (évite un saut de mise en page).
  if (!email) {
    return (
      <span aria-hidden="true" className={`${className} invisible`}>
        email
      </span>
    );
  }

  return (
    <a href={`mailto:${email}`} className={className} {...attributes}>
      {email}
    </a>
  );
}
