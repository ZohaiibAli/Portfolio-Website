import { motion, useReducedMotion } from "framer-motion";
import { EASE_BACK, VIEWPORT, alpha } from "@/lib/motion";

interface Props {
  label: string;
  index?: number;
  accent?: string;
  size?: "sm" | "md";
}

/** The tech-stack chip used across hero, about, skills, projects and contact. */
export default function Tag({ label, index = 0, accent, size = "md" }: Props) {
  const reduced = useReducedMotion();

  return (
    <motion.span
      className="mono inline-block cursor-default rounded-full"
      initial={reduced ? undefined : { opacity: 0, scale: 0.82, y: 6 }}
      whileInView={reduced ? undefined : { opacity: 1, scale: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ delay: index * 0.045, duration: 0.45, ease: EASE_BACK }}
      whileHover={
        reduced
          ? undefined
          : {
              scale: 1.08,
              y: -2,
              color: accent ?? "#93C5FD",
              borderColor: alpha(accent ?? "#60A5FA", 0.45),
              backgroundColor: alpha(accent ?? "#60A5FA", 0.1),
            }
      }
      style={{
        padding: size === "sm" ? "3px 9px" : "5px 13px",
        fontSize: size === "sm" ? 10.5 : 11.5,
        letterSpacing: "0.05em",
        color: "#607E9E",
        background: "rgba(96,165,250,0.055)",
        border: "1px solid rgba(96,165,250,0.14)",
      }}
    >
      {label}
    </motion.span>
  );
}
