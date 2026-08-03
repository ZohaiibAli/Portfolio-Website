import { useCallback, useRef, useState, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from "framer-motion";
import { alpha } from "@/lib/motion";

interface Props {
  children: ReactNode;
  /** Drives the glow, the border tint and the underline. */
  accent?: string;
  className?: string;
  style?: React.CSSProperties;
  radius?: number;
  /** Adds the animated gradient underline along the bottom edge. */
  underline?: boolean;
}

/**
 * Glass panel whose border and interior light up around the pointer.
 *
 * Two layers do the work: a masked conic-free radial on the border box (so the
 * 1px edge itself glows near the cursor) and a soft interior wash. Both are
 * pointer-driven motion values, so hovering never re-renders React.
 */
export default function SpotlightCard({
  children,
  accent = "#60A5FA",
  className,
  style,
  radius = 18,
  underline = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);

  const border = useMotionTemplate`radial-gradient(220px circle at ${mx}px ${my}px, ${alpha(
    accent,
    0.75
  )}, transparent 70%)`;
  const wash = useMotionTemplate`radial-gradient(340px circle at ${mx}px ${my}px, ${alpha(
    accent,
    0.13
  )}, transparent 72%)`;

  const onMove = useCallback(
    (e: React.PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      mx.set(e.clientX - r.left);
      my.set(e.clientY - r.top);
    },
    [mx, my]
  );

  return (
    <div
      ref={ref}
      className={className}
      onPointerMove={reduced ? undefined : onMove}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false);
        mx.set(-9999);
        my.set(-9999);
      }}
      style={{
        ...style,
        position: "relative",
        borderRadius: radius,
        background: hovered ? "rgba(255,255,255,0.045)" : "rgba(255,255,255,0.022)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(18px) saturate(140%)",
        WebkitBackdropFilter: "blur(18px) saturate(140%)",
        boxShadow: hovered
          ? `0 0 38px ${alpha(accent, 0.16)}, 0 22px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)`
          : "0 6px 28px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.035)",
        transition: "background 320ms ease, box-shadow 320ms ease",
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      {/* Glowing edge: paint the gradient, then mask everything but the border. */}
      {!reduced && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            borderRadius: radius,
            padding: 1,
            background: border,
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            opacity: hovered ? 1 : 0,
            transition: "opacity 300ms ease",
          }}
        />
      )}

      {/* Interior wash */}
      {!reduced && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            borderRadius: radius,
            background: wash,
            opacity: hovered ? 1 : 0,
            transition: "opacity 300ms ease",
          }}
        />
      )}

      <div style={{ position: "relative", height: "100%" }}>{children}</div>

      {underline && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 right-0"
          style={{
            height: 2,
            background: hovered
              ? `linear-gradient(90deg, transparent, ${accent}, transparent)`
              : "transparent",
            transition: "background 320ms ease",
          }}
        />
      )}
    </div>
  );
}
