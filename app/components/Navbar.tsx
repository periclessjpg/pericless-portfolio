"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/character-design", label: "Character Design" },
  { href: "/environment-design", label: "Environment Design" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="absolute inset-x-0 top-0 z-50 flex items-center justify-between px-8 py-6 md:px-16">
      <Link
        href="/"
        className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-100"
      >
        Pericless
      </Link>
      <nav className="hidden gap-8 text-sm md:flex">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              pathname === link.href
                ? "text-neutral-100"
                : "text-neutral-500 transition-colors hover:text-neutral-100"
            }
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}