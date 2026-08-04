import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT, VIEWPORT } from "@/lib/motion";

type Direction = "up" | "down" | "left" | "right" | "none";

interface Props {
  children: ReactNode;
  /** Where the element travels in from. */
  from?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  /** Adds a scale-up; good for imagery and panels. */
  scale?: boolean;
  className?: string;
  as?: "div" | "section" | "li" | "span";
}

const OFFSET: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * Scroll-triggered entrance: content resolves from displaced into place. Used
 * everywhere instead of hand-rolled `initial`/`animate` pairs so timing stays
 * consistent across sections.
 *
 * The entrance used to animate `filter: blur(10px) → blur(0px)`. Blur is not a
 * compositor property — every frame of every reveal repaints the element, and
 * staggered lists fire dozens of them at once, exactly while the user is
 * scrolling. Travel plus a slight scale sells the same "resolves into place"
 * read on transform and opacity alone.
 */
export default function Reveal({
  children,
  from = "up",
  delay = 0,
  duration = 0.8,
  distance = 34,
  scale = false,
  className,
  as = "div",
}: Props) {
  const reduced = useReducedMotion();
  const Tag = motion[as];
  const dir = OFFSET[from];

  if (reduced) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag
      className={className}
      initial={{
        opacity: 0,
        x: dir.x * distance,
        y: dir.y * distance,
        scale: scale ? 0.94 : 0.985,
      }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={VIEWPORT}
      transition={{ duration, delay, ease: EASE_OUT }}
    >
      {children}
    </Tag>
  );
}
