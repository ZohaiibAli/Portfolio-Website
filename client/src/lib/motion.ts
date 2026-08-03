import type { Transition, Variants } from "framer-motion";

/* ── Easings ──────────────────────────────────────────────────────────────
   One vocabulary of curves so every section decelerates the same way.       */

export type Cubic = [number, number, number, number];

/** Long, confident deceleration — the default for entrances. */
export const EASE_OUT: Cubic = [0.22, 1, 0.36, 1];
/** Softer settle for large surfaces (panels, images, editors). */
export const EASE_SOFT: Cubic = [0.25, 0.46, 0.45, 0.94];
/** Slight overshoot — pills, badges, icon pops. */
export const EASE_BACK: Cubic = [0.34, 1.56, 0.64, 1];
/** Symmetric — for loops that must not feel like they restart. */
export const EASE_INOUT: Cubic = [0.65, 0, 0.35, 1];

/* ── Springs ──────────────────────────────────────────────────────────── */

export const SPRING_SNAP: Transition = { type: "spring", stiffness: 420, damping: 32, mass: 0.7 };
export const SPRING_SOFT: Transition = { type: "spring", stiffness: 180, damping: 26, mass: 1 };
export const SPRING_CURSOR: Transition = { type: "spring", stiffness: 550, damping: 40, mass: 0.4 };

/* ── Shared variants ──────────────────────────────────────────────────────
   Blur is the signature of the entrance: things resolve into focus rather
   than simply sliding, which reads far more "rendered" than a plain fade.   */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: EASE_OUT },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: EASE_OUT } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE_BACK } },
};

/** Container that walks its children in. `stagger()` tunes the cadence. */
export const stagger = (each = 0.07, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: each, delayChildren: delay } },
});

/* ── Viewport defaults ────────────────────────────────────────────────────
   `amount: 0.2` fires once a fifth of the element is showing, which avoids
   tall sections animating only after the user has scrolled past the top.    */

export const VIEWPORT = { once: true, amount: 0.2 } as const;
export const VIEWPORT_EAGER = { once: true, amount: 0.05 } as const;

/* ── Utilities ────────────────────────────────────────────────────────── */

export const clamp = (v: number, min: number, max: number): number =>
  Math.min(Math.max(v, min), max);

/** Hex + 0-1 alpha → `rgba()`. Keeps accent glows readable in source. */
export function alpha(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}
