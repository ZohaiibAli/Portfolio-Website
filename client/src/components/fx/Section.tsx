import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

interface Props {
  id: string;
  label: string;
  children: ReactNode;
  /** Adds the hairline rule along the top edge. */
  divider?: boolean;
  className?: string;
}

/**
 * Wrapper every content section shares.
 *
 * Beyond layout, it drives a scroll-linked "depth" effect: a section recedes
 * (scales down, fades) as it leaves the viewport and resolves as it arrives, so
 * scrolling reads as moving through a stack of planes rather than sliding a
 * flat document.
 *
 * The recede used to include `filter: blur()`. That is the single most
 * expensive thing you can drive from scroll: the browser must re-rasterise the
 * entire section — every card, every glyph — and run a Gaussian over it on each
 * frame, and with these section heights two sections are mid-transition at any
 * moment. Scale and opacity alone are pure compositor properties; the sense of
 * depth survives, the main thread stays free.
 */
export default function Section({ id, label, children, divider = true, className }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Shallower than the old curve — without the blur softening the edges, a
  // deep scale reads as a jump rather than as distance.
  const scale = useTransform(scrollYProgress, [0, 0.16, 0.84, 1], [0.97, 1, 1, 0.97]);
  const opacity = useTransform(scrollYProgress, [0, 0.14, 0.86, 1], [0.45, 1, 1, 0.45]);

  return (
    <motion.section
      ref={ref}
      id={id}
      aria-label={label}
      className={`relative w-full ${className ?? ""}`}
      style={{
        paddingTop: "clamp(72px, 10vw, 112px)",
        paddingBottom: "clamp(80px, 11vw, 120px)",
        scale: reduced ? 1 : scale,
        opacity: reduced ? 1 : opacity,
        // Keeps the section on its own layer instead of promoting/demoting it
        // every time it enters and leaves the viewport. (`transform` itself is
        // owned by the motion values above, so this is the only safe hint.)
        willChange: reduced ? undefined : "transform, opacity",
      }}
    >
      {divider && (
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #1E3A5F 28%, rgba(37,99,235,0.55) 50%, #1E3A5F 72%, transparent 100%)",
          }}
        />
      )}

      <div
        className="relative mx-auto w-full"
        style={{
          maxWidth: 1200,
          paddingLeft: "clamp(1.25rem, 5vw, 4rem)",
          paddingRight: "clamp(1.25rem, 5vw, 4rem)",
        }}
      >
        {children}
      </div>
    </motion.section>
  );
}
