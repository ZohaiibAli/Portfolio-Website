import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Magnetic from "@/components/fx/Magnetic";
import { EASE_OUT, VIEWPORT } from "@/lib/motion";

/* ── Icons ────────────────────────────────────────────────────────────── */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const IconMail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const IconPhone = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.9 1.19h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 5.98 5.98l1.19-1.19a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const IconLinkedIn = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const IconGithub = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

/* ── Rows ─────────────────────────────────────────────────────────────── */

function ContactLine({ icon, value, href }: { icon: React.ReactNode; value: string; href: string }) {
  const [hov, setHov] = useState(false);

  return (
    <a
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="mono inline-flex items-center gap-2"
      style={{
        fontSize: 12,
        letterSpacing: "0.02em",
        textDecoration: "none",
        color: hov ? "#CBD5E1" : "#94A3B8",
        transition: "color 200ms ease",
      }}
    >
      <span style={{ color: hov ? "#60A5FA" : "#64748B", transition: "color 200ms ease", lineHeight: 0 }}>
        {icon}
      </span>
      {value}
    </a>
  );
}

function SocialButton({
  icon,
  label,
  href,
  hoverColor,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  hoverColor: string;
}) {
  const [hov, setHov] = useState(false);
  const reduced = useReducedMotion();

  return (
    <Magnetic strength={0.4}>
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        whileHover={reduced ? undefined : { scale: 1.12, rotate: -6 }}
        whileTap={{ scale: 0.94 }}
        className="grid place-items-center rounded-[10px]"
        style={{
          width: 38,
          height: 38,
          textDecoration: "none",
          color: hov ? hoverColor : "#64748B",
          background: hov ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${hov ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)"}`,
          boxShadow: hov ? `0 0 20px ${hoverColor}33` : "none",
          transition: "color 200ms ease, background 200ms ease, border-color 200ms ease, box-shadow 200ms ease",
        }}
      >
        {icon}
      </motion.a>
    </Magnetic>
  );
}

/* ── Footer ───────────────────────────────────────────────────────────── */

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative" style={{ fontFamily: "var(--font-body)" }}>
      <div
        aria-hidden="true"
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(37,99,235,0.38) 30%, rgba(124,58,237,0.38) 70%, transparent)",
        }}
      />

      <motion.div
        className="mx-auto flex flex-wrap items-center justify-between gap-5"
        style={{
          maxWidth: 1200,
          padding: "30px clamp(1.25rem, 5vw, 4rem)",
        }}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.6, ease: EASE_OUT }}
      >
        <div className="flex flex-col gap-1.5">
          <span
            className="grad-text"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 15,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              filter: "drop-shadow(0 0 10px rgba(96,165,250,0.3))",
            }}
          >
            Zohaib Ali
          </span>
          <span className="mono" style={{ fontSize: 10, color: "#64748B", letterSpacing: "0.04em" }}>
            <span style={{ color: "#3B82F6" }}>©</span> {year} · All rights reserved
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-5">
          <ContactLine icon={<IconMail />} value="zohaibaliwork@gmail.com" href="mailto:zohaibaliwork@gmail.com" />
          <span aria-hidden="true" style={{ width: 1, height: 14, background: "rgba(255,255,255,0.1)" }} />
          <ContactLine icon={<IconPhone />} value="+92 336 2082383" href="tel:+923362082383" />
        </div>

        <div className="flex items-center gap-2.5">
          <SocialButton
            icon={<IconLinkedIn />}
            label="LinkedIn"
            href="https://www.linkedin.com/in/zohaib-ali-5251b328b/"
            hoverColor="#60A5FA"
          />
          <SocialButton
            icon={<IconGithub />}
            label="GitHub"
            href="https://github.com/githubzohaib"
            hoverColor="#E2E8F0"
          />
        </div>
      </motion.div>

      <div
        aria-hidden="true"
        style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(37,99,235,0.22) 50%, transparent)" }}
      />
    </footer>
  );
}
