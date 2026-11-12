"use client";

// MODE ÉDITION LOCAL : panneau "Typography" (uniquement pendant `npm run dev`).
// Pour chaque rôle (titres de page, titres secondaires, haut de page et menu, texte
// courant) : police installée sur l'ordinateur, taille, espacement, capitales.
// Aperçu en direct sur le site (variables CSS --type-…) ; "Save" copie les polices
// choisies dans public/fonts/ et enregistre content/typography.json via /api/dev/typography.

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useState } from "react";
import {
  LIMITS,
  ROLES,
  TYPOGRAPHY_DEFAULTS,
  roleVars,
  type RoleName,
  type RoleSettings,
  type Typography,
} from "../../lib/typography";
import { focusRing, label } from "../styles";
import { useToolsVisible } from "./edit-mode-store";

export type DevTypographyPanelProps = {
  /** Typographie enregistrée actuellement. */
  typography: Typography;
};

type SystemFont = { id: string; family: string; style: string; weight: number; restricted: boolean; size: number };

type Draft = RoleSettings & {
  /** "" = police actuelle ; "default" = Geist ; sinon identifiant d'une police installée. */
  fontId: string;
};

const buttonClass = `rounded-full border border-neutral-700 px-4 py-2 text-xs uppercase tracking-[0.2em] text-neutral-200 transition-colors hover:border-neutral-100 hover:text-neutral-100 disabled:opacity-40 ${focusRing}`;
const fieldClass = `w-full rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1.5 text-xs text-neutral-100 ${focusRing}`;

const SAMPLES: Record<RoleName, string> = {
  display: "Concept Art",
  heading: "Selected Works",
  ui: "Rayan Houstti · Menu",
  body: "A short paragraph of body text, to see how it reads.",
};

/** Toutes les variables CSS de typographie (pour les retirer après l'aperçu). */
const VAR_NAMES = ROLES.flatMap(({ name }) =>
  ["family", "weight", "scale", "tracking", "transform"].map((v) => `--type-${name}-${v}`),
);

function clearPreview() {
  for (const name of VAR_NAMES) document.documentElement.style.removeProperty(name);
}

export default function DevTypographyPanel({ typography }: DevTypographyPanelProps) {
  const router = useRouter();
  const visible = useToolsVisible();
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const [fonts, setFonts] = useState<SystemFont[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState<Record<RoleName, string>>({ display: "", heading: "", ui: "", body: "" });
  const [draft, setDraft] = useState<Record<RoleName, Draft>>(() => initialDraft(typography));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function initialDraft(t: Typography) {
    return Object.fromEntries(ROLES.map(({ name }) => [name, { ...t[name], fontId: "" }])) as Record<RoleName, Draft>;
  }

  // Liste des polices installées, chargée à la première ouverture.
  useEffect(() => {
    if (!open || fonts) return;
    fetch("/api/dev/fonts", { method: "POST", headers: { "x-dev-upload": "1" } })
      .then((response) => response.json())
      .then((data) => setFonts(data.fonts ?? []))
      .catch(() => setLoadError("Could not read the installed fonts"));
  }, [open, fonts]);

  const fontsById = useMemo(() => new Map((fonts ?? []).map((font) => [font.id, font])), [fonts]);

  // Aperçu en direct sur le site pendant que le panneau est ouvert.
  useEffect(() => {
    if (!open) return;
    for (const { name } of ROLES) {
      const role = draft[name];
      // Police à afficher : installée (aperçu local), actuelle (servie par le site) ou Geist.
      const family =
        role.fontId === "default"
          ? undefined
          : role.fontId
            ? fontsById.get(role.fontId)?.family
            : typography[name].file
              ? `site-${name}`
              : undefined;
      for (const [key, value] of Object.entries(roleVars(name, role, family))) {
        document.documentElement.style.setProperty(key, value);
      }
    }
  }, [open, draft, fontsById, typography]);

  // Échap ferme le panneau sans enregistrer.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        clearPreview();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!visible) return null;

  function close() {
    clearPreview();
    setOpen(false);
  }

  function update(name: RoleName, patch: Partial<Draft>) {
    setDraft((current) => ({ ...current, [name]: { ...current[name], ...patch } }));
  }

  function chooseFont(name: RoleName, fontId: string) {
    if (fontId === "default") {
      update(name, { fontId, family: "", file: "", weight: TYPOGRAPHY_DEFAULTS[name].weight });
      return;
    }
    if (fontId === "") {
      update(name, { fontId, family: typography[name].family, weight: typography[name].weight });
      return;
    }
    const font = fontsById.get(fontId);
    if (font) update(name, { fontId, family: font.family, weight: font.weight });
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const roles = Object.fromEntries(
        ROLES.map(({ name }) => {
          const role = draft[name];
          return [name, { fontId: role.fontId, weight: role.weight, scale: role.scale, tracking: role.tracking, uppercase: role.uppercase }];
        }),
      );
      const response = await fetch("/api/dev/typography", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-dev-upload": "1" },
        body: JSON.stringify({ roles }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error ?? "Could not save");
        return;
      }
      setDraft(initialDraft(data.typography));
      clearPreview();
      setOpen(false);
      router.refresh();
    } catch {
      setMessage("Network error");
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setDraft(initialDraft(typography));
          setMessage("");
          setOpen(true);
        }}
        className={`fixed bottom-16 right-4 z-[60] rounded-full border border-dashed border-amber-400/60 bg-neutral-950/90 px-4 py-2 text-xs uppercase tracking-[0.2em] text-amber-200 backdrop-blur-md hover:text-amber-100 ${focusRing}`}
      >
        Typography
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-label="Typography (local edit mode)"
      className="fixed bottom-4 right-4 top-24 z-[65] flex w-[min(26rem,calc(100vw-2rem))] flex-col rounded-md border border-dashed border-amber-400/50 bg-neutral-950/95 backdrop-blur-md"
      style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif", letterSpacing: "normal", fontWeight: 400 }}
    >
      <div className="flex items-center justify-between gap-3 border-b border-neutral-800 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">Typography</p>
        <button type="button" onClick={close} className={buttonClass} aria-label="Close without saving">
          ×
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
        <p className="text-[0.7rem] leading-relaxed text-neutral-400">
          Fonts installed on this computer. On Save, the chosen font files are copied to <code>public/fonts/</code>{" "}
          so visitors see them. <strong className="text-amber-200">Check that each font’s license allows use on a website.</strong>{" "}
          Fonts marked “no web use” are refused. Adobe Fonts are not listed (they need an Adobe web project).
        </p>
        {loadError && <p className="text-xs text-red-400">{loadError}</p>}
        {!fonts && !loadError && <p className="text-xs text-neutral-500">Reading installed fonts…</p>}

        {ROLES.map(({ name, label: roleLabel, description, sizes }) => {
          const role = draft[name];
          const query = search[name].toLowerCase();
          const matches = (fonts ?? []).filter((font) => !query || font.family.toLowerCase().includes(query)).slice(0, 300);
          const chosen = role.fontId && role.fontId !== "default" ? fontsById.get(role.fontId) : undefined;
          const currentName = typography[name].family || "Geist";
          const isGeist = role.fontId === "default" || (role.fontId === "" && !typography[name].file);
          const previewFamily = chosen
            ? `"${chosen.family}"`
            : role.fontId === "" && typography[name].file
              ? `"site-${name}"`
              : "var(--font-geist-sans)";

          return (
            <fieldset key={name} className="flex flex-col gap-3 border-t border-neutral-800 pt-4">
              <legend className={`${label} pr-2 text-amber-200`}>{roleLabel}</legend>
              <p className="text-[0.7rem] text-neutral-500">{description}</p>

              {/* Aperçu du rôle */}
              <p
                className="truncate rounded-md bg-neutral-900 px-3 py-3 text-neutral-100"
                style={{
                  fontFamily: `${previewFamily}, var(--font-geist-sans), sans-serif`,
                  fontWeight: role.weight,
                  letterSpacing: `${role.tracking}em`,
                  textTransform: role.uppercase && sizes ? "uppercase" : "none",
                  fontSize: name === "body" ? "0.95rem" : "1.15rem",
                }}
              >
                {SAMPLES[name]}
              </p>

              <label htmlFor={`${baseId}-${name}-search`} className="text-xs text-neutral-400">
                Font <span className="text-neutral-500">(now: {chosen ? `${chosen.family} ${chosen.style}` : role.fontId === "default" ? "Geist" : currentName})</span>
              </label>
              <input
                id={`${baseId}-${name}-search`}
                type="search"
                placeholder="Search a font…"
                value={search[name]}
                onChange={(event) => setSearch((current) => ({ ...current, [name]: event.target.value }))}
                className={fieldClass}
              />
              <select
                aria-label={`Font for ${roleLabel}`}
                size={6}
                value={role.fontId}
                onChange={(event) => chooseFont(name, event.target.value)}
                className={fieldClass}
              >
                <option value="">Keep current ({currentName})</option>
                <option value="default">Geist (site default)</option>
                {matches.map((font) => (
                  <option key={font.id} value={font.id} disabled={font.restricted}>
                    {font.family} — {font.style} ({font.weight}){font.restricted ? " · no web use" : ""}
                  </option>
                ))}
              </select>

              {/* Graisse : réglable pour Geist ; pour une autre police, c'est le style choisi (fichier). */}
              {isGeist ? (
                <label className="flex items-center justify-between gap-3 text-xs text-neutral-400">
                  Weight
                  <select
                    value={role.weight}
                    onChange={(event) => update(name, { weight: Number(event.target.value) })}
                    className={`${fieldClass} w-28`}
                  >
                    {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <p className="text-xs text-neutral-500">Weight {role.weight}: choose another style of the font to change it.</p>
              )}

              {sizes && (
                <label className="text-xs text-neutral-400">
                  <span className="flex justify-between">
                    Size <span className="tabular-nums text-neutral-200">{role.scale}%</span>
                  </span>
                  <input
                    type="range"
                    min={LIMITS.scale.min}
                    max={LIMITS.scale.max}
                    step={LIMITS.scale.step}
                    value={role.scale}
                    onChange={(event) => update(name, { scale: Number(event.target.value) })}
                    className="mt-1 w-full accent-amber-300"
                  />
                </label>
              )}
              <label className="text-xs text-neutral-400">
                <span className="flex justify-between">
                  Letter spacing <span className="tabular-nums text-neutral-200">{role.tracking} em</span>
                </span>
                <input
                  type="range"
                  min={LIMITS.tracking.min}
                  max={LIMITS.tracking.max}
                  step={LIMITS.tracking.step}
                  value={role.tracking}
                  onChange={(event) => update(name, { tracking: Number(event.target.value) })}
                  className="mt-1 w-full accent-amber-300"
                />
              </label>
              {sizes && (
                <label className="flex items-center justify-between gap-3 text-xs text-neutral-400">
                  Capitals
                  <input
                    type="checkbox"
                    checked={role.uppercase}
                    onChange={(event) => update(name, { uppercase: event.target.checked })}
                    className="size-4 accent-amber-300"
                  />
                </label>
              )}
            </fieldset>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-neutral-800 p-4">
        <button type="button" onClick={save} disabled={saving} className={`${buttonClass} border-amber-400/60 text-amber-100`}>
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={() =>
            setDraft(
              Object.fromEntries(
                ROLES.map(({ name }) => [name, { ...TYPOGRAPHY_DEFAULTS[name], fontId: "default" }]),
              ) as Record<RoleName, Draft>,
            )
          }
          className={buttonClass}
        >
          Reset all
        </button>
        <button type="button" onClick={close} className={buttonClass}>
          Cancel
        </button>
        <p aria-live="polite" className="w-full text-xs text-red-400">
          {message}
        </p>
      </div>
    </div>
  );
}
