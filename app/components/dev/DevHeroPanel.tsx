"use client";

// MODE ÉDITION LOCAL : panneau "Customize hero" (uniquement pendant `npm run dev`).
// Les curseurs modifient le hero en direct (variables CSS --hero-…) ; "Save" enregistre
// les réglages dans public/artworks/hero/settings.json via /api/dev/hero.
// Sur un écran de téléphone (aperçu "Phone" de la bannière), le panneau règle seulement
// la version téléphone du hero (champ "mobile" de settings.json).

import { useRouter } from "next/navigation";
import { useEffect, useId, useState, type ReactNode } from "react";
import {
  HERO_CHOICES,
  HERO_DEFAULTS,
  HERO_MOBILE_KEYS,
  HERO_RANGES,
  heroCssVars,
  heroPhoneSettings,
  type HeroSettings,
} from "../../lib/hero-settings";
import { focusRing, label } from "../styles";
import { useIsPhone, useToolsVisible } from "./edit-mode-store";

export type DevHeroPanelProps = {
  /** Réglages enregistrés actuellement. */
  settings: HeroSettings;
  /** Images disponibles dans public/artworks/hero/ (nom de fichier et titre). */
  images: { file: string; title: string }[];
};

type NumberKey = keyof typeof HERO_RANGES;

/** Applique des réglages au hero affiché (aperçu en direct) : ordinateur ("d") ou téléphone ("m"). */
function applyToPage(settings: HeroSettings, device: "d" | "m") {
  const hero = document.getElementById("hero");
  if (!hero) return;
  for (const [name, value] of Object.entries(heroCssVars(settings, device))) hero.style.setProperty(name, value);
}

const buttonClass = `rounded-full border border-neutral-700 px-4 py-2 text-xs uppercase tracking-[0.2em] text-neutral-200 transition-colors hover:border-neutral-100 hover:text-neutral-100 disabled:opacity-40 ${focusRing}`;
const fieldClass = `w-full rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1.5 text-xs text-neutral-100 ${focusRing}`;

const choiceLabels: Record<string, string> = {
  bottom: "Bottom",
  left: "Left",
  "bottom-left": "Bottom + left",
  none: "None",
  top: "Top",
  center: "Center",
  right: "Right",
  fade: "Fade in",
  zoom: "Slow zoom",
};

export default function DevHeroPanel({ settings, images }: DevHeroPanelProps) {
  const router = useRouter();
  const visible = useToolsVisible();
  // Écran de téléphone : le panneau règle la version téléphone du hero.
  const phone = useIsPhone();
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<HeroSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Aperçu en direct pendant que le panneau est ouvert ; à la fermeture, retour aux réglages enregistrés.
  useEffect(() => {
    if (phone) {
      applyToPage(settings, "d");
      applyToPage(open ? draft : heroPhoneSettings(settings), "m");
    } else {
      applyToPage(open ? draft : settings, "d");
      applyToPage(heroPhoneSettings(open ? { ...draft, mobile: settings.mobile } : settings), "m");
    }
  }, [open, draft, settings, phone]);

  // Échap ferme le panneau sans enregistrer.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!visible) return null;

  function set<K extends keyof HeroSettings>(key: K, value: HeroSettings[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/dev/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-dev-upload": "1" },
        // Téléphone : réglages ordinateur inchangés, seuls les réglages téléphone changent
        // (le serveur ne garde que ceux qui diffèrent de l'ordinateur).
        body: JSON.stringify(
          phone
            ? { ...settings, mobile: Object.fromEntries(HERO_MOBILE_KEYS.map((key) => [key, draft[key]])) }
            : { ...draft, mobile: settings.mobile },
        ),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error ?? "Could not save");
        return;
      }
      setDraft(phone ? heroPhoneSettings(data.settings) : data.settings);
      setMessage("Saved");
      router.refresh();
    } catch {
      setMessage("Network error");
    } finally {
      setSaving(false);
    }
  }

  function slider(key: NumberKey) {
    const range = HERO_RANGES[key];
    const id = `${baseId}-${key}`;
    return (
      <div key={key}>
        <label htmlFor={id} className="flex justify-between text-xs text-neutral-400">
          <span>{range.label}</span>
          <span className="tabular-nums text-neutral-200">
            {draft[key]} {range.unit}
          </span>
        </label>
        <input
          id={id}
          type="range"
          min={range.min}
          max={range.max}
          step={range.step}
          value={draft[key]}
          onChange={(event) => set(key, Number(event.target.value))}
          className="mt-1 w-full accent-amber-300"
        />
      </div>
    );
  }

  function choice<K extends keyof typeof HERO_CHOICES>(key: K, title: string) {
    const id = `${baseId}-${key}`;
    return (
      <div key={key}>
        <label htmlFor={id} className="text-xs text-neutral-400">
          {title}
        </label>
        <select
          id={id}
          value={draft[key]}
          onChange={(event) => set(key, event.target.value as HeroSettings[K])}
          className={`mt-1 ${fieldClass}`}
        >
          {HERO_CHOICES[key].map((value) => (
            <option key={value} value={value}>
              {choiceLabels[value] ?? value}
            </option>
          ))}
        </select>
      </div>
    );
  }

  function color(key: "overlayColor" | "textColor", title: string) {
    const id = `${baseId}-${key}`;
    return (
      <div key={key} className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-xs text-neutral-400">
          {title}
        </label>
        <input
          id={id}
          type="color"
          value={draft[key]}
          onChange={(event) => set(key, event.target.value)}
          className={`h-8 w-14 cursor-pointer rounded border border-neutral-700 bg-neutral-900 ${focusRing}`}
        />
      </div>
    );
  }

  const group = (title: string, children: ReactNode, note?: string) => (
    <fieldset className="flex flex-col gap-3 border-t border-neutral-800 pt-4">
      <legend className={`${label} pr-2 text-[0.65rem] text-amber-200 sm:text-xs`}>{title}</legend>
      {note && <p className="text-[0.7rem] text-neutral-500">{note}</p>}
      {children}
    </fieldset>
  );

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setDraft(phone ? heroPhoneSettings(settings) : settings);
          setMessage("");
          setOpen(true);
        }}
        className={`fixed bottom-4 right-4 z-[60] rounded-full border border-dashed border-amber-400/60 bg-neutral-950/90 px-4 py-2 text-xs uppercase tracking-[0.2em] text-amber-200 backdrop-blur-md hover:text-amber-100 ${focusRing}`}
      >
        {phone ? "Customize hero (phone)" : "Customize hero"}
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-label="Customize hero (local edit mode)"
      className="fixed bottom-4 right-4 top-24 z-[65] flex w-[min(22rem,calc(100vw-2rem))] flex-col rounded-md border border-dashed border-amber-400/50 bg-neutral-950/95 backdrop-blur-md"
    >
      <div className="flex items-center justify-between gap-3 border-b border-neutral-800 p-4">
        <p className={`${label} text-amber-200`}>{phone ? "Customize hero · Phone" : "Customize hero"}</p>
        <button type="button" onClick={() => setOpen(false)} className={buttonClass} aria-label="Close without saving">
          ×
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
        {phone && (
          <p className="text-xs text-amber-200/80">
            Phone version: changes apply only to screens narrower than 768 px. Settings you don’t touch stay the same
            as on computer. Background image and animation are shared: change them on the computer view.
          </p>
        )}
        {!phone && group(
          "Image",
          <div>
            <label htmlFor={`${baseId}-image`} className="text-xs text-neutral-400">
              Background image
            </label>
            <select
              id={`${baseId}-image`}
              value={draft.image}
              onChange={(event) => set("image", event.target.value)}
              className={`mt-1 ${fieldClass}`}
            >
              <option value="">First image of the folder</option>
              {images.map((image) => (
                <option key={image.file} value={image.file}>
                  {image.title} ({image.file})
                </option>
              ))}
            </select>
          </div>,
          images.length === 0
            ? "No image yet: drop one on the hero first."
            : "Applied after Save. Framing: use “Adjust framing” on the image.",
        )}
        {!phone &&
          images.length >= 2 &&
          group(
            "Slideshow (GTA style)",
            <>
              <fieldset>
                <legend className="text-xs text-neutral-400">Images that switch, in folder order</legend>
                <div className="mt-2 flex flex-col gap-1.5">
                  {images.map((image) => {
                    const checked = draft.slides.includes(image.file);
                    return (
                      <label key={image.file} className="flex items-center gap-2 text-xs text-neutral-300">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            set(
                              "slides",
                              // Toujours dans l'ordre du dossier.
                              images
                                .map((i) => i.file)
                                .filter((file) => (file === image.file ? !checked : draft.slides.includes(file))),
                            )
                          }
                          className="size-4 accent-amber-300"
                        />
                        <span className="truncate">
                          {image.title} <span className="text-neutral-500">({image.file})</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              {slider("slideDuration")}
            </>,
            draft.slides.length >= 2
              ? `${draft.slides.length} images will switch. Applied after Save. Each image moves with the “Slow camera move” strength.`
              : "Tick 2 images or more to turn the slideshow on (otherwise the background image above is shown alone). Applied after Save.",
          )}
        {group("Size", slider("height"))}
        {group(
          "Image look",
          <>
            {slider("imageOpacity")}
            {slider("zoom")}
            {slider("blur")}
            {slider("grayscale")}
            {slider("saturation")}
            {slider("brightness")}
            {slider("contrast")}
          </>,
        )}
        {group(
          "Overlay",
          <>
            {color("overlayColor", "Overlay color")}
            {slider("overlayOpacity")}
            {choice("gradient", "Gradient direction")}
            {slider("gradientStrength")}
          </>,
        )}
        {group(
          "Text",
          <>
            {choice("textVertical", "Vertical position")}
            {choice("textHorizontal", "Horizontal position")}
            {slider("textSize")}
            {color("textColor", "Text color")}
            <label className="flex items-center justify-between gap-3 text-xs text-neutral-400">
              Show “Scroll to explore”
              <input
                type="checkbox"
                checked={draft.showScroll}
                onChange={(event) => set("showScroll", event.target.checked)}
                className="size-4 accent-amber-300"
              />
            </label>
          </>,
          "Size and color apply to the tagline (set it in app/data/site.ts, currently empty). Position also moves “Scroll to explore”.",
        )}
        {!phone && group(
          "Animation",
          <>
            {choice("animation", "Image entrance")}
            {slider("animationDuration")}
            {slider("parallax")}
            {slider("travel")}
            {slider("travelDuration")}
          </>,
          "Entrance: applied after Save (reload the page to replay it). Slow camera move: 0 % = off.",
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-neutral-800 p-4">
        <button type="button" onClick={save} disabled={saving} className={`${buttonClass} border-amber-400/60 text-amber-100`}>
          {saving ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={() =>
            // Téléphone : retour aux réglages de l'ordinateur ; ordinateur : valeurs d'origine.
            setDraft(phone ? { ...settings, mobile: {} } : { ...HERO_DEFAULTS, image: draft.image, slides: draft.slides, mobile: settings.mobile })
          } className={buttonClass}>
          Reset
        </button>
        <button type="button" onClick={() => setOpen(false)} className={buttonClass}>
          Cancel
        </button>
        <p aria-live="polite" className="w-full text-xs text-neutral-400">
          {message}
        </p>
      </div>
    </div>
  );
}
