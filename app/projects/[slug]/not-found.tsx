import Link from "next/link";
import BlurText from "../../components/BlurText";
import { container, eyebrow, focusRing, titleLarge } from "../../components/styles";
import { getTexts } from "../../lib/texts";
import { editable, shown } from "../../lib/texts-defaults";

export default function ProjectNotFound() {
  const t = getTexts();

  return (
    <div className={`${container} flex min-h-[70svh] flex-col justify-center pt-32`}>
      <p className={eyebrow} {...editable("notFound.eyebrow")}>
        {shown(t["notFound.eyebrow"])}
      </p>
      <BlurText as="h1" textKey="notFound.title" className={`${titleLarge} mt-6 text-neutral-100`}>
        {t["notFound.title"]}
      </BlurText>
      <p className="mt-8 max-w-xl whitespace-pre-line text-lg text-neutral-400" {...editable("notFound.text")}>
        {shown(t["notFound.text"])}
      </p>
      <Link
        href="/projects"
        className={`mt-10 inline-block self-start text-sm text-neutral-400 underline decoration-neutral-700 underline-offset-8 transition-colors duration-300 hover:text-neutral-100 hover:decoration-neutral-100 ${focusRing}`}
        {...editable("notFound.link")}
      >
        {shown(t["notFound.link"])}
      </Link>
    </div>
  );
}
