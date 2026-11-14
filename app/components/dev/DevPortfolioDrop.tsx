"use client";

// MODE ÉDITION LOCAL : zone de dépôt du portfolio PDF (page Contact, `npm run dev` uniquement).
// Glisser un PDF ici (ou cliquer pour le choisir) l'enregistre sous public/portfolio.pdf
// via /api/dev/portfolio. Remplacer ou retirer : l'ancien fichier part dans .artworks-trash/.

import { useRouter } from "next/navigation";
import { useRef, useState, type DragEvent } from "react";
import { focusRing } from "../styles";
import { useToolsVisible } from "./edit-mode-store";

export type DevPortfolioDropProps = {
  /** true si public/portfolio.pdf existe déjà. */
  exists: boolean;
};

const MAX_SIZE = 50 * 1024 * 1024;
const buttonClass = `rounded-full border border-neutral-700 px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.2em] text-neutral-200 hover:border-neutral-100 hover:text-neutral-100 disabled:opacity-40 ${focusRing}`;

export default function DevPortfolioDrop({ exists }: DevPortfolioDropProps) {
  const router = useRouter();
  const visible = useToolsVisible();
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [confirmRemove, setConfirmRemove] = useState(false);

  if (!visible) return null;

  async function send(form: FormData, working: string, done: string) {
    setBusy(working);
    setMessage("");
    try {
      const response = await fetch("/api/dev/portfolio", {
        method: "POST",
        headers: { "x-dev-upload": "1" },
        body: form,
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error ?? "Could not save");
        return;
      }
      setMessage(done);
      router.refresh();
    } catch {
      setMessage("Network error");
    } finally {
      setBusy("");
    }
  }

  function upload(file: File | undefined) {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setMessage("Please drop a PDF file");
      return;
    }
    if (file.size > MAX_SIZE) {
      setMessage("File larger than 50 MB");
      return;
    }
    const form = new FormData();
    form.append("file", file);
    send(form, "Saving…", exists ? "Portfolio replaced (old one moved to .artworks-trash/)" : "Portfolio saved");
  }

  function remove() {
    const form = new FormData();
    form.append("action", "remove");
    setConfirmRemove(false);
    send(form, "Removing…", "Portfolio removed (moved to .artworks-trash/)");
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setOver(false);
    upload(event.dataTransfer.files[0]);
  }

  return (
    <div className="mt-6 max-w-xl">
      <div
        role="button"
        tabIndex={0}
        aria-label={exists ? "Replace the portfolio PDF" : "Add the portfolio PDF"}
        onClick={() => input.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            input.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-6 py-10 text-center transition-colors ${focusRing} ${
          over ? "border-amber-300 bg-amber-300/5" : "border-amber-400/40 hover:border-amber-300/70"
        }`}
      >
        <p className="text-sm text-amber-200">
          {busy || (exists ? "Drop a new PDF here to replace your portfolio" : "Drop your portfolio PDF here")}
        </p>
        <p className="text-xs text-neutral-500">or click to choose · PDF · max 50 MB · saved as public/portfolio.pdf</p>
      </div>
      <input
        ref={input}
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => {
          upload(event.target.files?.[0]);
          event.target.value = "";
        }}
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {exists && !confirmRemove && (
          <>
            <a href="/portfolio.pdf" target="_blank" rel="noopener noreferrer" className={buttonClass}>
              Open current PDF
            </a>
            <button type="button" onClick={() => setConfirmRemove(true)} disabled={!!busy} className={buttonClass}>
              Remove
            </button>
          </>
        )}
        {confirmRemove && (
          <>
            <span className="text-xs text-red-300">Remove the portfolio from the site?</span>
            <button type="button" onClick={remove} className={`${buttonClass} text-red-300`}>
              Yes, remove
            </button>
            <button type="button" onClick={() => setConfirmRemove(false)} className={buttonClass}>
              No
            </button>
          </>
        )}
        <span aria-live="polite" className="text-xs text-neutral-400">
          {message}
        </span>
      </div>
    </div>
  );
}
