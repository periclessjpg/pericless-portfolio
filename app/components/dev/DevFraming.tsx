"use client";

// MODE ÉDITION LOCAL : barre d'outils posée sur chaque image (uniquement pendant `npm run dev`) :
// - "Adjust framing" : un clic sur l'image choisit la zone à garder visible, "Save" l'enregistre
//   dans infos.json via /api/dev/position ;
// - "Replace" : remplace l'image par une nouvelle (même place, même titre) via /api/dev/replace ;
// - "Delete" : après confirmation, déplace l'image dans la corbeille .artworks-trash/ via /api/dev/delete.

import { useRouter } from "next/navigation";
import { useRef, useState, type ChangeEvent, type KeyboardEvent, type MouseEvent } from "react";
import { focusRing } from "../styles";
import { useToolsVisible } from "./edit-mode-store";

export type DevFramingProps = {
  /** Chemin de l'image dans public/artworks (ex. "home/01-hero.webp"). */
  id: string;
  /** Adresse de l'image (pour l'aperçu en direct). */
  src: string;
  /** Cadrage actuel, ex. "50% 20%" (centre par défaut). */
  position?: string;
  /** false pour une image jamais recadrée (pas de bouton "Adjust framing"). */
  framing?: boolean;
};

function parse(position?: string) {
  const match = /^(\d+(?:\.\d+)?)% (\d+(?:\.\d+)?)%$/.exec(position ?? "");
  return match ? { x: Number(match[1]), y: Number(match[2]) } : { x: 50, y: 50 };
}

const buttonClass = `rounded-full bg-neutral-950/85 px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.2em] text-neutral-100 backdrop-blur-sm hover:bg-neutral-900 disabled:opacity-50 ${focusRing}`;

export default function DevFraming({ id, src, position, framing = true }: DevFramingProps) {
  const router = useRouter();
  const visible = useToolsVisible();
  const [editing, setEditing] = useState(false);
  const [point, setPoint] = useState(() => parse(position));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState("");
  const replaceInput = useRef<HTMLInputElement>(null);

  if (!visible) return null;

  function start() {
    setPoint(parse(position));
    setError("");
    setEditing(true);
  }

  function pick(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setPoint({
      x: Math.round(Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100))),
      y: Math.round(Math.min(100, Math.max(0, ((event.clientY - rect.top) / rect.height) * 100))),
    });
  }

  // Flèches du clavier : déplace la zone par pas de 5 %.
  function nudge(event: KeyboardEvent<HTMLDivElement>) {
    const step = 5;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    if (event.key === "Escape") {
      setEditing(false);
      return;
    }
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    setPoint((p) => ({
      x: Math.min(100, Math.max(0, p.x + move[0])),
      y: Math.min(100, Math.max(0, p.y + move[1])),
    }));
  }

  async function save(reset = false) {
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/dev/position", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-dev-upload": "1" },
        body: JSON.stringify(reset ? { id, reset: true } : { id, x: point.x, y: point.y }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Could not save");
        return;
      }
      setEditing(false);
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  // Supprimer : l'image part dans la corbeille .artworks-trash/ (récupérable).
  async function remove() {
    setBusy("Deleting…");
    setError("");
    try {
      const response = await fetch("/api/dev/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-dev-upload": "1" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Could not delete");
        return;
      }
      setConfirmDelete(false);
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setBusy("");
    }
  }

  // Remplacer : la nouvelle image prend la place de l'ancienne (même numéro, même titre).
  async function replace(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
      setError("File larger than 25 MB");
      return;
    }
    setBusy("Replacing…");
    setError("");
    try {
      const form = new FormData();
      form.append("id", id);
      form.append("files", file);
      const response = await fetch("/api/dev/replace", {
        method: "POST",
        headers: { "x-dev-upload": "1" },
        body: form,
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Could not replace");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setBusy("");
    }
  }

  if (!editing) {
    return (
      <>
        <div className="absolute right-3 top-3 z-20 flex flex-wrap justify-end gap-2">
          {busy ? (
            <span className={buttonClass}>{busy}</span>
          ) : confirmDelete ? (
            <>
              <span className="rounded-full bg-neutral-950/85 px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.2em] text-red-300">
                Delete this image?
              </span>
              <button type="button" onClick={remove} className={`${buttonClass} text-red-300`}>
                Yes, delete
              </button>
              <button type="button" onClick={() => setConfirmDelete(false)} className={buttonClass}>
                No
              </button>
            </>
          ) : (
            <>
              {framing && (
                <button type="button" onClick={start} className={buttonClass}>
                  Adjust framing
                </button>
              )}
              <button type="button" onClick={() => replaceInput.current?.click()} className={buttonClass}>
                Replace
              </button>
              <button type="button" onClick={() => setConfirmDelete(true)} className={buttonClass}>
                Delete
              </button>
            </>
          )}
          <input
            ref={replaceInput}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.avif"
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            onChange={replace}
          />
        </div>
        {error && (
          <p
            role="alert"
            className="absolute bottom-3 left-3 z-20 rounded-full bg-neutral-950/85 px-3 py-1.5 text-xs text-red-400"
          >
            {error}
          </p>
        )}
      </>
    );
  }

  return (
    <div className="absolute inset-0 z-20">
      {/* Aperçu en direct du nouveau cadrage, par-dessus l'image */}
      <div
        role="application"
        tabIndex={0}
        aria-label="Click on the part of the image to keep visible. Arrow keys move it, Escape cancels."
        onClick={pick}
        onKeyDown={nudge}
        className="absolute inset-0 cursor-crosshair outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-amber-300"
        style={{
          backgroundImage: `url("${src}")`,
          backgroundSize: "cover",
          backgroundPosition: `${point.x}% ${point.y}%`,
        }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-amber-300 shadow-[0_0_0_2px_rgba(0,0,0,0.6)]"
          style={{ left: `${point.x}%`, top: `${point.y}%` }}
        />
      </div>

      <div className="absolute right-3 top-3 flex flex-wrap justify-end gap-2">
        <span className="rounded-full bg-neutral-950/85 px-3 py-1.5 text-[0.65rem] tabular-nums text-amber-200">
          {point.x}% {point.y}%
        </span>
        <button type="button" onClick={() => save()} disabled={saving} className={buttonClass}>
          Save
        </button>
        <button type="button" onClick={() => save(true)} disabled={saving} className={buttonClass}>
          Reset
        </button>
        <button type="button" onClick={() => setEditing(false)} disabled={saving} className={buttonClass}>
          Cancel
        </button>
      </div>
      {error && (
        <p role="alert" className="absolute bottom-3 left-3 rounded-full bg-neutral-950/85 px-3 py-1.5 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
