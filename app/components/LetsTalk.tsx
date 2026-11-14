import { getTexts } from "../lib/texts";
import BlurText from "./BlurText";
import EmailLink from "./EmailLink";
import Reveal from "./motion/Reveal";
import { focusRing, titleMedium } from "./styles";

/** Section "Let's talk !" en bas des pages Concept Art et Illustration. */
export default async function LetsTalk() {
  const t = await getTexts();

  return (
    <section aria-labelledby="lets-talk-title" className="mt-32 md:mt-48">
      <BlurText
        as="h2"
        id="lets-talk-title"
        textKey="common.letsTalk"
        className={`${titleMedium} text-neutral-100`}
      >
        {t["common.letsTalk"]}
      </BlurText>
      <Reveal delay={0.3}>
        <EmailLink className={`mt-8 inline-block break-all text-xl text-neutral-300 underline decoration-neutral-700 underline-offset-8 transition-colors duration-300 hover:text-neutral-100 hover:decoration-neutral-100 sm:text-2xl md:text-3xl ${focusRing}`} />
      </Reveal>
    </section>
  );
}
