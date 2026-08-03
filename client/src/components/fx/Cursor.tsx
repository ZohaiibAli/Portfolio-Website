import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useHasFinePointer } from "@/lib/usePointer";
import { SPRING_CURSOR, SPRING_SNAP } from "@/lib/motion";

type Mode = "idle" | "link" | "text" | "hidden";

/** What kind of thing is under the pointer, so the cursor can respond to it. */
function modeFor(el: Element | null): Mode {
  if (!el) return "idle";
  if (el.closest("input, textarea, [contenteditable='true']")) return "text";
  if (el.closest("a, button, [role='button'], [data-cursor='link']")) return "link";
  return "idle";
}

const RING_SIZE: Record<Mode, number> = { idle: 34, link: 62, text: 8, hidden: 0 };

/**
 * Two-part cursor: a 1px dot that tracks instantly and a ring that trails on a
 * spring. The ring inflates over anything interactive and collapses into a
 * caret over text inputs, so the pointer itself becomes an affordance.
 *
 * Only mounted for hover-capable, fine pointers — touch and reduced-motion
 * users keep the native cursor.
 */
export default function Cursor() {
  const fine = useHasFinePointer();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;

  const [mode, setMode] = useState<Mode>("hidden");
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, SPRING_CURSOR);
  const ringY = useSpring(y, SPRING_CURSOR);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setMode((prev) => {
        const next = modeFor(e.target as Element);
        return next === prev ? prev : next;
      });
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setMode("hidden");
    const onEnter = () => setMode("idle");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    // Hide the OS cursor only once we know we're taking over.
    document.documentElement.style.cursor = "none";

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      document.documentElement.style.cursor = "";
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const visible = mode !== "hidden";
  const size = RING_SIZE[mode];

  return (
    <>
      {/* Ring — trails, inflates, and inverts whatever it passes over. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 rounded-full"
        style={{
          x: ringX,
          y: ringY,
          zIndex: 10000,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: "difference",
        }}
        animate={{
          width: size,
          height: size,
          opacity: visible ? 1 : 0,
          scale: pressed ? 0.82 : 1,
        }}
        transition={SPRING_SNAP}
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            border: mode === "text" ? "none" : "1px solid rgba(255,255,255,0.85)",
            background:
              mode === "link"
                ? "rgba(255,255,255,0.14)"
                : mode === "text"
                ? "rgba(255,255,255,0.9)"
                : "transparent",
          }}
        />
      </motion.div>

      {/* Dot — 1:1 with the hardware pointer so aim never feels laggy. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 rounded-full"
        style={{
          x,
          y,
          zIndex: 10000,
          width: 5,
          height: 5,
          translateX: "-50%",
          translateY: "-50%",
          background: "#60A5FA",
          boxShadow: "0 0 12px rgba(96,165,250,0.9)",
        }}
        animate={{ opacity: visible && mode !== "text" ? 1 : 0, scale: mode === "link" ? 0 : 1 }}
        transition={{ duration: 0.18 }}
      />
    </>
  );
}
