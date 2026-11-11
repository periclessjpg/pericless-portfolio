import Reveal from "../components/motion/Reveal";
import PageHeader from "../components/PageHeader";
import SocialLinks from "../components/SocialLinks";
import { container, eyebrow, focusRing } from "../components/styles";
import { site } from "../data/site";
import { pageMetadata } from "../lib/metadata";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Contact Pericless for concept art, illustration and graphic design projects.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className={`${container} pt-32 md:pt-44`}>
      <PageHeader label="Contact" title="[À REMPLACER] Let's create worlds together.">
        <p>
          [À REMPLACER] A short sentence about your availability: freelance, full-time
          positions, the kind of projects you are interested in.
        </p>
      </PageHeader>

      <Reveal delay={0.25} className="grid gap-16 border-t border-neutral-900 pt-12 md:grid-cols-2">
        <section aria-labelledby="email-title">
          <h2 id="email-title" className={eyebrow}>
            Email
          </h2>
          <a
            href={`mailto:${site.email}`}
            className={`mt-4 inline-block break-all text-2xl text-neutral-100 underline decoration-neutral-700 underline-offset-8 transition-colors duration-300 hover:decoration-neutral-100 sm:text-3xl md:text-4xl ${focusRing}`}
          >
            {site.email}
          </a>
        </section>

        <section aria-labelledby="social-title">
          <h2 id="social-title" className={eyebrow}>
            Elsewhere
          </h2>
          <SocialLinks className="mt-4 text-base" />
        </section>
      </Reveal>
    </div>
  );
}
