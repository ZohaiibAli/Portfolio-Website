import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import Section from "@/components/fx/Section";
import SectionHeading, { LiveDot } from "@/components/fx/SectionHeading";
import SpotlightCard from "@/components/fx/SpotlightCard";
import TiltCard from "@/components/fx/TiltCard";
import Reveal from "@/components/fx/Reveal";
import CountUp from "@/components/fx/CountUp";
import Tag from "@/components/ui/Tag";
import { EASE_OUT, VIEWPORT, alpha } from "@/lib/motion";

interface Entry {
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  color: string;
  tags: string[];
  certificate?: string;
  highlights: string[];
}

const INTERNSHIPS: Entry[] = [
  {
    role: "Full Stack Developer Intern",
    company: "Bluenet Plus",
    period: "2024 — Present",
    location: "Karachi, Pakistan",
    description:
      "Architecting and developing the company's complete initiative-based website from scratch, owning both frontend and backend modules across the full SERN stack.",
    color: "#60A5FA",
    tags: ["React.js", "Node.js", "Express.js", "PostgreSQL"],
    certificate:
      "https://drive.google.com/file/d/1ds1brSTy_jU2mlvmrre0txP7I62E_18L/view?usp=drivesdk",
    highlights: [
      "Designed and built service pages, initiative sections, contact modules and admin control panels",
      "Ensured performance optimization, scalability and cross-device responsiveness throughout",
      "Architected frontend and backend modules using the SERN stack end-to-end",
    ],
  },
  {
    role: "Frontend Developer Intern",
    company: "Engr. Abul Kalam Library",
    period: "2024",
    location: "Karachi, Pakistan",
    description:
      'Refined and enhanced the "NextBook" digital library platform by introducing new scalable features and collaborating with stakeholders on UX improvements.',
    color: "#22D3EE",
    tags: ["React.js", "Node.js", "MongoDB", "REST APIs"],
    certificate:
      "https://drive.google.com/file/d/12Nlv4QoLAEdZ9FIyYBng_JxnHRXr4whp/view?usp=drivesdk",
    highlights: [
      "Implemented modern UI components and responsive layouts using React.js",
      "Integrated backend APIs with the frontend across the platform",
      "Collaborated directly with stakeholders to improve usability and system reliability",
    ],
  },
];

const DOMAINS = [
  { label: "Full Stack Development", icon: "⬡", color: "#60A5FA" },
  { label: "REST API Design", icon: "◈", color: "#22D3EE" },
  { label: "Responsive UI/UX", icon: "◧", color: "#34D399" },
  { label: "Database Design", icon: "⬟", color: "#F59E0B" },
  { label: "Real-time Systems", icon: "◉", color: "#7C3AED" },
  { label: "Performance Opt.", icon: "⬠", color: "#F87171" },
];

const STATS = [
  { value: "2", label: "Internships completed", color: "#60A5FA" },
  { value: "10+", label: "Projects shipped", color: "#34D399" },
  { value: "MERN", label: "Core stack expertise", color: "#22D3EE" },
];

const PROFICIENCY = [
  { label: "Frontend Dev", pct: 90, color: "#60A5FA" },
  { label: "Backend Dev", pct: 85, color: "#34D399" },
  { label: "API Design", pct: 82, color: "#22D3EE" },
  { label: "Database Design", pct: 75, color: "#7C3AED" },
];

/* ── Timeline ─────────────────────────────────────────────────────────── */

function TimelineItem({ item, index, isLast }: { item: Entry; index: number; isLast: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const reduced = useReducedMotion();
  const visible = expanded ? item.highlights : item.highlights.slice(0, 1);

  return (
    <motion.div
      className="flex"
      initial={{ opacity: 0, x: -32, scale: 0.985 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.7, delay: index * 0.14, ease: EASE_OUT }}
    >
      {/* Spine */}
      <div className="mr-6 flex flex-shrink-0 flex-col items-center">
        <motion.span
          className="relative"
          style={{
            width: 14,
            height: 14,
            marginTop: 5,
            borderRadius: "50%",
            background: item.color,
            border: `2px solid ${alpha(item.color, 0.4)}`,
          }}
          animate={
            reduced
              ? undefined
              : {
                  boxShadow: [
                    `0 0 0 ${alpha(item.color, 0)}`,
                    `0 0 18px ${alpha(item.color, 0.65)}`,
                    `0 0 0 ${alpha(item.color, 0)}`,
                  ],
                }
          }
          transition={{ duration: 2.6, repeat: Infinity, delay: index * 0.4 }}
        />
        {!isLast && (
          <motion.span
            className="mt-2 w-px flex-1"
            style={{
              minHeight: 48,
              background: `linear-gradient(to bottom, ${alpha(item.color, 0.35)}, rgba(255,255,255,0.04))`,
              transformOrigin: "top",
            }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.9, delay: 0.25 + index * 0.14, ease: EASE_OUT }}
          />
        )}
      </div>

      {/* Card */}
      <SpotlightCard
        accent={item.color}
        radius={16}
        style={{ flex: 1, padding: "20px 22px", marginBottom: isLast ? 0 : 22 }}
      >
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <span
              className="mono grid flex-shrink-0 place-items-center"
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                background: `linear-gradient(135deg, ${alpha(item.color, 0.16)}, ${alpha(item.color, 0.05)})`,
                border: `1px solid ${alpha(item.color, 0.22)}`,
                color: item.color,
                fontSize: 14,
              }}
            >
              ⬡
            </span>
            <span>
              <span
                className="block"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#F1F5F9",
                  letterSpacing: "-0.03em",
                }}
              >
                {item.role}
              </span>
              <span className="mono block" style={{ fontSize: 12, color: item.color, marginTop: 2 }}>
                {item.company}
              </span>
            </span>
          </div>

          <span className="flex-shrink-0 text-right">
            <span className="mono block" style={{ fontSize: 11, color: "#475569", letterSpacing: "0.06em" }}>
              {item.period}
            </span>
            <span className="mono block" style={{ fontSize: 10, color: "#2C3E55", marginTop: 2 }}>
              {item.location}
            </span>
          </span>
        </div>

        <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.78, marginBottom: 13 }}>
          {item.description}
        </p>

        <div style={{ marginBottom: 13 }}>
          <AnimatePresence initial={false}>
            {visible.map((h, i) => (
              <motion.div
                key={h}
                className="flex gap-2.5"
                style={{ marginBottom: 6 }}
                initial={{ opacity: 0, height: 0, x: -8 }}
                animate={{ opacity: 1, height: "auto", x: 0 }}
                exit={{ opacity: 0, height: 0, x: -8 }}
                transition={{ duration: 0.32, delay: i * 0.05, ease: EASE_OUT }}
              >
                <span style={{ color: item.color, fontSize: 12, marginTop: 3, flexShrink: 0 }}>▸</span>
                <p style={{ fontSize: 12.5, color: "#4E6280", lineHeight: 1.72, margin: 0 }}>{h}</p>
              </motion.div>
            ))}
          </AnimatePresence>

          {item.highlights.length > 1 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mono"
              style={{
                marginTop: 4,
                padding: 0,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 10.5,
                color: item.color,
                letterSpacing: "0.05em",
                opacity: 0.78,
              }}
            >
              {expanded ? "▴ show less" : `▾ +${item.highlights.length - 1} more`}
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((t, i) => (
              <Tag key={t} label={t} index={i} size="sm" accent={item.color} />
            ))}
          </div>
          {item.certificate && (
            <motion.a
              href={item.certificate}
              target="_blank"
              rel="noopener noreferrer"
              className="mono flex-shrink-0 rounded-md"
              whileHover={{ scale: 1.05 }}
              style={{
                padding: "4px 11px",
                fontSize: 10,
                letterSpacing: "0.07em",
                color: item.color,
                textDecoration: "none",
                background: alpha(item.color, 0.06),
                border: `1px solid ${alpha(item.color, 0.24)}`,
              }}
            >
              ↗ Certificate
            </motion.a>
          )}
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

/* ── Profile pane ─────────────────────────────────────────────────────── */

const CARD_LINES: { label: string; value?: string; color: string; size: number; weight: number; mono: boolean }[] = [
  { label: "Zohaib Ali", color: "#F1F5F9", size: 18, weight: 700, mono: false },
  { label: "Full Stack Developer Intern", color: "#60A5FA", size: 11, weight: 400, mono: true },
  { label: "University", value: "NED UET", color: "#94A3B8", size: 11.5, weight: 600, mono: false },
  { label: "Internships", value: "2", color: "#94A3B8", size: 11.5, weight: 600, mono: false },
  { label: "Projects Shipped", value: "10+", color: "#94A3B8", size: 11.5, weight: 600, mono: false },
  { label: "React.js · Node.js · Express.js", color: "#34D399", size: 11, weight: 400, mono: true },
  { label: "MongoDB · PostgreSQL · REST APIs", color: "#60A5FA", size: 11, weight: 400, mono: true },
  { label: "WebSockets · H3 Geo · Tailwind CSS", color: "#7C3AED", size: 11, weight: 400, mono: true },
  { label: "zohaibaliwork@gmail.com", color: "#334155", size: 10, weight: 400, mono: true },
];

function ProfileCard() {
  const reduced = useReducedMotion();

  return (
    <Reveal from="right" distance={48} duration={0.95}>
      <TiltCard max={6} lift={18} style={{ borderRadius: 22 }}>
        <motion.div
          animate={reduced ? undefined : { y: [0, -9, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
          className="overflow-hidden"
          style={{
            borderRadius: 22,
            background: "rgba(10,14,22,0.94)",
            border: "1px solid rgba(96,165,250,0.16)",
            backdropFilter: "blur(24px)",
            boxShadow: "0 40px 90px rgba(0,0,0,0.65), 0 0 80px rgba(37,99,235,0.09)",
          }}
        >
          {/* Title bar */}
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{ background: "#151A22", borderBottom: "1px solid #1E242E" }}
          >
            {["#FF5F57", "#FFBD2E", "#28C840"].map((c) => (
              <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
            ))}
            <span className="mono ml-2" style={{ fontSize: 11, color: "#4B5563", letterSpacing: "0.05em" }}>
              intern_profile.json
            </span>
            <span className="mono ml-auto flex items-center gap-1.5" style={{ fontSize: 10, color: "#34D399" }}>
              <LiveDot size={6} />
              active
            </span>
          </div>

          <div className="px-7 pb-6 pt-7">
            <motion.span
              className="mono mb-5 grid place-items-center"
              whileHover={reduced ? undefined : { rotate: 90 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{
                width: 48,
                height: 48,
                borderRadius: 13,
                background: "linear-gradient(135deg, rgba(37,99,235,0.18), rgba(124,58,237,0.07))",
                border: "1px solid rgba(96,165,250,0.22)",
                color: "#60A5FA",
                fontSize: 20,
              }}
            >
              ⬡
            </motion.span>

            {CARD_LINES.map((line, i) => (
              <motion.div
                key={line.label}
                className="flex items-baseline justify-between"
                style={{ marginBottom: 8 }}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={VIEWPORT}
                transition={{ delay: 0.2 + i * 0.06, duration: 0.4, ease: EASE_OUT }}
              >
                <span
                  className={line.mono ? "mono" : undefined}
                  style={{
                    fontSize: line.size,
                    fontWeight: line.weight,
                    color: line.color,
                    letterSpacing: line.mono ? "0.04em" : "-0.02em",
                  }}
                >
                  {line.label}
                </span>
                {line.value && (
                  <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: "#F1F5F9" }}>
                    {line.value}
                  </span>
                )}
              </motion.div>
            ))}
          </div>

          {/* Proficiency meters */}
          <div
            className="mx-6 mb-6 overflow-hidden"
            style={{
              borderRadius: 12,
              background: "rgba(37,99,235,0.06)",
              border: "1px solid rgba(37,99,235,0.14)",
            }}
          >
            {PROFICIENCY.map((s, i) => (
              <div
                key={s.label}
                style={{
                  padding: "11px 14px",
                  borderBottom: i < PROFICIENCY.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}
              >
                <div className="mono mb-1.5 flex justify-between" style={{ fontSize: 10 }}>
                  <span style={{ color: "#64748B", letterSpacing: "0.07em" }}>{s.label}</span>
                  <span style={{ color: s.color }}>{s.pct}%</span>
                </div>
                <div className="overflow-hidden" style={{ height: 3, borderRadius: 999, background: "rgba(255,255,255,0.06)" }}>
                  <motion.div
                    style={{
                      height: "100%",
                      borderRadius: 999,
                      background: `linear-gradient(90deg, ${alpha(s.color, 0.6)}, ${s.color})`,
                      boxShadow: `0 0 10px ${alpha(s.color, 0.55)}`,
                    }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.pct}%` }}
                    viewport={VIEWPORT}
                    transition={{ duration: 1.1, delay: 0.5 + i * 0.12, ease: EASE_OUT }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5 px-6 pb-7">
            {["Currently Interning", "Open to Opportunities", "Karachi, PK"].map((t, i) => (
              <Tag key={t} label={t} index={i} size="sm" />
            ))}
          </div>

          <div
            aria-hidden="true"
            style={{ height: 2, background: "linear-gradient(90deg, transparent, #2563EB, #22D3EE, transparent)" }}
          />
        </motion.div>
      </TiltCard>
    </Reveal>
  );
}

/* ── Section ──────────────────────────────────────────────────────────── */

export default function Internship() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Rail that fills as the timeline scrolls past.
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 80%", "end 40%"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 70, damping: 22, restDelta: 0.001 });

  return (
    <Section id="internship" label="Internship Experience">
      <SectionHeading eyebrow="internship experience" title="Real Codebases," accent="Real Impact">
        Professional internships where I shipped{" "}
        <span style={{ color: "#94A3B8" }}>production code</span> — from digital library platforms
        to full company websites built from scratch.
      </SectionHeading>

      <div
        className="mx-auto mb-16"
        style={{
          maxWidth: 580,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 160px), 1fr))",
          gap: 14,
        }}
      >
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} scale>
            <SpotlightCard accent={s.color} radius={16} underline={false} style={{ padding: "20px 22px", textAlign: "center" }}>
              <CountUp
                value={s.value}
                style={{
                  display: "block",
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.7rem, 3.6vw, 2.3rem)",
                  fontWeight: 700,
                  color: s.color,
                  letterSpacing: "-0.05em",
                  lineHeight: 1,
                }}
              />
              <span style={{ display: "block", marginTop: 7, fontSize: 12.5, color: "#64748B", lineHeight: 1.4 }}>
                {s.label}
              </span>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>

      <div className="flex flex-col items-start gap-12 lg:flex-row lg:gap-16">
        <div className="w-full min-w-0 flex-1">
          <Reveal>
            <div
              className="mono mb-6 flex items-center gap-3"
              style={{ fontSize: 11, color: "#334155", letterSpacing: "0.14em", textTransform: "uppercase" }}
            >
              <span>Internship History</span>
              <span style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(96,165,250,0.22), transparent)" }} />
            </div>
          </Reveal>

          <div ref={timelineRef} className="relative">
            {/* Scroll-driven glow riding the spine. */}
            {!reduced && (
              <motion.div
                aria-hidden="true"
                className="absolute"
                style={{
                  left: 6,
                  top: 0,
                  bottom: 0,
                  width: 2,
                  scaleY: fill,
                  transformOrigin: "top",
                  borderRadius: 999,
                  background: "linear-gradient(to bottom, #2563EB, #22D3EE, #7C3AED)",
                  boxShadow: "0 0 14px rgba(37,99,235,0.6)",
                  opacity: 0.65,
                }}
              />
            )}

            {INTERNSHIPS.map((item, i) => (
              <TimelineItem key={item.company} item={item} index={i} isLast={i === INTERNSHIPS.length - 1} />
            ))}
          </div>

          <Reveal delay={0.2} className="mt-10">
            <div
              className="mono mb-5 flex items-center gap-3"
              style={{ fontSize: 11, color: "#334155", letterSpacing: "0.14em", textTransform: "uppercase" }}
            >
              <span>Core Competencies</span>
              <span style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(96,165,250,0.22), transparent)" }} />
            </div>
          </Reveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 190px), 1fr))",
              gap: 10,
            }}
          >
            {DOMAINS.map((d, i) => (
              <motion.div
                key={d.label}
                className="flex cursor-default items-center gap-2.5 rounded-xl"
                initial={{ opacity: 0, scale: 0.9, y: 12 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ delay: i * 0.06, duration: 0.45, ease: EASE_OUT }}
                whileHover={
                  reduced
                    ? undefined
                    : {
                        scale: 1.04,
                        y: -3,
                        borderColor: alpha(d.color, 0.4),
                        boxShadow: `0 0 22px ${alpha(d.color, 0.16)}`,
                      }
                }
                style={{
                  padding: "12px 14px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <span style={{ fontSize: 15, color: d.color, filter: `drop-shadow(0 0 6px ${alpha(d.color, 0.5)})` }}>
                  {d.icon}
                </span>
                <span style={{ fontSize: 13, color: "#94A3B8", fontWeight: 500 }}>{d.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right pane */}
        <div className="w-full lg:w-auto" style={{ flexShrink: 0, width: "clamp(280px, 38vw, 400px)" }}>
          <ProfileCard />

          <div className="mt-5 flex flex-col gap-2.5">
            {INTERNSHIPS.filter((i) => i.certificate).map((item, i) => (
              <Reveal key={item.company} delay={0.15 + i * 0.08}>
                <motion.a
                  href={item.certificate}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl"
                  whileHover={reduced ? undefined : { scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: "14px 18px",
                    background: `linear-gradient(135deg, ${alpha(item.color, 0.07)}, transparent)`,
                    border: `1px solid ${alpha(item.color, 0.22)}`,
                    color: item.color,
                    textDecoration: "none",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <span>
                    <span
                      className="block"
                      style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600, letterSpacing: "-0.02em" }}
                    >
                      {item.company}
                    </span>
                    <span className="mono block" style={{ fontSize: 10, color: "#334155", marginTop: 2, letterSpacing: "0.06em" }}>
                      View Certificate ↗
                    </span>
                  </span>
                  <span
                    className="grid flex-shrink-0 place-items-center rounded-lg"
                    style={{
                      width: 32,
                      height: 32,
                      background: alpha(item.color, 0.1),
                      border: `1px solid ${alpha(item.color, 0.22)}`,
                      fontSize: 14,
                    }}
                  >
                    ↗
                  </span>
                </motion.a>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.35} className="mt-4">
            <div className="mono flex items-center justify-center gap-2" style={{ fontSize: 10.5, color: "#334155", letterSpacing: "0.08em" }}>
              <LiveDot size={6} />
              NED UET · Software Engineering · 2024 — Present
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
