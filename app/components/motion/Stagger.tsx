"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { duration, easeOut, offsetY } from "./easing";

const group: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: offsetY },
  visible: { opacity: 1, y: 0, transition: { duration, ease: easeOut } },
};

/**
 * Liste dont les éléments apparaissent l'un après l'autre (effet "cascade"),
 * quand la liste entre dans l'écran. Utilisée par les grilles de projets.
 */
export function StaggerList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.ul
      className={className}
      variants={group}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
    >
      {children}
    </motion.ul>
  );
}

/** Un élément de StaggerList. */
export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.li className={className} variants={item}>
      {children}
    </motion.li>
  );
}
