import { site } from "../data/site";
import { focusRing } from "./styles";

type Props = {
  className?: string;
};

/** Liens vers ArtStation, Instagram, LinkedIn (définis dans app/data/site.ts). */
export default function SocialLinks({ className = "" }: Props) {
  return (
    <ul className={`flex flex-wrap gap-x-8 gap-y-3 text-sm ${className}`}>
      {site.socials.map((social) => {
        const external = social.href.startsWith("http");
        return (
          <li key={social.label}>
            <a
              href={social.href}
              {...(external && { target: "_blank", rel: "noopener noreferrer" })}
              className={`text-neutral-400 transition-colors duration-300 hover:text-neutral-100 ${focusRing}`}
            >
              {social.label}
              {external && <span className="sr-only"> (opens in a new tab)</span>}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
