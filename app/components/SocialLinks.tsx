import { site } from "../data/site";
import { getTexts } from "../lib/texts";
import { editable, type TextKey } from "../lib/texts-defaults";
import { focusRing } from "./styles";

type Props = {
  className?: string;
};

/**
 * Liens vers ArtStation, Instagram, LinkedIn : adresses dans app/data/site.ts,
 * noms affichés modifiables en mode édition local.
 */
export default function SocialLinks({ className = "" }: Props) {
  const t = getTexts();

  return (
    <ul className={`flex flex-wrap gap-x-8 gap-y-3 text-sm ${className}`}>
      {site.socials.map((social, index) => {
        const external = social.href.startsWith("http");
        const key = `social.${index}` as TextKey;
        const label = t[key] ?? social.label;
        return (
          <li key={social.href + index}>
            <a
              href={social.href}
              {...(external && { target: "_blank", rel: "noopener noreferrer" })}
              className={`text-neutral-400 transition-colors duration-300 hover:text-neutral-100 ${focusRing}`}
            >
              <span {...editable(key)}>{label}</span>
              {external && <span className="sr-only"> (opens in a new tab)</span>}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
