import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useScrollFx } from "@/lib/useAmbient";

interface Props {
  id: string;
  label: string;
  children: ReactNode;
  /** Adds the hairline rule along the top edge. */
  divider?: boolean;
  className?: string;
}

const PADDING = {
  paddingTop: "clamp(72px, 10vw, 112px)",
  paddingBottom: "clamp(80px, 11vw, 120px)",
} as const;

/** Everything inside the section element, shared by both variants below. */
function Body({ divider, children }: { divider: boolean; children: ReactNode }) {
  return (
    <>
      {divider && (
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #1B3B6B 28%, rgba(37,99,235,0.55) 50%, #1B3B6B 72%, transparent 100%)",
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
    </>
  );
}

/**
 * The section with its scroll-linked depth: it recedes as it leaves the
 * viewport and resolves as it arrives, so scrolling reads as moving through a
 * stack of planes rather than sliding a flat document.
 *
 * The recede used to include `filter: blur()`. That is the single most
 * expensive thing you can drive from scroll: the browser must re-rasterise the
 * entire section — every card, every glyph — and run a Gaussian over it on each
 * frame, and with these section heights two sections are mid-transition at any
 * moment. Scale and opacity alone are pure compositor properties; the sense of
 * depth survives, the main thread stays free.
 */
function DepthSection({ id, label, children, divider = true, className }: Required<Pick<Props, "divider">> & Props) {
  const ref = useRef<HTMLElement>(null);

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
        ...PADDING,
        scale,
        opacity,
        // Keeps the section on its own layer instead of promoting/demoting it
        // every time it enters and leaves the viewport. (`transform` itself is
        // owned by the motion values above, so this is the only safe hint.)
        willChange: "transform, opacity",
      }}
    >
      <Body divider={divider}>{children}</Body>
    </motion.section>
  );
}

/**
 * The same section as a plain element.
 *
 * Dropping the depth effect is the single largest win available on a phone, for
 * two structural reasons:
 *
 *  - `scale` is only free once a layer is rasterised. Text is not: the browser
 *    re-rasterises glyphs at each new scale factor to keep them sharp, so a
 *    scrolling page means re-rendering an entire section of type every frame,
 *    with two sections mid-transition at any moment.
 *  - `willChange` on seven full-page sections asks for seven permanent layers
 *    the size of the document. On a desktop GPU that is nothing; on a phone it
 *    exceeds the texture budget, and the browser's response to that is to start
 *    evicting and re-uploading layers mid-scroll.
 *
 * The scroll tracking has to go with it, which is why this is its own component
 * rather than a pair of ternaries on the styles. `useScroll` is a hook: it runs
 * whether or not anything reads its output, and each call registers a handler
 * that measures on every scroll event — with a `target`, that means walking the
 * section's `offsetParent` chain, seven times per frame, to compute numbers
 * being multiplied by nothing.
 *
 * Static sections give up a depth cue that a phone was never really rendering
 * anyway, and hand back the whole frame.
 */
function FlatSection({ id, label, children, divider = true, className }: Required<Pick<Props, "divider">> & Props) {
  return (
    <section
      id={id}
      aria-label={label}
      className={`relative w-full ${className ?? ""}`}
      style={PADDING}
    >
      <Body divider={divider}>{children}</Body>
    </section>
  );
}

/**
 * Wrapper every content section shares.
 *
 * The tier is fixed for the session, so picking a variant here never remounts a
 * section mid-scroll.
 */
export default function Section({ divider = true, ...props }: Props) {
  const depth = useScrollFx();
  const Variant = depth ? DepthSection : FlatSection;
  return <Variant divider={divider} {...props} />;
}
