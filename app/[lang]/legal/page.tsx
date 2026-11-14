import { Fragment } from "react";
import BlurText from "../../components/BlurText";
import EmailLink from "../../components/EmailLink";
import Reveal from "../../components/motion/Reveal";
import PageHeader from "../../components/PageHeader";
import { container, eyebrow, focusRing, titleMedium } from "../../components/styles";
import { site } from "../../data/site";
import { legalSections, updated } from "../../data/legal";
import { getLocale } from "../../lib/locale";
import { pageMetadata } from "../../lib/metadata";
import { getTexts } from "../../lib/texts";
import { editable } from "../../lib/texts-defaults";

export async function generateMetadata() {
  return pageMetadata({
    title: { en: "Legal notice", fr: "Mentions légales" },
    description: {
      en: "Legal notice of Rayan Houstti's portfolio: publisher, hosting, intellectual property and personal data.",
      fr: "Mentions légales du portfolio de Rayan Houstti : éditeur, hébergement, propriété intellectuelle et données personnelles.",
    },
    path: "/legal",
  });
}

const emailClass = `text-neutral-200 underline decoration-neutral-700 underline-offset-4 transition-colors duration-300 hover:decoration-neutral-100 ${focusRing}`;

/** Mentions légales : textes dans app/data/legal.ts. */
export default async function LegalPage() {
  const t = await getTexts();
  const locale = await getLocale();
  const fillName = (text: string) => text.replaceAll("{name}", t["nav.name"] || site.name);

  return (
    <div className={`${container} pt-32 md:pt-44`}>
      <PageHeader
        label={t["legal.eyebrow"]}
        title={t["legal.title"]}
        keys={{ label: "legal.eyebrow", title: "legal.title" }}
      >
        <p className={eyebrow}>
          <span {...editable("legal.updated")}>{t["legal.updated"]}</span> {updated[locale]}
        </p>
      </PageHeader>

      <div className="flex max-w-3xl flex-col gap-16 border-t border-neutral-900 pt-12">
        {legalSections.map((section, index) => (
          <section key={section.title.en} aria-labelledby={`legal-${index}`}>
            <BlurText as="h2" id={`legal-${index}`} className={`${titleMedium} text-neutral-100`}>
              {section.title[locale]}
            </BlurText>
            <Reveal delay={0.15}>
              <div className="mt-6 flex flex-col gap-4 leading-relaxed text-neutral-400">
                {section.paragraphs[locale].map((paragraph) => (
                  <p key={paragraph} className="whitespace-pre-line">
                    {/* {email} : lien email protégé contre le spam (EmailLink) */}
                    {fillName(paragraph)
                      .split("{email}")
                      .map((part, i) => (
                        <Fragment key={i}>
                          {i > 0 && <EmailLink className={emailClass} />}
                          {part}
                        </Fragment>
                      ))}
                  </p>
                ))}
              </div>
            </Reveal>
          </section>
        ))}
      </div>
    </div>
  );
}
