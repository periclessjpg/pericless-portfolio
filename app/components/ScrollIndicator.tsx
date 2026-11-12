import { editable } from "../lib/texts-defaults";
import { focusRing } from "./styles";

type Props = {
  /** Identifiant de la section vers laquelle descendre. */
  targetId: string;
  /** Texte affiché ("Scroll to explore"). */
  label: string;
};

/** "Scroll to explore" en bas du hero, avec une fine ligne qui pulse doucement. */
export default function ScrollIndicator({ targetId, label }: Props) {
  return (
    <a
      href={`#${targetId}`}
      className={`group inline-flex flex-col items-start gap-4 text-xs uppercase tracking-[0.3em] text-neutral-500 transition-colors duration-300 hover:text-neutral-100 ${focusRing}`}
    >
      <span {...editable("common.scroll")}>{label}</span>
      <span
        aria-hidden="true"
        className="block h-12 w-px origin-top bg-neutral-600 group-hover:bg-neutral-100 motion-safe:animate-pulse"
      />
    </a>
  );
}
