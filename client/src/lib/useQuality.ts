import { useEffect, useState } from "react";

export type Tier = "high" | "low";

/**
 * Coarse device-capability tier, decided once per session.
 *
 * Every genuinely expensive effect on this site — backdrop-filter glass, the
 * constellation mesh, cursor-driven full-screen layers — is gated on this.
 * Weaker devices keep the same choreography, but only the parts the compositor
 * can run for free: transform and opacity.
 *
 * Deliberately pessimistic. A high-end phone rendering the "low" tier still
 * looks like the site; a mid-range phone rendering the "high" tier does not.
 */
function detect(): Tier {
  if (typeof window === "undefined") return "high";

  const nav = navigator as Navigator & { deviceMemory?: number };

  // Touch devices: no hover affordances to lose, and mobile GPUs fall off a
  // cliff on backdrop-filter and large blurs.
  const coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  const narrow = window.innerWidth < 768;
  // `deviceMemory` and `hardwareConcurrency` are absent on Safari — assume
  // capable there rather than punishing every Mac.
  const lowMemory = (nav.deviceMemory ?? 8) <= 4;
  const fewCores = (nav.hardwareConcurrency ?? 8) <= 4;

  return coarse || narrow || lowMemory || fewCores ? "low" : "high";
}

/* Resolved once and shared, so every component agrees on the tier and no
   component can flip mid-session and force a re-layout of the whole page. */
let cached: Tier | null = null;

export function quality(): Tier {
  if (cached === null) {
    cached = detect();
    if (typeof document !== "undefined") {
      // CSS keys off this to strip backdrop-filter site-wide in one rule,
      // rather than threading a prop through 17 inline styles.
      document.documentElement.dataset.quality = cached;
    }
  }
  return cached;
}

/** Tier as a hook. Stable for the life of the session. */
export function useQuality(): Tier {
  const [tier] = useState(quality);

  useEffect(() => {
    document.documentElement.dataset.quality = tier;
  }, [tier]);

  return tier;
}

/** Convenience: true when the device can afford the full effect stack. */
export function useHighQuality(): boolean {
  return useQuality() === "high";
}
