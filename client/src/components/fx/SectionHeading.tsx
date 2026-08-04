import { motion } from "framer-motion";
import SplitText from "./SplitText";
import Reveal from "./Reveal";
import { useAmbient } from "@/lib/useAmbient";

interface Props {
  /** Monospace eyebrow inside the status pill, e.g. `about.me`. */
  eyebrow: string;
  /** Rendered plain, before the gradient half. */
  title: string;
  /** Rendered in the brand gradient, on the same line. */
  accent: string;
  children?: React.ReactNode;
  align?: "center" | "left";
}

/**
 * The live green dot shared by every eyebrow pill and status row.
 *
 * The halo is the most-duplicated animation on the site — every section
 * heading, the hero badge, the code editor's status line, the profile card,
 * a dozen in total, all looping forever whether or not their section is
 * anywhere near the viewport. Framer keeps every one of them on its frame
 * loop, so the cost is paid on the frames the user is scrolling. On the low
 * tier the dot keeps its glow and drops the pulse.
 */
export function LiveDot({ color = "#34D399", size = 8 }: { color?: string; size?: number }) {
  const ambient = useAmbient();
  return (
    <span style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 8px ${color}`,
        }}
      />
      {ambient && (
        <motion.span
          style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color }}
          animate={{ scale: [1, 2.4], opacity: [0.55, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
      )}
    </span>
  );
}

/** Status pill used as the eyebrow above every section title. */
export function Pill({ label, color = "#93C5FD" }: { label: string; color?: string }) {
  return (
    <span
      className="mono inline-flex items-center gap-2.5 rounded-full"
      style={{
        padding: "6px 16px",
        background: "rgba(96,165,250,0.08)",
        border: "1px solid rgba(96,165,250,0.2)",
        color,
        fontSize: 11,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
      }}
    >
      <LiveDot />
      {label}
    </span>
  );
}

/**
 * Eyebrow + split-text headline + supporting copy. Every section header on the
 * site goes through this, which is what keeps the entrance cadence identical
 * from Skills to Contact.
 */
export default function SectionHeading({
  eyebrow,
  title,
  accent,
  children,
  align = "center",
}: Props) {
  const centered = align === "center";

  return (
    <div
      className={`flex flex-col ${centered ? "items-center text-center" : "items-start text-left"}`}
      style={{ marginBottom: 64 }}
    >
      <Reveal from="down" distance={16}>
        <Pill label={eyebrow} />
      </Reveal>

      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2rem, 5.2vw, 3.4rem)",
          fontWeight: 700,
          color: "#E9F1FF",
          letterSpacing: "-0.045em",
          lineHeight: 1.08,
          margin: "24px 0 18px",
          maxWidth: "18ch",
        }}
      >
        <SplitText text={title} stagger={0.022} />{" "}
        <SplitText text={accent} className="grad-text" stagger={0.022} delay={0.12} />
      </h2>

      {children && (
        <Reveal delay={0.18}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(0.92rem, 2vw, 1.05rem)",
              color: "#607E9E",
              lineHeight: 1.8,
              maxWidth: 540,
            }}
          >
            {children}
          </p>
        </Reveal>
      )}
    </div>
  );
}
