import { useCallback, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useHasFinePointer } from "@/lib/usePointer";
import { useHoverRect } from "@/lib/useHoverRect";
import { useQuality } from "@/lib/useQuality";

interface Props {
  children: ReactNode;
  /** Maximum rotation on each axis, in degrees. */
  max?: number;
  /** Lift toward the viewer on hover, in px of translateZ. */
  lift?: number;
  /** Moving specular highlight that tracks the pointer. */
  glare?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 3D tilt with a real specular sweep.
 *
 * The card rotates toward the pointer while a radial highlight tracks the exact
 * cursor position across its surface — the combination is what sells it as a
 * physical, lit object rather than a skewed rectangle.
 */
export default function TiltCard({
  children,
  max = 9,
  lift = 24,
  glare = true,
  className,
  style,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useHasFinePointer();
  const reduced = useReducedMotion();
  const high = useQuality() === "high";
  const active = fine && !reduced;
  const [hovered, setHovered] = useState(false);
  const bounds = useHoverRect(ref);

  // Normalised pointer position within the card, -0.5 … 0.5.
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const spring = { stiffness: 240, damping: 24, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), spring);
  const z = useSpring(hovered ? lift : 0, spring);

  // Glare origin in percentages, ready for a radial-gradient.
  const gx = useTransform(px, [-0.5, 0.5], ["0%", "100%"]);
  const gy = useTransform(py, [-0.5, 0.5], ["0%", "100%"]);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 26%, transparent 58%)`;

  const onMove = useCallback(
    (e: React.PointerEvent) => {
      const r = bounds.get();
      if (!r) return;
      px.set((e.clientX - r.left) / r.width - 0.5);
      py.set((e.clientY - r.top) / r.height - 0.5);
    },
    [bounds, px, py]
  );

  const onEnter = useCallback(() => {
    bounds.enter();
    setHovered(true);
  }, [bounds]);

  const onLeave = useCallback(() => {
    bounds.leave();
    px.set(0);
    py.set(0);
    setHovered(false);
  }, [bounds, px, py]);

  if (!active) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <div className={className} style={{ ...style, perspective: 1100 }}>
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        style={{
          rotateX,
          rotateY,
          z,
          transformStyle: "preserve-3d",
          position: "relative",
          borderRadius: "inherit",
        }}
      >
        {children}

        {/* The specular sweep repaints the card's background on every frame of
            the hover and blends it against what it lights. That's a fair price
            for one card at a time on a capable machine, and the first thing
            worth dropping otherwise — the tilt alone still reads as physical. */}
        {glare && high && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: glareBg,
              borderRadius: "inherit",
              mixBlendMode: "soft-light",
              // Float the highlight just above the surface it's lighting.
              transform: "translateZ(1px)",
            }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.28 }}
          />
        )}
      </motion.div>
    </div>
  );
}
