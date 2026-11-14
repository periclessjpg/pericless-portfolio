"use client";

// MODE ÉDITION LOCAL : aperçu téléphone (bouton "Phone" de la bannière "Local edit mode").
// Affiche le site dans un cadre de 390 × 844 px (taille d'un iPhone récent) par-dessus la page.
// Dans ce cadre, la page se comporte exactement comme sur un téléphone : les outils
// "Adjust framing" et "Customize hero" y règlent les versions téléphone.
// À la fermeture, la page derrière est rechargée pour montrer les changements.

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { focusRing, label } from "../styles";

const buttonClass = `rounded-full border border-neutral-700 bg-neutral-950 px-4 py-2 text-xs uppercase tracking-[0.2em] text-neutral-200 hover:border-neutral-100 hover:text-neutral-100 ${focusRing}`;

export default function DevPhonePreview({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  // Page ouverte dans le cadre : celle affichée au moment de l'ouverture.
  const [src] = useState(() => `${window.location.pathname}${window.location.search}`);

  // Bloque le défilement de la page derrière ; Échap ferme l'aperçu.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  });

  function close() {
    onClose();
    router.refresh();
  }

  // Affiché directement dans la page (pas dans la bannière, dont le flou limiterait l'aperçu).
  return createPortal(
    <div
      role="dialog"
      aria-label="Phone preview (local edit mode)"
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-4 bg-neutral-950/90 p-4 backdrop-blur-sm"
    >
      <div className="flex items-center gap-4">
        <p className={`${label} text-amber-200`}>Phone preview · 390 × 844</p>
        <button type="button" onClick={close} className={buttonClass}>
          Close
        </button>
      </div>
      <iframe
        src={src}
        title="Phone preview"
        className="w-[390px] max-w-full flex-none rounded-[2rem] border-4 border-neutral-700 bg-neutral-950 shadow-2xl"
        style={{ height: "min(844px, calc(100svh - 7rem))" }}
      />
      <p className="max-w-md text-center text-xs text-neutral-500">
        Framing and hero settings made here apply to phones only. Navigate freely inside the phone.
      </p>
    </div>,
    document.body,
  );
}
