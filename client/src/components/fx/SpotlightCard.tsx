import { useCallback, useRef, useState, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from "framer-motion";
import { alpha } from "@/lib/motion";
import { useHoverRect } from "@/lib/useHoverRect";
import { useHasFinePointer } from "@/lib/usePointer";
import { useQuality } from "@/lib/useQuality";

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
  const high = useQuality() === "high";
  /* Touch has no hover, but it does have `pointerenter` — the browser fires it
     for the element under the finger. So dragging a page-worth of these cards
     past under a scrolling thumb ran the whole hover machinery anyway: a
     `getBoundingClientRect` (a forced layout flush) and a React re-render per
     card crossed, landing directly in the scroll gesture. There are sixteen of
     these on the page. Not wiring the handlers is the fix; the styling they
     drive is a pointer affordance that a touch device cannot use. */
  const hoverable = useHasFinePointer() && !reduced;
  const [hovered, setHovered] = useState(false);
  const bounds = useHoverRect(ref);

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
      const r = bounds.get();
      if (!r) return;
      mx.set(e.clientX - r.left);
      my.set(e.clientY - r.top);
    },
    [bounds, mx, my]
  );

  const onEnter = useCallback(() => {
    bounds.enter();
    setHovered(true);
  }, [bounds]);

  const onLeave = useCallback(() => {
    bounds.leave();
    setHovered(false);
    mx.set(-9999);
    my.set(-9999);
  }, [bounds, mx, my]);

  /* Glass is the most expensive property on the page: the browser must sample,
     blur and re-composite everything behind the card — and behind these cards
     is a canvas and a drifting aurora, so it can never be cached. With sixteen
     of them on screen it is the difference between 60fps and 20. On the low
     tier the panel is opaque enough to read as glass without sampling
     anything; a matching CSS rule strips the rest of the site's inline
     `backdrop-filter`s the same way. */
  const glass = high ? "blur(18px) saturate(140%)" : undefined;

  return (
    <div
      ref={ref}
      className={className}
      onPointerMove={hoverable && high ? onMove : undefined}
      onPointerEnter={hoverable ? onEnter : undefined}
      onPointerLeave={hoverable ? onLeave : undefined}
      style={{
        ...style,
        position: "relative",
        borderRadius: radius,
        background: high
          ? hovered
            ? "rgba(96,165,250,0.07)"
            : "rgba(96,165,250,0.04)"
          : hovered
          ? "rgba(12,20,40,0.92)"
          : "rgba(9,15,32,0.88)",
        border: "1px solid rgba(96,165,250,0.13)",
        backdropFilter: glass,
        WebkitBackdropFilter: glass,
        boxShadow: hovered
          ? `0 0 38px ${alpha(accent, 0.16)}, 0 22px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(96,165,250,0.11)`
          : "0 6px 28px rgba(0,0,0,0.34), inset 0 1px 0 rgba(96,165,250,0.055)",
        transition: "background 320ms ease, box-shadow 320ms ease",
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      {/* Glowing edge: paint the gradient, then mask everything but the border. */}
      {!reduced && high && (
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
      {!reduced && high && (
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
