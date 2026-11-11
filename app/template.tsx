"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { easeOut } from "./components/motion/easing";
import { recordPageVisit } from "./lib/navigation-history";

/**
 * Transition discrète entre les pages : la nouvelle page apparaît en fondu
 * avec un très léger glissement. Next.js affiche ce "template" autour de chaque page.
 */
export default function Template({ children }: { children: ReactNode }) {
  // La clé change à chaque page, y compris d'un projet à l'autre,
  // pour que la transition se rejoue à chaque navigation.
  const pathname = usePathname();

  // Note chaque page vue, pour que le bouton "Back" sache s'il peut revenir en arrière.
  useEffect(() => {
    recordPageVisit(pathname);
  }, [pathname]);

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}
