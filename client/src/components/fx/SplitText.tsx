import type { CSSProperties, ElementType } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_OUT, VIEWPORT } from "@/lib/motion";

interface Props {
  text: string;
  /** `char` gives the cinematic per-letter roll; `word` is calmer for body copy. */
  by?: "char" | "word";
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  stagger?: number;
  /** Animate on mount instead of waiting for the viewport (hero headline). */
  immediate?: boolean;
}

const container = (stagger: number, delay: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

/* Each glyph pivots up from below its own baseline, rotating in 3D. The parent
   word clips it, so letters appear to be extruded out of the page. */
const glyph: Variants = {
  hidden: { y: "115%", opacity: 0, rotateX: -78 },
  show: {
    y: "0%",
    opacity: 1,
    rotateX: 0,
    transition: { duration: 0.85, ease: EASE_OUT },
  },
};

/**
 * Headline typesetter. Splits on words first so wrapping stays natural, then
 * optionally on characters, and clips each word to hide the pivot.
 */
export default function SplitText({
  text,
  by = "char",
  as: Tag = "span",
  className,
  style,
  delay = 0,
  stagger = 0.028,
  immediate = false,
}: Props) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  if (reduced) {
    return (
      <Tag className={className} style={style}>
        {text}
      </Tag>
    );
  }

  const motionProps = immediate
    ? { initial: "hidden" as const, animate: "show" as const }
    : { initial: "hidden" as const, whileInView: "show" as const, viewport: VIEWPORT };

  return (
    <Tag className={className} style={{ ...style, display: "inline-block" }}>
      <motion.span
        variants={container(stagger, delay)}
        {...motionProps}
        style={{ display: "inline-block", perspective: 640 }}
      >
        {words.map((word, wi) => (
          <span
            key={`${word}-${wi}`}
            style={{
              display: "inline-block",
              overflow: "hidden",
              // Descenders would be clipped by `overflow: hidden` alone.
              paddingBottom: "0.16em",
              marginBottom: "-0.16em",
              whiteSpace: "pre",
            }}
          >
            {by === "word" ? (
              <motion.span variants={glyph} style={{ display: "inline-block" }}>
                {word}
                {wi < words.length - 1 ? " " : ""}
              </motion.span>
            ) : (
              <>
                {word.split("").map((ch, ci) => (
                  <motion.span
                    key={ci}
                    variants={glyph}
                    style={{ display: "inline-block", transformOrigin: "bottom center" }}
                  >
                    {ch}
                  </motion.span>
                ))}
                {wi < words.length - 1 && (
                  <motion.span variants={glyph} style={{ display: "inline-block" }}>
                    {" "}
                  </motion.span>
                )}
              </>
            )}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
