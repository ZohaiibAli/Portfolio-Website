import type { CSSProperties, ElementType } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useRichEntrance } from "@/lib/useAmbient";
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

/* The same move without the third dimension. `rotateX` is what makes the
   pivot expensive rather than merely animated: a rotated element is text the
   browser has to re-rasterise at a new projection on every frame, and it
   cannot share a layer with its neighbours. Sliding up from behind the clip
   edge reads almost identically and is a pure translate. */
const glyphFlat: Variants = {
  hidden: { y: "115%", opacity: 0 },
  show: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

/**
 * Headline typesetter. Splits on words first so wrapping stays natural, then
 * optionally on characters, and clips each word to hide the pivot.
 *
 * Character splitting is the single densest thing this site asks a device to
 * do. Every heading is `by="char"`, so a two-word title becomes twenty-odd
 * motion components — each one a Framer visual element with its own subscription
 * and its own layer — and all of them animate at once, on the frame the section
 * crosses into view. Multiply by seven sections plus the hero and the entrance
 * cost lands squarely on the frames the user is scrolling through.
 *
 * So the granularity is tiered rather than the effect: below the high tier the
 * headline resolves word by word, flat, which is the same gesture at a fraction
 * of the element count. `by="word"` callers are already there and unaffected.
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
  const rich = useRichEntrance();
  const words = text.split(" ");

  if (reduced) {
    return (
      <Tag className={className} style={style}>
        {text}
      </Tag>
    );
  }

  const perChar = by === "char" && rich;
  const variant = rich ? glyph : glyphFlat;
  /* A degraded headline has a fifth as many children, so the same per-child
     delay would land the whole line at once and the stagger would read as a
     pop. Only the ones being degraded need the wider step — callers that asked
     for `by="word"` were already tuned for word counts. */
  const step = by === "char" && !rich ? Math.max(stagger, 0.05) : stagger;

  const motionProps = immediate
    ? { initial: "hidden" as const, animate: "show" as const }
    : { initial: "hidden" as const, whileInView: "show" as const, viewport: VIEWPORT };

  return (
    <Tag className={className} style={{ ...style, display: "inline-block" }}>
      <motion.span
        variants={container(step, delay)}
        {...motionProps}
        // `perspective` is what gives `rotateX` its depth; without the rotation
        // it only forces a 3D rendering context nothing in here needs.
        style={{ display: "inline-block", perspective: rich ? 640 : undefined }}
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
            {!perChar ? (
              <motion.span variants={variant} style={{ display: "inline-block" }}>
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
                  <motion.span variants={variant} style={{ display: "inline-block" }}>
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
