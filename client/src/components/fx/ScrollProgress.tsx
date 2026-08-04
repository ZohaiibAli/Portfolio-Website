import { useEffect, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useAmbient } from "@/lib/useAmbient";

/**
 * Reading-progress rail pinned above the navbar. The glow head rides the end of
 * the fill so the bar reads as a light travelling across the page.
 *
 * The fill itself is a `scaleX` on a gradient — a compositor property, free at
 * any refresh rate. The head is not free at any price the low tier can pay: it
 * carries two large box-shadows, so every frame it moves repaints a ~64px halo
 * on a fixed element layered over the whole page. High tier only; the bar alone
 * still says how far down the page you are.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const head = useAmbient();

  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.0005 });

  /* The head used to ride on `left: <percent>`, which is a layout property: the
     browser re-ran layout for a fixed-position element on every frame of every
     scroll, all session. `x` is the same movement as a transform, but it needs
     pixels — a percentage on `x` resolves against the element's own 12px width,
     not the rail's. So the viewport width is cached and refreshed on resize
     rather than read per frame, since reading `innerWidth` mid-scroll forces
     the same layout flush this change exists to avoid. */
  const railWidth = useRef(typeof window === "undefined" ? 0 : window.innerWidth);

  useEffect(() => {
    const onResize = () => {
      railWidth.current = window.innerWidth;
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const headX = useTransform(scaleX, (v) => v * railWidth.current);
  // Fully transparent at the very top so it doesn't sit as a stray dot.
  const opacity = useTransform(scrollYProgress, [0, 0.01], [0, 1]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 right-0"
      style={{ height: 2, zIndex: 9999, opacity }}
    >
      <motion.div
        className="h-full origin-left"
        style={{
          scaleX,
          background: "linear-gradient(90deg, #1D4ED8 0%, #38BDF8 50%, #22D3EE 100%)",
          boxShadow: "0 0 12px rgba(37,99,235,0.7)",
        }}
      />
      {head && (
        <motion.div
          className="absolute left-0 top-1/2 h-3 w-3 rounded-full"
          style={{
            x: headX,
            translateX: "-50%",
            translateY: "-50%",
            background: "#7DD3FC",
            boxShadow: "0 0 16px rgba(125,211,252,0.9), 0 0 32px rgba(37,99,235,0.5)",
          }}
        />
      )}
    </motion.div>
  );
}
