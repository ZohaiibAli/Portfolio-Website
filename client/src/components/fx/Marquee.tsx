import { useEffect, useRef, useState, type ReactNode } from "react";
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
import { useAmbient } from "@/lib/useAmbient";

interface Props {
  items: string[];
  /** Base px/second. Negative scrolls right-to-left. */
  speed?: number;
  className?: string;
}

const FRAME: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  // Fade the ends so items don't pop in and out at hard edges.
  WebkitMaskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
  maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
};

const CHIP: React.CSSProperties = {
  padding: "6px 16px",
  fontSize: 12,
  letterSpacing: "0.06em",
  color: "#607E9E",
  background: "rgba(96,165,250,0.055)",
  border: "1px solid rgba(96,165,250,0.13)",
};

/** The track renders two copies, so a 50% span loops seamlessly. */
function chips(items: string[]): ReactNode {
  return [...items, ...items].map((item, i) => (
    <span key={`${item}-${i}`} className="mono whitespace-nowrap rounded-full" style={CHIP}>
      {item}
    </span>
  ));
}

/**
 * Scroll-velocity ticker: flick the page and it accelerates and even reverses,
 * then eases back to its cruise speed.
 *
 * Three stages of it recompute on every scroll frame — differentiate the scroll
 * position, spring it, remap it — plus a frame loop writing a transform, all on
 * the main thread, all to modulate the speed of a decorative ticker. Worth it
 * where there's headroom; see `Cruise` for where there isn't.
 */
function Reactive({ items, speed, className }: Required<Omit<Props, "className">> & { className?: string }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();

  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 48, stiffness: 380 });
  const velocityFactor = useTransform(smoothVelocity, [-1600, 0, 1600], [-4, 0, 4], {
    clamp: false,
  });

  const direction = useRef(1);

  // The ticker sits in the hero, so it spends most of the session scrolled
  // past — but its frame loop and velocity spring ran regardless, for the life
  // of the page. Nothing should animate where it cannot be seen.
  const hostRef = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      rootMargin: "120px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    if (!onScreen) return;

    const v = velocityFactor.get();
    // A hard scroll can flip the ticker's travel direction.
    direction.current = v < -0.1 ? -1 : v > 0.1 ? 1 : direction.current;

    let move = direction.current * speed * (delta / 1000);
    move += move * Math.abs(v);
    baseX.set(baseX.get() - move);
  });

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  return (
    <div ref={hostRef} className={className} style={FRAME}>
      <motion.div className="flex gap-3" style={{ x, width: "max-content" }}>
        {chips(items)}
      </motion.div>
    </div>
  );
}

/**
 * The same ticker with the scroll reactivity removed and the movement handed to
 * CSS — a single keyframe pair from 0 to -50%, which is exactly where the JS
 * version's `wrap` jumped, so the seam lands in the same place and the loop is
 * invisible.
 *
 * This is a separate component rather than a branch inside one, because a
 * branch would not have helped: hooks run unconditionally, so the velocity
 * chain would still recompute on every scroll frame and the frame loop would
 * still be scheduled, both feeding a value nothing read. Not mounting them is
 * the only way to not pay for them. What's left runs on the compositor, so the
 * main thread hears about the ticker exactly once, at mount.
 */
function Cruise({ items, speed, className }: Required<Omit<Props, "className">> & { className?: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  // Seconds per lap. The track is `max-content`, so half its scroll width is
  // one full copy of the items, and that over px/second is a lap.
  const [lap, setLap] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const measure = () => {
      const half = el.scrollWidth / 2;
      setLap(half > 0 ? half / Math.abs(speed) : 0);
    };
    measure();
    // Font swap and reflow both change the track's width after first paint.
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [speed]);

  return (
    <div className={className} style={FRAME}>
      <div
        ref={trackRef}
        className="flex gap-3"
        style={{
          width: "max-content",
          // Held still until the first measurement lands, so the track can't
          // sweep past at a placeholder speed on the way in.
          animation: lap > 0 ? `marquee-cruise ${lap}s linear infinite` : undefined,
          animationDirection: speed < 0 ? "reverse" : undefined,
        }}
      >
        {chips(items)}
      </div>
    </div>
  );
}

/** Infinite marquee. Reactive where there's headroom for it, cruising below. */
export default function Marquee({ items, speed = 42, className }: Props) {
  const reduced = useReducedMotion();
  const reactive = useAmbient();

  if (reduced) {
    return (
      <div className={className} style={FRAME}>
        <div className="flex gap-3" style={{ width: "max-content" }}>
          {chips(items)}
        </div>
      </div>
    );
  }

  return reactive ? (
    <Reactive items={items} speed={speed} className={className} />
  ) : (
    <Cruise items={items} speed={speed} className={className} />
  );
}
