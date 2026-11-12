"use client";

// MODE ÉDITION LOCAL : bouton "Reorder" + panneau de vignettes à glisser
// (uniquement pendant `npm run dev`). "Save" renumérote les fichiers (ou les dossiers
// pour les cartes) via /api/dev/reorder, puis la page se met à jour.

import { Reorder, useDragControls } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { focusRing, label } from "../styles";
import { useToolsVisible } from "./edit-mode-store";

export type ReorderItem = {
  /** Nom du fichier (images) ou adresse du filtre (cartes). */
  key: string;
  /** Texte affiché (titre de l'image ou nom de la carte). */
  label: string;
  /** Vignette (facultative). */
  src?: string;
};

export type DevReorderProps = {
  /** "images" : ordre des images d'un dossier ; "filters" : ordre des cartes. */
  type: "images" | "filters";
  category: "concept-art" | "illustration" | "home" | "about";
  /** Filtre du dossier d'images ("all", une adresse de filtre, ou "" pour home/about). */
  filter?: string;
  /** Titre du panneau (ex. "Selected Works"). */
  title: string;
  items: ReorderItem[];
  /** Note facultative affichée en haut du panneau. */
  note?: string;
};

const buttonClass = `rounded-full border border-neutral-700 px-4 py-2 text-xs uppercase tracking-[0.2em] text-neutral-200 transition-colors hover:border-neutral-100 hover:text-neutral-100 disabled:opacity-40 ${focusRing}`;
const smallButton = `flex size-7 items-center justify-center rounded-full border border-neutral-700 text-xs text-neutral-300 hover:border-neutral-100 hover:text-neutral-100 disabled:opacity-30 ${focusRing}`;

/** Une ligne du panneau : poignée à glisser, vignette, nom, flèches ↑ ↓. */
function Row({
  item,
  index,
  total,
  move,
}: {
  item: ReorderItem;
  index: number;
  total: number;
  move: (from: number, to: number) => void;
}) {
  const controls = useDragControls();
  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      className="flex select-none items-center gap-3 rounded-md border border-neutral-800 bg-neutral-900 p-2"
    >
      <button
        type="button"
        aria-label={`Drag ${item.label}`}
        onPointerDown={(event) => controls.start(event)}
        className="cursor-grab touch-none px-1 text-lg leading-none text-neutral-500 active:cursor-grabbing"
      >
        ≡
      </button>
      {item.src && (
        // Vignette locale : <img> simple, outil de développement uniquement
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.src} alt="" className="h-12 w-16 shrink-0 rounded-sm object-cover" draggable={false} />
      )}
      <span className="min-w-0 flex-1 truncate text-xs text-neutral-200">
        <span className="mr-2 tabular-nums text-neutral-500">{String(index + 1).padStart(2, "0")}</span>
        {item.label}
      </span>
      <button
        type="button"
        onClick={() => move(index, index - 1)}
        disabled={index === 0}
        aria-label={`Move ${item.label} up`}
        className={smallButton}
      >
        ↑
      </button>
      <button
        type="button"
        onClick={() => move(index, index + 1)}
        disabled={index === total - 1}
        aria-label={`Move ${item.label} down`}
        className={smallButton}
      >
        ↓
      </button>
    </Reorder.Item>
  );
}

export default function DevReorder({ type, category, filter = "", title, items, note }: DevReorderProps) {
  const router = useRouter();
  const visible = useToolsVisible();
  const [open, setOpen] = useState(false);
  const [list, setList] = useState(items);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Échap ferme le panneau sans enregistrer.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!visible || items.length < 2) return null;

  function move(from: number, to: number) {
    if (to < 0 || to >= list.length) return;
    setList((current) => {
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/dev/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-dev-upload": "1" },
        body: JSON.stringify({ type, category, filter, order: list.map((item) => item.key) }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error ?? "Could not save");
        return;
      }
      setOpen(false);
      router.refresh();
    } catch {
      setMessage("Network error");
    } finally {
      setSaving(false);
    }
  }

  const changed = list.some((item, index) => item.key !== items[index]?.key);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setList(items);
          setMessage("");
          setOpen(true);
        }}
        className={`mt-6 ${buttonClass} border-dashed border-amber-400/60 text-amber-100`}
      >
        {type === "filters" ? "Reorder cards" : "Reorder images"}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={`Reorder ${title} (local edit mode)`}
          className="fixed bottom-4 right-4 top-24 z-[65] flex w-[min(24rem,calc(100vw-2rem))] flex-col rounded-md border border-dashed border-amber-400/50 bg-neutral-950/95 backdrop-blur-md"
        >
          <div className="flex items-center justify-between gap-3 border-b border-neutral-800 p-4">
            <p className={`${label} truncate text-amber-200`}>Reorder · {title}</p>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close without saving" className={smallButton}>
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <p className="mb-4 text-[0.7rem] text-neutral-500">
              Drag with ≡ (or use ↑ ↓), then Save.{type === "filters" ? " “All” always stays first." : ""}
              {note ? ` ${note}` : ""}
            </p>
            <Reorder.Group axis="y" values={list} onReorder={setList} className="flex flex-col gap-2">
              {list.map((item, index) => (
                <Row key={item.key} item={item} index={index} total={list.length} move={move} />
              ))}
            </Reorder.Group>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-neutral-800 p-4">
            <button
              type="button"
              onClick={save}
              disabled={saving || !changed}
              className={`${buttonClass} border-amber-400/60 text-amber-100`}
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button type="button" onClick={() => setList(items)} disabled={!changed} className={buttonClass}>
              Undo changes
            </button>
            <button type="button" onClick={() => setOpen(false)} className={buttonClass}>
              Cancel
            </button>
            <p aria-live="polite" className="w-full text-xs text-red-400">
              {message}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
