import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

interface Props {
  /** Accepts "6+", "10+", "MERN", "Top" — non-numeric values render verbatim. */
  value: string;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

/** Pulls a leading number out of "10+" → { n: 10, suffix: "+" }. */
function parse(value: string): { n: number; prefix: string; suffix: string } | null {
  const m = value.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  if (!m) return null;
  return { prefix: m[1], n: parseFloat(m[2]), suffix: m[3] };
}

/**
 * Counts a stat up when it scrolls into view. Falls back to plain text for
 * non-numeric values and for reduced-motion users.
 */
export default function CountUp({ value, duration = 1500, className, style }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  const parsed = parse(value);
  const [display, setDisplay] = useState(parsed ? `${parsed.prefix}0${parsed.suffix}` : value);

  useEffect(() => {
    if (!parsed || !inView) return;
    if (reduced) {
      setDisplay(value);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const decimals = (parsed.n % 1 === 0) ? 0 : 1;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // Ease-out-expo: fast off the line, long settle on the final digit.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setDisplay(`${parsed.prefix}${(parsed.n * eased).toFixed(decimals)}${parsed.suffix}`);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // `parsed` is derived from `value`; tracking `value` is sufficient.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value, duration, reduced]);

  return (
    <span ref={ref} className={className} style={style}>
      {parsed ? display : value}
    </span>
  );
}
