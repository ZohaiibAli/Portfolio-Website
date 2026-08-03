import { motion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * Reading-progress rail pinned above the navbar. The glow head rides the end of
 * the fill so the bar reads as a light travelling across the page.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.0005 });
  const headLeft = useTransform(scaleX, (v) => `${v * 100}%`);
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
          background: "linear-gradient(90deg, #2563EB 0%, #22D3EE 50%, #A78BFA 100%)",
          boxShadow: "0 0 12px rgba(37,99,235,0.7)",
        }}
      />
      <motion.div
        className="absolute top-1/2 h-3 w-3 rounded-full"
        style={{
          left: headLeft,
          translateX: "-50%",
          translateY: "-50%",
          background: "#A78BFA",
          boxShadow: "0 0 16px rgba(167,139,250,0.9), 0 0 32px rgba(37,99,235,0.5)",
        }}
      />
    </motion.div>
  );
}
