"use client";

// MODE ÉDITION LOCAL : modification des textes directement sur la page
// (uniquement pendant `npm run dev`, interrupteur "Edit texts" de la bannière activé).
//
// Les textes modifiables portent un attribut data-text-key (ajouté seulement en
// développement). Au clic, une zone de saisie apparaît exactement par-dessus le texte,
// avec la même police, taille et couleur. "Save" (ou Ctrl + Entrée) enregistre dans
// content/texts.json via /api/dev/texts ; Échap annule. La page n'est jamais modifiée
// directement : elle se met à jour après l'enregistrement.

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { DEFAULT_TEXTS, isTextKey, type TextKey, type Texts } from "../../lib/texts-defaults";
import { focusRing } from "../styles";
import { useTextMode, useToolsVisible } from "./edit-mode-store";

export type DevTextEditorProps = {
  /** Textes actuels du site. */
  texts: Texts;
};

type Editing = {
  key: TextKey;
  value: string;
  /** Position et style recopiés du texte d'origine. */
  box: { top: number; left: number; width: number; height: number };
  style: CSSProperties;
};

const buttonClass = `rounded-full border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.2em] text-neutral-200 hover:border-neutral-100 hover:text-neutral-100 disabled:opacity-40 ${focusRing}`;

export default function DevTextEditor({ texts }: DevTextEditorProps) {
  const router = useRouter();
  const visible = useToolsVisible();
  const textMode = useTextMode();
  const active = visible && textMode;
  const [editing, setEditing] = useState<Editing | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fieldRef = useRef<HTMLTextAreaElement>(null);

  // Mode actif : contour en pointillés au survol des textes modifiables,
  // et un clic sur l'un d'eux l'ouvre (au lieu de suivre un lien).
  useEffect(() => {
    if (!active) return;

    const style = document.createElement("style");
    style.textContent = `
      [data-text-key] { cursor: text; }
      [data-text-key]:hover { outline: 1px dashed rgba(252, 211, 77, 0.7); outline-offset: 4px; }
    `;
    document.head.appendChild(style);

    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-text-key]");
      if (!target) return;
      const key = target.dataset.textKey ?? "";
      if (!isTextKey(key)) return;
      event.preventDefault();
      event.stopPropagation();

      const rect = target.getBoundingClientRect();
      const computed = window.getComputedStyle(target);
      setError("");
      setEditing({
        key,
        value: texts[key],
        box: {
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: Math.max(rect.width, 220),
          height: Math.max(rect.height, 40),
        },
        style: {
          fontFamily: computed.fontFamily,
          fontSize: computed.fontSize,
          fontWeight: computed.fontWeight,
          letterSpacing: computed.letterSpacing,
          lineHeight: computed.lineHeight,
          textTransform: computed.textTransform as CSSProperties["textTransform"],
          textAlign: computed.textAlign as CSSProperties["textAlign"],
          color: computed.color,
        },
      });
    };

    // Phase de capture : intercepte le clic avant les liens et les boutons de la page.
    document.addEventListener("click", onClick, true);
    return () => {
      style.remove();
      document.removeEventListener("click", onClick, true);
    };
  }, [active, texts]);

  // Place le curseur dans la zone de saisie à l'ouverture.
  useEffect(() => {
    if (editing) fieldRef.current?.focus();
  }, [editing?.key]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!active || !editing) return null;

  async function save(value: string) {
    if (!editing) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/dev/texts", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-dev-upload": "1" },
        body: JSON.stringify({ key: editing.key, value }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Could not save");
        return;
      }
      setEditing(null);
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  const isDefault = editing.value === DEFAULT_TEXTS[editing.key];

  return (
    <div
      role="dialog"
      aria-label={`Edit text "${editing.key}"`}
      className="absolute z-[70]"
      style={{ top: editing.box.top - 8, left: editing.box.left - 8, width: editing.box.width + 16 }}
    >
      <textarea
        ref={fieldRef}
        value={editing.value}
        onChange={(event) => setEditing({ ...editing, value: event.target.value })}
        onKeyDown={(event) => {
          if (event.key === "Escape") setEditing(null);
          if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) save(editing.value);
        }}
        aria-label={`Text ${editing.key}`}
        rows={Math.max(1, editing.value.split("\n").length)}
        className="block w-full resize-y rounded-sm border border-dashed border-amber-300 bg-neutral-950/95 p-2 outline-none"
        style={{ ...editing.style, minHeight: editing.box.height + 16 }}
      />
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => save(editing.value)} disabled={saving} className={`${buttonClass} border-amber-400/60 text-amber-100`}>
          {saving ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={() => setEditing(null)} disabled={saving} className={buttonClass}>
          Cancel
        </button>
        <button
          type="button"
          onClick={() => setEditing({ ...editing, value: DEFAULT_TEXTS[editing.key] })}
          disabled={saving || isDefault}
          className={buttonClass}
        >
          Original text
        </button>
        <span className="rounded-full bg-neutral-950/90 px-2 py-1 text-[0.65rem] text-neutral-500">
          Ctrl + Enter to save · Esc to cancel · empty = hidden
        </span>
        {error && (
          <p role="alert" className="w-full text-xs text-red-400">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
