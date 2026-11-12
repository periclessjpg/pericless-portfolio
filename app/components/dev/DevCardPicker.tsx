"use client";

// MODE ÉDITION LOCAL : bouton "Choose image" sur une carte (uniquement pendant `npm run dev`).
// Ouvre les vignettes des images de la carte ; un clic choisit l'image affichée sur la carte
// (enregistrée dans public/artworks/<catégorie>/cards.json via /api/dev/card).

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { focusRing } from "../styles";
import { useToolsVisible } from "./edit-mode-store";

export type DevCardPickerProps = {
  category: "concept-art" | "illustration";
  /** Carte : "all" ou l'adresse d'un filtre. */
  card: string;
  /** Image affichée actuellement (chemin dans public/artworks). */
  current: string;
  /** Images possibles pour cette carte. */
  images: { id: string; src: string; title: string }[];
};

const buttonClass = `rounded-full bg-neutral-950/85 px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.2em] text-neutral-100 backdrop-blur-sm hover:bg-neutral-900 disabled:opacity-50 ${focusRing}`;

export default function DevCardPicker({ category, card, current, images }: DevCardPickerProps) {
  const router = useRouter();
  const visible = useToolsVisible();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Échap ferme la liste.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!visible || images.length === 0) return null;

  async function choose(image: string | null) {
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/dev/card", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-dev-upload": "1" },
        body: JSON.stringify({ category, card, image }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Could not save");
        return;
      }
      setOpen(false);
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="absolute left-3 top-3 z-20">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className={buttonClass}>
        Choose image
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Choose the card image"
          className="mt-2 w-72 rounded-md border border-dashed border-amber-400/50 bg-neutral-950/95 p-3 backdrop-blur-md"
        >
          <div className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto">
            {images.map((image) => (
              <button
                key={image.id}
                type="button"
                onClick={() => choose(image.id)}
                disabled={saving}
                aria-pressed={image.id === current}
                aria-label={`Use ${image.title}`}
                title={image.title}
                className={`relative aspect-[4/5] overflow-hidden rounded-sm ${focusRing} ${
                  image.id === current ? "ring-2 ring-amber-300" : "opacity-80 hover:opacity-100"
                }`}
              >
                {/* Vignette : <img> simple, outil de développement uniquement */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.src} alt="" className="absolute inset-0 h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => choose(null)} disabled={saving} className={buttonClass}>
              First image
            </button>
            <button type="button" onClick={() => setOpen(false)} className={buttonClass}>
              Close
            </button>
          </div>
          {error && (
            <p role="alert" className="mt-2 text-xs text-red-400">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
