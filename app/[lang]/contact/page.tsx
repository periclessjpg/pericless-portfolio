import BlurText from "../../components/BlurText";
import EmailLink from "../../components/EmailLink";
import Reveal from "../../components/motion/Reveal";
import PageHeader from "../../components/PageHeader";
import SocialLinks from "../../components/SocialLinks";
import { container, eyebrow, focusRing } from "../../components/styles";
import { pageMetadata } from "../../lib/metadata";
import { getTexts } from "../../lib/texts";

export async function generateMetadata() {
  return pageMetadata({
    title: "Contact",
    description: {
      en: "Contact Rayan Houstti for concept art, illustration and graphic design projects.",
      fr: "Contacter Rayan Houstti pour des projets de concept art, d’illustration et de graphisme.",
    },
    path: "/contact",
  });
}

export default async function ContactPage() {
  const t = await getTexts();
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
            <EmailLink className={`mt-4 inline-block break-all text-2xl text-neutral-100 underline decoration-neutral-700 underline-offset-8 transition-colors duration-300 hover:decoration-neutral-100 sm:text-3xl md:text-4xl ${focusRing}`} />
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
