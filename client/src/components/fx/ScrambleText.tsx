import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface Props {
  /** Cycled in order, looping. */
  texts: string[];
  className?: string;
  style?: React.CSSProperties;
  /** How long each finished line is held before the next one resolves, in ms. */
  hold?: number;
}

/** Glyphs the unresolved characters churn through. */
const NOISE = "!<>-_\\/[]{}—=+*^?#§$&%~";

/*
  The churn is deliberately not driven by `requestAnimationFrame`.

  A scramble looks identical at 30fps and at 120 — it is visual noise, and the
  eye reads the *rate of resolution*, not the frame rate of the noise. But it is
  a React state update per tick, on the hero, during the exact seconds the page
  is still mounting and the user's first scroll gesture lands. Ticking on RAF
  would put that update on every frame the browser has, and on a 120Hz phone it
  would quadruple the cost of the effect for nothing anyone can see.

  A fixed 40ms interval decouples it from the display entirely: 25 updates a
  second, whatever the panel is doing.
*/
const TICK = 40;

/** Ticks a character is scrambled for before it locks, scaled by its position. */
const CHURN = 9;

interface Slot {
  char: string;
  /** Tick index at which this slot stops churning and shows `char`. */
  settleAt: number;
}

function plan(from: string, to: string): { slots: Slot[]; total: number } {
  const length = Math.max(from.length, to.length);
  const slots: Slot[] = [];
  let total = 0;

  for (let i = 0; i < length; i++) {
    // Left-to-right resolution with a little jitter, so the line reads as
    // decoding rather than as a wipe.
    const settleAt = Math.round(i * 1.6 + Math.random() * CHURN);
    slots.push({ char: to[i] ?? "", settleAt });
    if (settleAt > total) total = settleAt;
  }

  return { slots, total };
}

/**
 * Text that decodes into place out of a field of noise, then cycles.
 *
 * Replaces the hero's typewriter. Same idea — the role line rewrites itself —
 * but it resolves the whole line at once instead of one character at a time,
 * which means the eye takes in the finished phrase far sooner and spends the
 * rest of the beat watching it settle. The typewriter also spent half its cycle
 * *deleting*, which is a second and a half of the hero's headline area showing
 * progressively less information.
 *
 * Isolated in its own component for the same reason the typewriter was: this
 * commits a state update 25 times a second, and anything it shares a component
 * with is reconciled 25 times a second along with it.
 *
 * Under `prefers-reduced-motion` the cycling stops entirely and the first line
 * is rendered as static text — the noise is precisely the kind of high-frequency
 * flicker that setting exists to suppress.
 */
export default function ScrambleText({ texts, className, style, hold = 2100 }: Props) {
  const reduced = useReducedMotion();
  const [out, setOut] = useState(texts[0] ?? "");

  /* The cycle runs entirely inside one effect rather than across renders. Each
     tick would otherwise re-run the effect, tear down its timer and schedule a
     fresh one — 25 teardowns a second, forever. */
  const indexRef = useRef(0);

  useEffect(() => {
    if (reduced || texts.length === 0) return;

    let timer = 0;
    let cancelled = false;

    const run = () => {
      const from = texts[indexRef.current];
      indexRef.current = (indexRef.current + 1) % texts.length;
      const to = texts[indexRef.current];

      const { slots, total } = plan(from, to);
      let tick = 0;

      const step = () => {
        if (cancelled) return;

        let text = "";
        let settled = 0;

        for (const slot of slots) {
          if (tick >= slot.settleAt) {
            text += slot.char;
            settled++;
          } else if (slot.char === " ") {
            // Spaces churning as punctuation destroys the word shape, and the
            // line jitters in width as it resolves. Hold them open instead.
            text += " ";
            settled++;
          } else {
            text += NOISE[(Math.random() * NOISE.length) | 0];
          }
        }

        setOut(text);
        tick++;

        if (settled === slots.length && tick > total) {
          timer = window.setTimeout(run, hold);
        } else {
          timer = window.setTimeout(step, TICK);
        }
      };

      step();
    };

    timer = window.setTimeout(run, hold);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [texts, hold, reduced]);

  return (
    <span className={className} style={style}>
      {reduced ? texts[0] : out}
    </span>
  );
}
