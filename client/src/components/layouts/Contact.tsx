import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Section from "@/components/fx/Section";
import SectionHeading, { LiveDot } from "@/components/fx/SectionHeading";
import Reveal from "@/components/fx/Reveal";
import SpotlightCard from "@/components/fx/SpotlightCard";
import GlowButton from "@/components/ui/GlowButton";
import Tag from "@/components/ui/Tag";
import { useHasFinePointer } from "@/lib/usePointer";
import { EASE_BACK, EASE_OUT, VIEWPORT, alpha } from "@/lib/motion";

const LINKS = [
  { label: "GitHub", handle: "githubzohaib", icon: "⬡", color: "#60A5FA", href: "https://github.com/githubzohaib" },
  { label: "LinkedIn", handle: "Zohaib Ali", icon: "◈", color: "#22D3EE", href: "https://www.linkedin.com/in/zohaib-ali-5251b328b/" },
  { label: "Email", handle: "zohaibaliwork@gmail.com", icon: "◉", color: "#0EA5E9", href: "mailto:zohaibaliwork@gmail.com" },
];

const ROLES = ["Full Stack Developer", "Frontend Developer", "Backend Developer", "Distributed Systems", "Platform Eng."];

/* ── Contact link row ─────────────────────────────────────────────────── */

function ContactLink({ item, index }: { item: (typeof LINKS)[number]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const reduced = useReducedMotion();
  // Touch fires `pointerenter` as well — see the note in `SpotlightCard`.
  const hoverable = useHasFinePointer() && !reduced;

  return (
    <motion.a
      href={item.href}
      target={item.href.startsWith("http") ? "_blank" : undefined}
      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="flex items-center gap-3.5 rounded-xl"
      initial={{ opacity: 0, x: -24, scale: 0.985 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.55, delay: index * 0.08, ease: EASE_OUT }}
      whileHover={reduced ? undefined : { x: 6 }}
      onPointerEnter={hoverable ? () => setHovered(true) : undefined}
      onPointerLeave={hoverable ? () => setHovered(false) : undefined}
      style={{
        padding: "14px 18px",
        textDecoration: "none",
        background: hovered ? "rgba(96,165,250,0.07)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${hovered ? alpha(item.color, 0.32) : "rgba(96,165,250,0.11)"}`,
        backdropFilter: "blur(12px)",
        boxShadow: hovered ? `0 0 24px ${alpha(item.color, 0.14)}` : "none",
        transition: "background 260ms ease, border-color 260ms ease, box-shadow 260ms ease",
      }}
    >
      <span
        className="mono grid flex-shrink-0 place-items-center"
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: `linear-gradient(135deg, ${alpha(item.color, 0.16)}, ${alpha(item.color, 0.05)})`,
          border: `1px solid ${alpha(item.color, 0.22)}`,
          color: item.color,
          fontSize: 14,
          boxShadow: hovered ? `0 0 14px ${alpha(item.color, 0.35)}` : "none",
          transition: "box-shadow 260ms ease",
        }}
      >
        {item.icon}
      </span>

      <span className="min-w-0">
        <span
          className="mono block"
          style={{ fontSize: 10, color: "#2E4560", letterSpacing: "0.12em", textTransform: "uppercase" }}
        >
          {item.label}
        </span>
        <span
          className="block truncate"
          style={{ fontSize: 13, color: hovered ? "#E9F1FF" : "#607E9E", transition: "color 260ms ease" }}
        >
          {item.handle}
        </span>
      </span>

      <motion.span
        className="mono ml-auto flex-shrink-0"
        style={{ fontSize: 13, color: item.color }}
        animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        →
      </motion.span>
    </motion.a>
  );
}

/* ── Field ────────────────────────────────────────────────────────────── */

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder: string;
  multiline?: boolean;
  delay: number;
  invalid?: boolean;
}

function Field({ label, value, onChange, type = "text", placeholder, multiline, delay, invalid }: FieldProps) {
  const [focused, setFocused] = useState(false);
  const filled = value.length > 0;
  const lifted = focused || filled;

  const shared: React.CSSProperties = {
    width: "100%",
    background: focused ? "rgba(96,165,250,0.07)" : "rgba(255,255,255,0.02)",
    border: `1px solid ${
      invalid
        ? "rgba(248,113,113,0.55)"
        : focused
        ? "rgba(96,165,250,0.55)"
        : filled
        ? "rgba(96,165,250,0.22)"
        : "rgba(255,255,255,0.08)"
    }`,
    borderRadius: 13,
    padding: multiline ? "42px 18px 16px" : "27px 18px 11px",
    color: "#E9F1FF",
    fontFamily: "var(--font-body)",
    fontSize: 14,
    lineHeight: 1.6,
    outline: "none",
    resize: "none",
    boxShadow: focused
      ? "0 0 0 3px rgba(37,99,235,0.13), 0 6px 24px rgba(0,0,0,0.34)"
      : "0 2px 12px rgba(0,0,0,0.2)",
    transition: "background 240ms ease, border-color 240ms ease, box-shadow 240ms ease",
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.55, delay, ease: EASE_OUT }}
    >
      <motion.label
        className="mono pointer-events-none absolute"
        style={{ left: 18, top: 12, zIndex: 2, letterSpacing: "0.09em", textTransform: "uppercase" }}
        animate={{
          y: lifted ? 0 : 10,
          fontSize: lifted ? 9.5 : 13,
          color: invalid ? "#F87171" : focused ? "#60A5FA" : filled ? "#607E9E" : "#2E4560",
        }}
        transition={{ duration: 0.22, ease: EASE_OUT }}
      >
        {label}
      </motion.label>

      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={focused ? placeholder : ""}
          rows={5}
          style={{ ...shared, minHeight: 142 }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={focused ? placeholder : ""}
          style={shared}
        />
      )}

      {/* Focus underline that unfurls from the centre. */}
      <motion.span
        className="absolute bottom-0"
        style={{
          left: "10%",
          right: "10%",
          height: 2,
          borderRadius: 999,
          background: "linear-gradient(90deg, transparent, #2563EB, #22D3EE, transparent)",
        }}
        initial={false}
        animate={{ scaleX: focused ? 1 : 0, opacity: focused ? 1 : 0 }}
        transition={{ duration: 0.3, ease: EASE_OUT }}
      />
    </motion.div>
  );
}

/* ── Success ──────────────────────────────────────────────────────────── */

function SuccessState() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-5 text-center"
      style={{ padding: "60px 40px" }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: EASE_BACK }}
    >
      <motion.span
        className="grid place-items-center rounded-full"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.12, type: "spring", stiffness: 260, damping: 16 }}
        style={{
          width: 74,
          height: 74,
          background: "linear-gradient(135deg, rgba(52,211,153,0.22), rgba(52,211,153,0.07))",
          border: "1px solid rgba(52,211,153,0.42)",
          boxShadow: "0 0 44px rgba(52,211,153,0.32)",
        }}
      >
        <svg width="34" height="34" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <motion.path
            d="M 7 16 L 13 22 L 25 10"
            stroke="#34D399"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.35, duration: 0.5, ease: EASE_OUT }}
          />
        </svg>
      </motion.span>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.48 }}>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 20,
            fontWeight: 700,
            color: "#E9F1FF",
            letterSpacing: "-0.03em",
            marginBottom: 8,
          }}
        >
          Message sent!
        </p>
        <p style={{ fontSize: 14, color: "#607E9E", lineHeight: 1.7, maxWidth: 290 }}>
          Thanks for reaching out — I'll get back to you within{" "}
          <span style={{ color: "#8FA8C8" }}>24 hours</span>.
        </p>
      </motion.div>

      <motion.span
        className="mono flex items-center gap-2"
        style={{ fontSize: 11, color: "#2E4560", letterSpacing: "0.08em" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <LiveDot size={6} />
        response within 24h
      </motion.span>
    </motion.div>
  );
}

/* ── Section ──────────────────────────────────────────────────────────── */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailValid = EMAIL_RE.test(email.trim());
  const canSubmit = Boolean(name.trim() && emailValid && message.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setSubmitted(true);
    } catch {
      // Never strand the user on a spinner — surface a mailto fallback instead.
      setError("Couldn't reach the server. Please email zohaibaliwork@gmail.com directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Section id="contact" label="Contact">
      <SectionHeading eyebrow="get in touch" title="Let's Build Something" accent="Meaningful">
        Whether it's a new role, an open-source collaboration, or a hard engineering problem — I'm
        always up for a <span style={{ color: "#8FA8C8" }}>good conversation</span>.
      </SectionHeading>

      <div className="flex flex-col items-start gap-12 lg:flex-row lg:gap-16">
        {/* ── Left ── */}
        <div className="w-full min-w-0 flex-1">
          <Reveal>
            <div
              className="mono mb-5 flex items-center gap-3"
              style={{ fontSize: 11, color: "#2E4560", letterSpacing: "0.14em", textTransform: "uppercase" }}
            >
              <span>Connect</span>
              <span style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(96,165,250,0.22), transparent)" }} />
            </div>
          </Reveal>

          <div className="mb-9 flex flex-col gap-2.5">
            {LINKS.map((item, i) => (
              <ContactLink key={item.label} item={item} index={i} />
            ))}
          </div>

          <Reveal delay={0.15}>
            <SpotlightCard accent="#34D399" radius={18} underline={false} style={{ padding: "22px 24px" }}>
              <div className="mb-3 flex items-center gap-2.5">
                <LiveDot />
                <span
                  className="mono"
                  style={{ fontSize: 11, color: "#34D399", letterSpacing: "0.12em", textTransform: "uppercase" }}
                >
                  Available for new roles
                </span>
              </div>
              <p style={{ fontSize: 13, color: "#607E9E", lineHeight: 1.78, marginBottom: 14 }}>
                Open to <span style={{ color: "#8FA8C8" }}>Full Stack Developer</span> roles focused
                on distributed systems, platform engineering or developer tooling.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {ROLES.map((r, i) => (
                  <Tag key={r} label={r} index={i} size="sm" accent="#34D399" />
                ))}
              </div>
            </SpotlightCard>
          </Reveal>
        </div>

        {/* ── Right: form ── */}
        <Reveal from="right" distance={48} duration={0.9} className="w-full lg:w-auto">
          <div style={{ width: "min(100%, 520px)" }}>
            <div
              className="overflow-hidden"
              style={{
                borderRadius: 22,
                background: "rgba(6,11,24,0.92)",
                border: "1px solid rgba(96,165,250,0.13)",
                backdropFilter: "blur(24px)",
                boxShadow: "0 40px 90px rgba(0,0,0,0.6), 0 0 80px rgba(37,99,235,0.08)",
              }}
            >
              <div
                className="flex items-center gap-2 px-4 py-3"
                style={{ background: "#0B1224", borderBottom: "1px solid #151E36" }}
              >
                {["#FF5F57", "#FFBD2E", "#28C840"].map((c) => (
                  <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
                ))}
                <span className="mono ml-2" style={{ fontSize: 11, color: "#465A73", letterSpacing: "0.05em" }}>
                  message.send
                </span>
                <span
                  className="mono ml-auto flex items-center gap-1.5"
                  style={{ fontSize: 10, color: submitted ? "#34D399" : "#60A5FA" }}
                >
                  <LiveDot size={6} color={submitted ? "#34D399" : "#60A5FA"} />
                  {submitted ? "sent" : submitting ? "sending" : "ready"}
                </span>
              </div>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <SuccessState />
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                    style={{ padding: "28px 28px 32px" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Field label="Name" value={name} onChange={setName} placeholder="Your name" delay={0.05} />
                    <Field
                      label="Email"
                      type="email"
                      value={email}
                      onChange={setEmail}
                      placeholder="you@company.com"
                      delay={0.12}
                      invalid={email.length > 0 && !emailValid}
                    />
                    <Field
                      label="Message"
                      value={message}
                      onChange={setMessage}
                      placeholder="Tell me about the project..."
                      multiline
                      delay={0.19}
                    />

                    <AnimatePresence>
                      {error && (
                        <motion.p
                          className="mono"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          style={{
                            fontSize: 11.5,
                            color: "#F87171",
                            lineHeight: 1.6,
                            padding: "10px 14px",
                            borderRadius: 10,
                            background: "rgba(248,113,113,0.07)",
                            border: "1px solid rgba(248,113,113,0.24)",
                          }}
                        >
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <GlowButton type="submit" disabled={!canSubmit || submitting} full>
                      {submitting ? (
                        <>
                          <motion.span
                            className="inline-block rounded-full"
                            style={{
                              width: 14,
                              height: 14,
                              border: "2px solid rgba(255,255,255,0.28)",
                              borderTopColor: "#fff",
                            }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                          />
                          Sending…
                        </>
                      ) : canSubmit ? (
                        <>
                          Send Message <span aria-hidden="true">→</span>
                        </>
                      ) : (
                        "Fill in all fields"
                      )}
                    </GlowButton>

                    <span
                      className="mono flex items-center justify-center gap-2"
                      style={{ fontSize: 10.5, color: "#2E4560", letterSpacing: "0.06em" }}
                    >
                      <span style={{ color: "#1B3B6B" }}>⚡</span>
                      Typically responds within 24 hours
                    </span>
                  </motion.form>
                )}
              </AnimatePresence>

              <div
                aria-hidden="true"
                style={{ height: 2, background: "linear-gradient(90deg, transparent, #2563EB, #22D3EE, transparent)" }}
              />
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
