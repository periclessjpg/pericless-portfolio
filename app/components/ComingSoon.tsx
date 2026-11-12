import { label } from "./styles";

type Props = {
  /** Dossier à remplir (affiché seulement pendant `npm run dev`). */
  folder: string;
  className?: string;
};

/**
 * Message sobre affiché quand un dossier d'images est vide ou absent.
 * En développement uniquement, indique où déposer les images.
 */
export default function ComingSoon({ folder, className = "" }: Props) {
  return (
    <div className={`border-y border-neutral-900 py-16 md:py-24 ${className}`}>
      <p className={`${label} text-neutral-500`}>Coming soon</p>
      {process.env.NODE_ENV === "development" && (
        <p className="mt-4 text-sm text-neutral-600">
          Dev only · Drop images in <code className="text-neutral-400">{folder}</code>
        </p>
      )}
    </div>
  );
}
