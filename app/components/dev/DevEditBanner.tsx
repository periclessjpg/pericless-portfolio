"use client";

// MODE ÉDITION LOCAL : bannière en bas de l'écran, visible uniquement pendant `npm run dev`.

import { focusRing, label } from "../styles";
import { setToolsVisible, useToolsVisible } from "./edit-mode-store";

export default function DevEditBanner() {
  const visible = useToolsVisible();

  return (
    <div
      role="region"
      aria-label="Local edit mode"
      className="fixed bottom-4 left-4 z-[60] flex items-center gap-4 rounded-full border border-dashed border-amber-400/60 bg-neutral-950/90 py-2 pl-4 pr-2 text-amber-200 backdrop-blur-md"
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <span className={`${label} text-[0.65rem] sm:text-xs`}>Local edit mode</span>
      <button
        type="button"
        role="switch"
        aria-checked={visible}
        onClick={() => setToolsVisible(!visible)}
        className={`flex items-center gap-2 rounded-full px-2 py-1 text-xs text-neutral-300 hover:text-neutral-100 ${focusRing}`}
      >
        <span
          aria-hidden="true"
          className={`relative h-4 w-7 rounded-full transition-colors ${visible ? "bg-amber-400/80" : "bg-neutral-700"}`}
        >
          <span
            className={`absolute top-0.5 size-3 rounded-full bg-neutral-950 transition-transform ${visible ? "translate-x-3.5" : "translate-x-0.5"}`}
          />
        </span>
        Show tools
      </button>
    </div>
  );
}
