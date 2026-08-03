import { useEffect, useState } from "react";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";
import { SPRING_SOFT } from "./motion";

export interface Pointer {
  /** Raw viewport pixel position. */
  x: MotionValue<number>;
  y: MotionValue<number>;
  /** Spring-smoothed position — use for anything large and laggy-by-design. */
  sx: MotionValue<number>;
  sy: MotionValue<number>;
}

/**
 * Viewport pointer position as motion values.
 *
 * The previous implementation stored the cursor in React state in six separate
 * sections, so every mouse move triggered six re-renders of the whole page.
 * Motion values are written outside React, so the cursor drives transforms at
 * 60fps with zero renders.
 */
export function usePointer(): Pointer {
  const x = useMotionValue(typeof window === "undefined" ? 0 : window.innerWidth / 2);
  const y = useMotionValue(typeof window === "undefined" ? 0 : window.innerHeight / 2);
  const sx = useSpring(x, SPRING_SOFT);
  const sy = useSpring(y, SPRING_SOFT);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  return { x, y, sx, sy };
}

/**
 * True only for devices with a real hover-capable pointer. Guards the custom
 * cursor and every hover-only affordance so touch users are never stranded.
 */
export function useHasFinePointer(): boolean {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setFine(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return fine;
}
