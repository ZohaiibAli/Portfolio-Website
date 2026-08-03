import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE_OUT, EASE_SOFT } from "@/lib/motion";

const NAME = "ZOHAIB ALI";
const PANELS = 6;

interface Props {
  onDone: () => void;
}

/**
 * Entry sequence: a counter runs to 100 while the name assembles letter by
 * letter, then the screen shatters into vertical panels that sweep upward to
 * reveal the hero already mid-animation.
 *
 * Skipped entirely under `prefers-reduced-motion` — the page just appears.
 */
export default function Preloader({ onDone }: Props) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  const [exiting, setExiting] = useState(false);

  // Ease the counter so it decelerates into 100 instead of ticking linearly.
  useEffect(() => {
    if (reduced) {
      onDone();
      setExiting(true);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const DURATION = 1750;

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        // Let the hero mount and start its own entrance under the curtain.
        onDone();
        setTimeout(() => setExiting(true), 260);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, onDone]);

  useEffect(() => {
    document.body.style.overflow = exiting ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [exiting]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="preloader"
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex: 10001 }}
          exit={{ transition: { duration: 0.9 } }}
        >
          {/* Shatter panels — each leaves on its own beat. */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: PANELS }).map((_, i) => (
              <motion.div
                key={i}
                className="h-full flex-1"
                // Sweep upward: the panel collapses toward its top edge.
                style={{ background: "#060A12", transformOrigin: "top" }}
                initial={{ scaleY: 1 }}
                animate={{ scaleY: 1 }}
                exit={{ scaleY: 0 }}
                transition={{ duration: 0.85, ease: EASE_OUT, delay: i * 0.055 }}
              />
            ))}
          </div>

          {/* Content sits above the panels and fades before they part. */}
          <motion.div
            className="relative flex flex-col items-center gap-8"
            exit={{ opacity: 0, y: -24, filter: "blur(12px)", transition: { duration: 0.45, ease: EASE_OUT } }}
          >
            {/* Name — letters drop in from a clipped baseline. */}
            <div className="flex overflow-hidden" style={{ paddingBottom: "0.14em" }}>
              {NAME.split("").map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.055, duration: 0.75, ease: EASE_OUT }}
                  className="grad-text"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: "clamp(1.6rem, 7vw, 3.4rem)",
                    letterSpacing: "0.12em",
                    display: "inline-block",
                    whiteSpace: "pre",
                  }}
                >
                  {ch}
                </motion.span>
              ))}
            </div>

            {/* Loading rail */}
            <div className="relative" style={{ width: "min(58vw, 300px)", height: 1, background: "rgba(255,255,255,0.09)" }}>
              <motion.div
                className="absolute inset-y-0 left-0"
                style={{
                  background: "linear-gradient(90deg, #2563EB, #22D3EE, #A78BFA)",
                  boxShadow: "0 0 14px rgba(37,99,235,0.8)",
                  width: `${count}%`,
                }}
              />
            </div>

            <div
              className="mono flex w-full items-center justify-between"
              style={{ width: "min(58vw, 300px)", fontSize: 11, letterSpacing: "0.18em", color: "#334155" }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                BUILDING INTERFACE
              </motion.span>
              <span style={{ color: "#60A5FA" }}>{String(count).padStart(3, "0")}</span>
            </div>
          </motion.div>

          {/* Hairline that snaps shut as the curtain lifts. */}
          <motion.div
            className="absolute left-0 right-0 top-1/2 h-px"
            style={{ background: "linear-gradient(90deg, transparent, #2563EB, transparent)" }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.6 }}
            exit={{ scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE_SOFT }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
