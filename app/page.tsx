export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-neutral-950 text-neutral-100">
      <header className="flex items-center justify-between px-8 py-6 md:px-16">
        <span className="text-sm font-semibold uppercase tracking-[0.3em]">
          Pericless
        </span>
        <nav className="hidden gap-8 text-sm text-neutral-400 md:flex">
          <span>Projects</span>
          <span>Character Design</span>
          <span>Environment Design</span>
          <span>About</span>
          <span>Contact</span>
        </nav>
      </header>

      <section className="flex flex-1 flex-col justify-center px-8 pb-24 md:px-16">
        <p className="mb-6 text-xs uppercase tracking-[0.4em] text-neutral-500 md:text-sm">
          Concept Artist · Illustrator · Graphic Designer
        </p>
        <h1 className="text-6xl font-bold leading-none tracking-tight sm:text-8xl md:text-9xl">
          Pericless
        </h1>
        <p className="mt-8 max-w-xl text-lg text-neutral-400">
          Concept art pour le jeu vidéo et l&apos;animation.
        </p>
      </section>
    </main>
  );
}