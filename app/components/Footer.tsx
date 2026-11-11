import Link from "next/link";
import { site } from "../data/site";
import SocialLinks from "./SocialLinks";
import { container, eyebrow, focusRing } from "./styles";

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-neutral-900">
      <div className={`${container} flex flex-col gap-12 py-16 md:flex-row md:items-end md:justify-between`}>
        <div>
          <p className={eyebrow}>Get in touch</p>
          <a
            href={`mailto:${site.email}`}
            className={`mt-4 inline-block text-lg text-neutral-100 underline decoration-neutral-700 underline-offset-8 transition-colors duration-300 hover:decoration-neutral-100 md:text-xl ${focusRing}`}
          >
            {site.email}
          </a>
        </div>

        <div className="flex flex-col gap-6 md:items-end">
          <SocialLinks />
          <p className="text-xs text-neutral-500">
            © <Link href="/" className={`hover:text-neutral-300 ${focusRing}`}>{site.name}</Link>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
