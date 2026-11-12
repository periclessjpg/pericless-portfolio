import Link from "next/link";
import BlurText from "../../components/BlurText";
import { container, eyebrow, focusRing, titleLarge } from "../../components/styles";

export default function ProjectNotFound() {
  return (
    <div className={`${container} flex min-h-[70svh] flex-col justify-center pt-32`}>
      <p className={eyebrow}>Error 404</p>
      <BlurText
        as="h1"
        className={`${titleLarge} mt-6 text-neutral-100`}
      >
        Project not found
      </BlurText>
      <p className="mt-8 max-w-xl text-lg text-neutral-400">
        This project does not exist or has been moved.
      </p>
      <Link
        href="/projects"
        className={`mt-10 inline-block self-start text-sm text-neutral-400 underline decoration-neutral-700 underline-offset-8 transition-colors duration-300 hover:text-neutral-100 hover:decoration-neutral-100 ${focusRing}`}
      >
        Back to all projects
      </Link>
    </div>
  );
}
