import BlurText from "../components/BlurText";
import Reveal from "../components/motion/Reveal";
import PageHeader from "../components/PageHeader";
import SocialLinks from "../components/SocialLinks";
import { container, eyebrow, focusRing } from "../components/styles";
import { pageMetadata } from "../lib/metadata";
import { getTexts } from "../lib/texts";
import { editable } from "../lib/texts-defaults";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Contact Rayan Houstti for concept art, illustration and graphic design projects.",
  path: "/contact",
});

export default function ContactPage() {
  const t = getTexts();
  return (
    <div className={`${container} pt-32 md:pt-44`}>
      <PageHeader
        label={t["contact.eyebrow"]}
        title={t["contact.title"]}
        intro={t["contact.intro"]}
        keys={{ label: "contact.eyebrow", title: "contact.title", intro: "contact.intro" }}
      />

      <div className="grid gap-16 border-t border-neutral-900 pt-12 md:grid-cols-2">
        <section aria-labelledby="email-title">
          <BlurText as="h2" id="email-title" delay={0.3} textKey="contact.emailLabel" className={eyebrow}>
            {t["contact.emailLabel"]}
          </BlurText>
          <Reveal delay={0.4}>
            <a
              href={`mailto:${t["common.email"]}`}
              className={`mt-4 inline-block break-all text-2xl text-neutral-100 underline decoration-neutral-700 underline-offset-8 transition-colors duration-300 hover:decoration-neutral-100 sm:text-3xl md:text-4xl ${focusRing}`}
              {...editable("common.email")}
            >
              {t["common.email"]}
            </a>
          </Reveal>
        </section>

        <section aria-labelledby="social-title">
          <BlurText as="h2" id="social-title" delay={0.3} textKey="contact.elsewhere" className={eyebrow}>
            {t["contact.elsewhere"]}
          </BlurText>
          <Reveal delay={0.4}>
            <SocialLinks className="mt-4 text-base" />
          </Reveal>
        </section>
      </div>
    </div>
  );
}
