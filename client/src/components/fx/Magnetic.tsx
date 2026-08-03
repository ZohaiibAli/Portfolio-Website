import { useCallback, useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useHasFinePointer } from "@/lib/usePointer";
import { SPRING_SNAP } from "@/lib/motion";

interface Props {
  children: ReactNode;
  /** How far the element chases the pointer, as a fraction of the offset. */
  strength?: number;
  /** Extra hit area around the element that still attracts, in px. */
  radius?: number;
  className?: string;
}

/**
 * Pulls its child toward the cursor while hovered and springs it home on exit.
 * Wraps the primary CTAs and nav items — the button reaches for you before you
 * reach it, which makes the whole page feel physically responsive.
 */
export default function Magnetic({ children, strength = 0.35, radius = 0, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useHasFinePointer();
  const reduced = useReducedMotion();
  const active = fine && !reduced;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, SPRING_SNAP);
  const sy = useSpring(y, SPRING_SNAP);

  const onMove = useCallback(
    (e: React.PointerEvent) => {
      const el = ref.current;
      if (!el || !active) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      x.set((e.clientX - cx) * strength);
      y.set((e.clientY - cy) * strength);
    },
    [active, strength, x, y]
  );

  const onLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  if (!active) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x: sx, y: sy, display: "inline-block", padding: radius, margin: -radius }}
    >
      {children}
    </motion.div>
  );
}
