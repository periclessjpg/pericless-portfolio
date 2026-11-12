"use client";

// Animation "cartes distribuées" : chaque carte glisse depuis le bas, légèrement
// inclinée, puis se redresse à sa place, l'une après l'autre. Une seule fois.
// Avec "réduire les animations", seul le fondu reste (MotionConfig reducedMotion="user").

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { easeOut } from "./easing";

const group: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

const card: Variants = {
  // index : alterne l'inclinaison de départ (gauche, droite…), comme une main de cartes.
  hidden: (index: number) => ({
    opacity: 0,
    y: 120,
    rotate: index % 2 === 0 ? -8 : 8,
    scale: 0.94,
  }),
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: { duration: 0.9, ease: easeOut },
  },
};

/** Liste de cartes qui arrivent comme des cartes distribuées. */
export function DealtList({ children, className }: { children: ReactNode; className?: string }) {
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

/** Une carte de DealtList. */
export function DealtItem({ children, className, index }: { children: ReactNode; className?: string; index: number }) {
  return (
    <motion.li className={className} variants={card} custom={index} style={{ transformOrigin: "50% 100%" }}>
      {children}
    </motion.li>
  );
}
