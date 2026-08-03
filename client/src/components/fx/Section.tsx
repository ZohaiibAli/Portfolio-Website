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
 * (scales down, fades, blurs) as it leaves the viewport and resolves as it
 * arrives, so scrolling reads as moving through a stack of planes rather than
 * sliding a flat document.
 */
export default function Section({ id, label, children, divider = true, className }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.16, 0.84, 1], [0.955, 1, 1, 0.955]);
  const opacity = useTransform(scrollYProgress, [0, 0.14, 0.86, 1], [0.35, 1, 1, 0.35]);
  const blur = useTransform(scrollYProgress, [0, 0.14, 0.86, 1], [6, 0, 0, 6]);
  // Emit `none` once the blur is imperceptible: a live `blur(0px)` filter still
  // forces a compositing layer (and a containing block) for the whole section.
  const filter = useTransform(blur, (b) => (b < 0.05 ? "none" : `blur(${b}px)`));

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
        filter: reduced ? undefined : filter,
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
