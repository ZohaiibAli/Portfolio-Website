import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Magnetic from "@/components/fx/Magnetic";

interface Props {
  children: ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  variant?: "primary" | "ghost";
  type?: "button" | "submit";
  disabled?: boolean;
  download?: boolean;
  external?: boolean;
  full?: boolean;
  className?: string;
}

/**
 * The site's one button.
 *
 * `primary` carries the brand gradient plus a sheen that sweeps across on
 * hover; `ghost` is the quiet glass variant. Both are magnetic, so they lean
 * toward the cursor before it arrives.
 */
export default function GlowButton({
  children,
  href,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
  download = false,
  external = false,
  full = false,
  className,
}: Props) {
  const reduced = useReducedMotion();
  const primary = variant === "primary";

  const base: React.CSSProperties = {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: "15px 30px",
    borderRadius: 14,
    fontFamily: "var(--font-mono)",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.03em",
    textDecoration: "none",
    overflow: "hidden",
    width: full ? "100%" : undefined,
    cursor: disabled ? "not-allowed" : "pointer",
    border: primary ? "none" : "1px solid rgba(255,255,255,0.1)",
    background: disabled
      ? "rgba(255,255,255,0.045)"
      : primary
      ? "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)"
      : "rgba(255,255,255,0.03)",
    color: disabled ? "#334155" : primary ? "#fff" : "#94A3B8",
    backdropFilter: primary ? undefined : "blur(10px)",
    boxShadow:
      disabled || !primary
        ? "none"
        : "0 0 34px rgba(37,99,235,0.34), 0 6px 26px rgba(0,0,0,0.42)",
    transition: "box-shadow 320ms ease, color 240ms ease, border-color 240ms ease",
  };

  const hover = disabled || reduced ? undefined : { scale: 1.03, y: -2 };
  const tap = disabled || reduced ? undefined : { scale: 0.97 };

  const inner = (
    <>
      {/* Sheen sweep — a light bar crossing the face on hover. */}
      {!disabled && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, transparent 20%, rgba(255,255,255,0.22) 50%, transparent 80%)",
            transform: "translateX(-120%)",
            transition: "transform 750ms cubic-bezier(0.22,1,0.36,1)",
          }}
          data-sheen
        />
      )}
      <span style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 8 }}>
        {children}
      </span>
    </>
  );

  // Drive the sheen from the wrapper so it works for links and buttons alike.
  const sheenHandlers = {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      const s = e.currentTarget.querySelector<HTMLElement>("[data-sheen]");
      if (s) s.style.transform = "translateX(120%)";
      if (primary && !disabled) {
        e.currentTarget.style.boxShadow =
          "0 0 56px rgba(37,99,235,0.55), 0 0 110px rgba(124,58,237,0.24), 0 10px 34px rgba(0,0,0,0.45)";
      } else if (!primary) {
        e.currentTarget.style.borderColor = "rgba(96,165,250,0.4)";
        e.currentTarget.style.color = "#E2E8F0";
      }
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      const s = e.currentTarget.querySelector<HTMLElement>("[data-sheen]");
      if (s) s.style.transform = "translateX(-120%)";
      if (primary && !disabled) {
        e.currentTarget.style.boxShadow =
          "0 0 34px rgba(37,99,235,0.34), 0 6px 26px rgba(0,0,0,0.42)";
      } else if (!primary) {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
        e.currentTarget.style.color = "#94A3B8";
      }
    },
  };

  const el = href ? (
    <motion.a
      href={href}
      onClick={onClick}
      download={download || undefined}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      whileHover={hover}
      whileTap={tap}
      style={base}
      {...sheenHandlers}
    >
      {inner}
    </motion.a>
  ) : (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={hover}
      whileTap={tap}
      style={base}
      {...sheenHandlers}
    >
      {inner}
    </motion.button>
  );

  return (
    <Magnetic strength={0.24} className={full ? `${className ?? ""} w-full` : className}>
      {el}
    </Magnetic>
  );
}
