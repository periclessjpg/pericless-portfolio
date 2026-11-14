import BlurText from "../../components/BlurText";
import EmailLink from "../../components/EmailLink";
import Reveal from "../../components/motion/Reveal";
import PageHeader from "../../components/PageHeader";
import SocialLinks from "../../components/SocialLinks";
import { DevPortfolioDropSlot } from "../../components/dev/DevSlots";
import { container, eyebrow, focusRing } from "../../components/styles";
import { pageMetadata } from "../../lib/metadata";
import { PORTFOLIO_DOWNLOAD_NAME, PORTFOLIO_URL, hasPortfolio as portfolioExists } from "../../lib/portfolio";
import { getTexts } from "../../lib/texts";
import { editable, shown } from "../../lib/texts-defaults";

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
  // Le bouton n'apparaît que si le fichier existe (jamais de lien cassé sur le site publié).
  const hasPortfolio = portfolioExists();
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

      {/* Portfolio en PDF : affiché seulement si le fichier public/portfolio.pdf existe */}
      {(hasPortfolio || process.env.NODE_ENV === "development") && (
        <section aria-labelledby="portfolio-title" className="mt-16 border-t border-neutral-900 pt-12">
          <BlurText as="h2" id="portfolio-title" delay={0.3} textKey="contact.portfolio.title" className={eyebrow}>
            {t["contact.portfolio.title"]}
          </BlurText>
          <Reveal delay={0.4}>
            {hasPortfolio ? (
              <a
                href={PORTFOLIO_URL}
                download={PORTFOLIO_DOWNLOAD_NAME}
                className={`mt-6 inline-flex items-center gap-3 border border-neutral-700 px-6 py-3 text-sm text-neutral-100 transition-colors duration-300 hover:border-neutral-100 hover:bg-neutral-100 hover:text-neutral-950 ${focusRing}`}
              >
                <span {...editable("contact.portfolio")}>{shown(t["contact.portfolio"])}</span>
                <span className="sr-only"> (PDF)</span>
              </a>
            ) : null}
          </Reveal>
          {/* Mode édition local : déposer, remplacer ou retirer le PDF */}
          <DevPortfolioDropSlot exists={hasPortfolio} />
        </section>
      )}
    </div>
  );
}
