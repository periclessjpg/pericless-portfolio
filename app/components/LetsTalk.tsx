import { site } from "../data/site";
import BlurText from "./BlurText";
import Reveal from "./motion/Reveal";
import { focusRing, titleMedium } from "./styles";

/** Section "Let's talk !" en bas des pages Concept Art et Illustration. */
export default function LetsTalk() {
  return (
    <section aria-labelledby="lets-talk-title" className="mt-32 md:mt-48">
      <BlurText
        as="h2"
        id="lets-talk-title"
        className={`${titleMedium} text-neutral-100`}
      >
        Let&apos;s talk !
      </BlurText>
      <Reveal delay={0.3}>
        <a
          href={`mailto:${site.email}`}
          className={`mt-8 inline-block break-all text-xl text-neutral-300 underline decoration-neutral-700 underline-offset-8 transition-colors duration-300 hover:text-neutral-100 hover:decoration-neutral-100 sm:text-2xl md:text-3xl ${focusRing}`}
        >
          {site.email}
        </a>
      </Reveal>
    </section>
  );
}
