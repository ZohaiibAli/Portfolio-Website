import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useQuality } from "./useQuality";

/**
 * True when the device can afford *continuous* decorative motion.
 *
 * The distinction this draws is the one that actually decides whether a phone
 * scrolls at 60fps. A one-shot entrance is bounded work: it runs for 700ms and
 * then the element is static forever. An `repeat: Infinity` animation is
 * unbounded — it holds a compositing layer and burns a slice of every frame for
 * the entire session, and there are roughly thirty of them across this site
 * (every `LiveDot`, every timeline node, every floating chip, the aurora, the
 * portrait halo). Individually none of them is the problem; together they are
 * the reason a mid-range phone has nothing left when the user starts scrolling.
 *
 * So entrances stay everywhere, and the loops are spent only where there is
 * headroom for them. `useQuality` already treats every touch device as low.
 */
export function useAmbient(): boolean {
  const high = useQuality() === "high";
  const reduced = useReducedMotion();
  return high && !reduced;
}

/**
 * True when scroll position may drive a transform.
 *
 * Identical to {@link useAmbient} in what it returns, and deliberately a
 * separate name: scroll-linked work is worse than an idle loop. It runs on the
 * main thread *during* the gesture it is competing with, so every wasted
 * millisecond lands on the frame the user is already waiting for.
 */
export function useScrollFx(): boolean {
  return useAmbient();
}

/**
 * True when an entrance may animate its smallest parts individually.
 *
 * The counterpart to {@link useAmbient}, for the other axis of cost. Entrances
 * are bounded work and belong on every device — but "one entrance" and "one
 * entrance per glyph" are not the same bounded work. A per-character headline
 * is fifty independently animated elements, each a separate compositing layer
 * for the duration, and it fires *while the section is scrolling into view*:
 * the one moment the frame budget is already spent.
 *
 * Below the high tier the same entrance plays at word granularity instead. The
 * choreography survives — copy still resolves into place from below — at a
 * twentieth of the element count.
 */
export function useRichEntrance(): boolean {
  return useAmbient();
}

/**
 * A media query as reactive state.
 *
 * Used to keep the DOM honest where `hidden lg:block` isn't enough: a hidden
 * subtree still mounts, still runs its timers, and still subscribes to every
 * spring inside it. For anything with a running cost, not rendering it beats
 * rendering it invisibly.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setMatches(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [query]);

  return matches;
}
