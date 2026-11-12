"use client";

// MODE ÉDITION LOCAL : tuile "Drop images here" affichée uniquement pendant `npm run dev`.
// Les images déposées s'affichent en aperçu (mêmes effets que les images finales),
// puis sont envoyées à /api/dev/upload qui les enregistre dans public/artworks/.

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type DragEvent, type FormEvent } from "react";
import { baseName, humanize, IMAGE_EXTENSIONS, slugify } from "../../lib/artwork-names";
import BlurText from "../BlurText";
import Reveal from "../motion/Reveal";
import { focusRing, label, titleMedium } from "../styles";
import { useToolsVisible } from "./edit-mode-store";

export type DropVariant = "card" | "banner" | "fullscreen" | "portrait";

export type DevDropZoneProps = {
  /** Dossier de public/artworks/ où enregistrer les images. */
  category: "concept-art" | "illustration" | "home" | "about" | "hero";
  /** Nom affiché de la catégorie (texte sous le titre pour "All"). */
  categoryLabel?: string;
  /** Filtres existants (sous-dossiers), pour Concept Art et Illustration. */
  filters?: { slug: string; label: string }[];
  /** Filtre sélectionné par défaut ("all" = dossier all). */
  defaultFilter?: string;
  /** Forme des tuiles, identique aux images finales de la page. */
  variant: DropVariant;
};

type Item = {
  id: string;
  file: File;
  url: string;
  title: string;
  status: "queued" | "uploading" | "done" | "error";
  progress: number;
  error?: string;
};

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const MAX_FILES = 30;

// Même forme que les tuiles finales de chaque page.
const shapes: Record<DropVariant, string> = {
  card: "aspect-[4/5]",
  portrait: "aspect-[4/5]",
  banner: "aspect-[4/3]",
  fullscreen: "h-[85svh] md:h-svh",
};
const layouts: Record<DropVariant, string> = {
  card: "grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8",
  portrait: "grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8",
  banner: "grid grid-cols-1 gap-2 md:grid-cols-2",
  fullscreen: "flex flex-col gap-2",
};

const buttonClass = `rounded-full border border-neutral-700 px-4 py-2 text-xs uppercase tracking-[0.2em] text-neutral-200 transition-colors hover:border-neutral-100 hover:text-neutral-100 disabled:opacity-40 ${focusRing}`;

/** Titre final de l'image : celui saisi, sinon celui déduit du nom enregistré. */
function finalTitle(item: Item) {
  return item.title.trim() || humanize(slugify(baseName(item.file.name)) || "image");
}

/** Envoie une image à /api/dev/upload en suivant la progression. */
function uploadOne(
  item: Item,
  category: string,
  filter: string,
  onProgress: (progress: number) => void,
): Promise<{ ok: boolean; error?: string }> {
  return new Promise((resolve) => {
    const request = new XMLHttpRequest();
    request.open("POST", "/api/dev/upload");
    request.setRequestHeader("x-dev-upload", "1");
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(event.loaded / event.total);
    };
    request.onload = () => {
      let data: { saved?: unknown[]; errors?: { error: string }[]; error?: string } | null = null;
      try {
        data = JSON.parse(request.responseText);
      } catch {
        // Réponse illisible : message générique ci-dessous.
      }
      if (request.status === 200 && data?.saved?.length) {
        resolve({ ok: true, error: data.errors?.[0]?.error });
      } else {
        resolve({ ok: false, error: data?.errors?.[0]?.error ?? data?.error ?? `Error ${request.status}` });
      }
    };
    request.onerror = () => resolve({ ok: false, error: "Network error" });

    const form = new FormData();
    form.append("category", category);
    form.append("filter", filter);
    form.append("files", item.file);
    form.append("titles", item.title.trim());
    request.send(form);
  });
}

export default function DevDropZone({
  category,
  categoryLabel = "",
  filters = [],
  defaultFilter = "all",
  variant,
}: DevDropZoneProps) {
  const router = useRouter();
  const visible = useToolsVisible();
  const inputRef = useRef<HTMLInputElement>(null);
  const selectId = useId();
  const newFilterId = useId();

  const [items, setItems] = useState<Item[]>([]);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [extraFilters, setExtraFilters] = useState<{ slug: string; label: string }[]>([]);
  const [destination, setDestination] = useState(defaultFilter);
  const [newFilterOpen, setNewFilterOpen] = useState(false);
  const [newFilterName, setNewFilterName] = useState("");
  const [newFilterError, setNewFilterError] = useState("");

  const hasFilters = category === "concept-art" || category === "illustration";
  const allFilters = [...filters, ...extraFilters.filter((f) => !filters.some((g) => g.slug === f.slug))];
  const destinationLabel =
    destination === "all" ? categoryLabel : (allFilters.find((f) => f.slug === destination)?.label ?? "");

  // Libère la mémoire des aperçus quand le composant disparaît.
  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);
  useEffect(() => () => itemsRef.current.forEach((item) => URL.revokeObjectURL(item.url)), []);

  if (!visible) return null;

  function update(id: string, patch: Partial<Item>) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function addFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    const pending = items.filter((item) => item.status === "queued").length;
    const added: Item[] = Array.from(list).map((file, index) => {
      const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
      let error: string | undefined;
      if (!IMAGE_EXTENSIONS.includes(extension)) error = "Format not accepted (jpg, jpeg, png, webp, avif)";
      else if (file.size > MAX_FILE_SIZE) error = "File larger than 25 MB";
      else if (pending + index >= MAX_FILES) error = `Maximum ${MAX_FILES} images per upload`;
      return {
        id: `${Date.now()}-${index}-${file.name}`,
        file,
        url: URL.createObjectURL(file),
        title: "",
        status: error ? "error" : "queued",
        progress: 0,
        error,
      };
    });
    setItems((current) => [...current, ...added]);
    setMessage(`${added.length} image${added.length > 1 ? "s" : ""} added to the queue`);
  }

  function remove(id: string) {
    setItems((current) => {
      const item = current.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.url);
      return current.filter((i) => i.id !== id);
    });
  }

  async function uploadAll() {
    const queue = items.filter((item) => item.status === "queued");
    if (queue.length === 0) return;
    setBusy(true);
    let saved = 0;
    // Une image à la fois : les numéros 01-, 02-… suivent l'ordre de la file.
    for (const item of queue) {
      update(item.id, { status: "uploading", progress: 0 });
      const result = await uploadOne(item, category, hasFilters ? destination : "", (progress) =>
        update(item.id, { progress }),
      );
      if (result.ok) saved++;
      update(item.id, {
        status: result.ok ? "done" : "error",
        progress: result.ok ? 1 : 0,
        error: result.error,
      });
    }
    setBusy(false);
    setMessage(`${saved} of ${queue.length} image${queue.length > 1 ? "s" : ""} saved`);
    if (saved > 0) {
      // La page relit les dossiers et affiche les vraies images.
      router.refresh();
      setTimeout(() => {
        setItems((current) => {
          current.filter((i) => i.status === "done").forEach((i) => URL.revokeObjectURL(i.url));
          return current.filter((i) => i.status !== "done");
        });
      }, 800);
    }
  }

  async function createFilter(event: FormEvent) {
    event.preventDefault();
    setNewFilterError("");
    try {
      const response = await fetch("/api/dev/filter", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-dev-upload": "1" },
        body: JSON.stringify({ category, name: newFilterName }),
      });
      const data = await response.json();
      if (!response.ok) {
        setNewFilterError(data.error ?? "Could not create the filter");
        return;
      }
      setExtraFilters((current) => [...current, { slug: data.slug, label: data.label }]);
      setDestination(data.slug);
      setNewFilterName("");
      setNewFilterOpen(false);
      setMessage(`Filter "${data.label}" created`);
      router.refresh();
    } catch {
      setNewFilterError("Network error");
    }
  }

  function onDrop(event: DragEvent) {
    event.preventDefault();
    setDragging(false);
    addFiles(event.dataTransfer.files);
  }

  const queued = items.filter((item) => item.status === "queued").length;

  return (
    <section
      aria-label="Add images (local edit mode)"
      className="mt-8 rounded-sm border border-dashed border-amber-400/40 p-4 md:p-6"
    >
      {/* Barre d'outils : destination, nouveau filtre, envoi */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className={`${label} mr-2 text-amber-200`}>Local edit mode</span>

        {hasFilters && (
          <>
            <label htmlFor={selectId} className="text-xs text-neutral-400">
              Destination
            </label>
            <select
              id={selectId}
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              disabled={busy}
              className={`rounded-full border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-neutral-100 ${focusRing}`}
            >
              <option value="all">All</option>
              {allFilters.map((filter) => (
                <option key={filter.slug} value={filter.slug}>
                  {filter.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setNewFilterOpen((open) => !open)}
              aria-expanded={newFilterOpen}
              className={buttonClass}
            >
              New filter
            </button>
          </>
        )}

        <button
          type="button"
          onClick={uploadAll}
          disabled={busy || queued === 0}
          className={`${buttonClass} border-amber-400/60 text-amber-100`}
        >
          {busy ? "Uploading…" : queued === 0 ? "Upload" : `Upload ${queued} image${queued === 1 ? "" : "s"}`}
        </button>
      </div>

      {newFilterOpen && (
        <form onSubmit={createFilter} className="mb-6 flex flex-wrap items-center gap-3">
          <label htmlFor={newFilterId} className="text-xs text-neutral-400">
            New filter name
          </label>
          <input
            id={newFilterId}
            value={newFilterName}
            onChange={(event) => setNewFilterName(event.target.value)}
            placeholder="e.g. Props"
            maxLength={40}
            className={`rounded-full border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-neutral-100 ${focusRing}`}
          />
          <button type="submit" className={buttonClass}>
            Create
          </button>
          {newFilterError && (
            <p role="alert" className="text-xs text-red-400">
              {newFilterError}
            </p>
          )}
        </form>
      )}

      <p aria-live="polite" className="sr-only">
        {message}
      </p>

      <div className={layouts[variant]}>
        {/* Aperçus des images déposées, avec les mêmes effets que les images finales */}
        {items.map((item) => (
          <Reveal key={item.id}>
            <div className={`relative overflow-hidden bg-neutral-900 ${shapes[variant]}`}>
              {/* Aperçu local (fichier pas encore enregistré) : <img> simple, outil de développement uniquement */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-neutral-950/85 via-neutral-950/30 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
                <BlurText as="p" className={`${titleMedium} text-neutral-100`}>
                  {finalTitle(item)}
                </BlurText>
                {destinationLabel && (
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-neutral-400">{destinationLabel}</p>
                )}
              </div>

              <span className="absolute left-3 top-3 rounded-full bg-neutral-950/80 px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-neutral-200">
                {item.status === "queued" && "Ready"}
                {item.status === "uploading" && "Uploading"}
                {item.status === "done" && "Saved"}
                {item.status === "error" && "Error"}
              </span>
              {(item.status === "queued" || item.status === "error") && (
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  aria-label={`Remove ${item.file.name}`}
                  className={`absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-neutral-950/80 text-neutral-200 hover:text-neutral-100 ${focusRing}`}
                >
                  ×
                </button>
              )}

              {/* Barre de progression */}
              <div
                role="progressbar"
                aria-label={`Upload progress for ${item.file.name}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(item.progress * 100)}
                className="absolute inset-x-0 bottom-0 h-1 bg-neutral-800"
              >
                <div
                  className={`h-full transition-[width] duration-200 ${item.status === "error" ? "bg-red-400" : "bg-amber-300"}`}
                  style={{ width: `${Math.round(item.progress * 100)}%` }}
                />
              </div>
            </div>

            <div className="mt-3 flex flex-col gap-2">
              <input
                value={item.title}
                onChange={(event) => update(item.id, { title: event.target.value })}
                disabled={item.status !== "queued"}
                placeholder={`Title (optional) · ${humanize(slugify(baseName(item.file.name)) || "image")}`}
                aria-label={`Title for ${item.file.name} (optional)`}
                maxLength={120}
                className={`w-full rounded-full border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-100 placeholder:text-neutral-600 disabled:opacity-50 ${focusRing}`}
              />
              {item.error && (
                <p role="alert" className="text-xs text-red-400">
                  {item.file.name} · {item.error}
                </p>
              )}
            </div>
          </Reveal>
        ))}

        {/* Tuile de dépôt, à l'emplacement de la prochaine image */}
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`flex flex-col items-center justify-center gap-4 border-2 border-dashed p-6 text-center transition-colors ${shapes[variant]} ${
            dragging ? "border-amber-300 bg-amber-300/5" : "border-neutral-700"
          }`}
        >
          <p className={`${label} text-neutral-300`}>Drop images here</p>
          <p className="text-xs text-neutral-500">
            jpg, png, webp, avif · max 25 MB · {hasFilters ? `saved to "${destination === "all" ? "All" : destinationLabel}"` : `saved to ${category}`}
          </p>
          <button type="button" onClick={() => inputRef.current?.click()} className={buttonClass}>
            Browse files
          </button>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={IMAGE_EXTENSIONS.join(",")}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            onChange={(event) => {
              addFiles(event.target.files);
              event.target.value = "";
            }}
          />
        </div>
      </div>
    </section>
  );
}
