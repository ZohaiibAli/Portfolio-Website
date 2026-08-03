import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useReducedMotion,
  wrap,
} from "framer-motion";

interface Props {
  items: string[];
  /** Base px/second. Negative scrolls right-to-left. */
  speed?: number;
  className?: string;
}

/**
 * Infinite marquee that reacts to scroll velocity — flick the page and the
 * ticker accelerates and even reverses, then eases back to its cruise speed.
 */
export default function Marquee({ items, speed = 42, className }: Props) {
  const reduced = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 48, stiffness: 380 });
  const velocityFactor = useTransform(smoothVelocity, [-1600, 0, 1600], [-4, 0, 4], {
    clamp: false,
  });

  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduced) return;

    const v = velocityFactor.get();
    // A hard scroll can flip the ticker's travel direction.
    direction.current = v < -0.1 ? -1 : v > 0.1 ? 1 : direction.current;

    let move = direction.current * speed * (delta / 1000);
    move += move * Math.abs(v);
    baseX.set(baseX.get() - move);
  });

  // The track renders two copies, so wrapping over a 50% span loops seamlessly.
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const track = [...items, ...items];

  return (
    <div
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        // Fade the ends so items don't pop in and out at hard edges.
        WebkitMaskImage:
          "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
        maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
      }}
    >
      <motion.div
        className="flex gap-3"
        style={{ x: reduced ? 0 : x, width: "max-content" }}
      >
        {track.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="mono whitespace-nowrap rounded-full"
            style={{
              padding: "6px 16px",
              fontSize: 12,
              letterSpacing: "0.06em",
              color: "#64748B",
              background: "rgba(255,255,255,0.035)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
