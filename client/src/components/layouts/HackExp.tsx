import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useReducedMotion } from "framer-motion";
import Section from "@/components/fx/Section";
import SectionHeading from "@/components/fx/SectionHeading";
import SpotlightCard from "@/components/fx/SpotlightCard";
import Reveal from "@/components/fx/Reveal";
import CountUp from "@/components/fx/CountUp";
import Tag from "@/components/ui/Tag";
import { useAmbient, useMediaQuery, useScrollFx } from "@/lib/useAmbient";
import { EASE_OUT, VIEWPORT, alpha } from "@/lib/motion";

interface Hackathon {
  id: string;
  year: string;
  title: string;
  role: string;
  org: string;
  location: string;
  color: string;
  icon: string;
  tagline: string;
  badge: string;
  highlights: string[];
  tags: string[];
}

const HACKATHONS: Hackathon[] = [
  {
    id: "iba",
    year: "2026",
    title: "IBA Hackathon",
    role: "Full Stack Developer",
    org: "Institute of Business Administration",
    location: "Karachi, Pakistan",
    color: "#22D3EE",
    icon: "⬡",
    tagline: "Service Marketplace Platform",
    badge: "IBA · 2026",
    highlights: [
      "Architected a three-role platform (Admin / Seeker / Provider) with secure JWT auth and role-based access control",
      "Built real-time chat between seekers and providers using WebSockets for instant communication",
      "Integrated H3 geospatial indexing for radius-based, location-aware service discovery",
      "Designed scalable backend architecture focused on performance and real-time communication",
    ],
    tags: ["React.js", "Node.js", "WebSockets", "H3 Geo", "MongoDB", "RBAC"],
  },
  {
    id: "codesphere",
    year: "2025",
    title: "CodeSphere Hackathon",
    role: "Full Stack Developer",
    org: "NED University",
    location: "Karachi, Pakistan",
    color: "#34D399",
    icon: "◈",
    tagline: "AgriTech Solution",
    badge: "NED · 2025",
    highlights: [
      "Collaborated cross-functionally on a technology-driven solution tackling real agricultural challenges",
      "Led frontend development and contributed to backend logic and overall system design",
      "Delivered a fully functional prototype under intense time constraints and presented to expert judges",
      "Applied agile thinking and rapid prototyping to iterate quickly across a compressed timeline",
    ],
    tags: ["React.js", "Express.js", "Team Leadership", "Rapid Prototyping", "System Design"],
  },
  {
    id: "smec",
    year: "2024",
    title: "SMEC Hackathon",
    role: "Full Stack Developer",
    org: "Sir Syed University",
    location: "Karachi, Pakistan",
    color: "#0EA5E9",
    icon: "◉",
    tagline: "Textile Industry Operations",
    badge: "Sir Syed · 2024",
    highlights: [
      "Developed a solution targeting operational inefficiencies in the textile industry",
      "Applied structured problem analysis, feasibility evaluation and collaborative development practices",
      "Strengthened rapid-prototyping abilities and solution-design intuition under competitive conditions",
      "Gained hands-on experience presenting technical solutions to an industry-expert panel",
    ],
    tags: ["Problem Analysis", "Full Stack", "Feasibility Study", "Prototyping", "Collaboration"],
  },
];

const STATS = [
  { value: "3", label: "Hackathons competed", color: "#22D3EE" },
  { value: "6+", label: "Technologies used", color: "#0EA5E9" },
  { value: "Top", label: "Performer each time", color: "#F59E0B" },
];

/* ── Card ─────────────────────────────────────────────────────────────── */

function HackathonCard({ item, index, side }: { item: Hackathon; index: number; side: "left" | "right" }) {
  const [expanded, setExpanded] = useState(false);
  const reduced = useReducedMotion();
  const visible = expanded ? item.highlights : item.highlights.slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? -48 : 48, y: 20, scale: 0.98 }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.75, delay: index * 0.08, ease: EASE_OUT }}
      whileHover={reduced ? undefined : { y: -5 }}
    >
      <SpotlightCard accent={item.color} radius={18} style={{ padding: "22px 24px" }}>
        <div className="mb-3 flex items-start gap-3">
          <motion.span
            className="mono grid flex-shrink-0 place-items-center"
            whileHover={reduced ? undefined : { rotate: 180, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            style={{
              width: 38,
              height: 38,
              borderRadius: 11,
              background: `linear-gradient(135deg, ${alpha(item.color, 0.16)}, ${alpha(item.color, 0.05)})`,
              border: `1px solid ${alpha(item.color, 0.22)}`,
              color: item.color,
              fontSize: 16,
            }}
          >
            {item.icon}
          </motion.span>

          <div className="min-w-0">
            <span
              className="mono inline-block rounded-md"
              style={{
                padding: "2px 8px",
                fontSize: 9.5,
                color: item.color,
                background: alpha(item.color, 0.1),
                border: `1px solid ${alpha(item.color, 0.22)}`,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
              }}
            >
              {item.badge}
            </span>
            <h3
              style={{
                marginTop: 5,
                fontFamily: "var(--font-display)",
                fontSize: 15.5,
                fontWeight: 700,
                color: "#E9F1FF",
                letterSpacing: "-0.03em",
                lineHeight: 1.25,
              }}
            >
              {item.title}
            </h3>
          </div>
        </div>

        <p className="mono" style={{ fontSize: 11, color: alpha(item.color, 0.8), letterSpacing: "0.04em" }}>
          {item.role} · {item.org}
        </p>
        <p style={{ margin: "5px 0 13px", fontSize: 12, color: "#8FA8C8", fontStyle: "italic" }}>
          {item.tagline}
        </p>

        <div style={{ marginBottom: 14 }}>
          <AnimatePresence initial={false}>
            {visible.map((h, i) => (
              <motion.div
                key={h}
                className="flex gap-2.5"
                style={{ marginBottom: 7 }}
                initial={{ opacity: 0, height: 0, x: -8 }}
                animate={{ opacity: 1, height: "auto", x: 0 }}
                exit={{ opacity: 0, height: 0, x: -8 }}
                transition={{ duration: 0.32, delay: i * 0.04, ease: EASE_OUT }}
              >
                <span style={{ color: item.color, fontSize: 12.5, marginTop: 3, flexShrink: 0 }}>▸</span>
                <p style={{ fontSize: 12.5, color: "#607E9E", lineHeight: 1.75, margin: 0 }}>{h}</p>
              </motion.div>
            ))}
          </AnimatePresence>

          {item.highlights.length > 2 && (
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
              {expanded ? "▴ show less" : `▾ +${item.highlights.length - 2} more`}
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((t, i) => (
            <Tag key={t} label={t} index={i} size="sm" accent={item.color} />
          ))}
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

/** Year + location plate that sits opposite each card on the desktop timeline. */
function YearPlate({ item, side }: { item: Hackathon; side: "left" | "right" }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? 24 : -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.6, delay: 0.2, ease: EASE_OUT }}
      style={{ textAlign: side === "left" ? "left" : "right" }}
    >
      <span
        style={{
          display: "block",
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2rem, 4vw, 2.8rem)",
          fontWeight: 800,
          letterSpacing: "-0.05em",
          color: alpha(item.color, 0.28),
          lineHeight: 1,
        }}
      >
        {item.year}
      </span>
      <span className="mono" style={{ display: "block", marginTop: 6, fontSize: 11.5, color: "#455C78" }}>
        {item.location}
      </span>
    </motion.div>
  );
}

/* ── Section ──────────────────────────────────────────────────────────── */

export default function HackExp() {
  const railRef = useRef<HTMLDivElement>(null);
  const ambient = useAmbient();
  const fillOn = useScrollFx();

  /* The section ships two full layouts — an alternating centre rail and a
     left-aligned stack — and `hidden lg:block` only stopped one of them being
     *painted*. Both were mounted on every device, so a phone built every
     hackathon card twice, ran a scroll spring for a rail it would never show,
     and kept a `box-shadow` loop alive on each of the hidden rail's nodes.
     Choosing in JS means only the layout in use exists. */
  const wide = useMediaQuery("(min-width: 1024px)");

  /* Element-targeted tracking measures the rail's offset chain on every scroll
     event, and the spring on top of it integrates on every frame the value
     moves — both of them, on the tier without a rail to fill, producing a
     number nothing reads. Untargeting the one and parking the other on a
     motionless source is what actually stops the work. See `Section`. */
  const still = useMotionValue(0);
  const { scrollYProgress } = useScroll(
    fillOn ? { target: railRef, offset: ["start 82%", "end 30%"] } : {}
  );
  const fill = useSpring(fillOn ? scrollYProgress : still, {
    stiffness: 65,
    damping: 22,
    restDelta: 0.001,
  });

  return (
    <Section id="hackathons" label="Hackathon Experience">
      <SectionHeading eyebrow="hackathon experience" title="Built Under Pressure," accent="Shipped to Win">
        Competitive hackathons across Karachi's top universities — tight deadlines met{" "}
        <span style={{ color: "#8FA8C8" }}>full-stack engineering</span> and creative problem-solving.
      </SectionHeading>

      {/* ── Desktop: alternating centre rail ── */}
      {wide && (
      <div ref={railRef} className="relative">
        {/* Ghost rail */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-1/2"
          style={{ width: 2, translate: "-50%", background: "rgba(96,165,250,0.08)", borderRadius: 999 }}
        />
        {/* Scroll-driven fill */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-y-0 left-1/2"
          style={{
            width: 2,
            translate: "-50%",
            scaleY: fillOn ? fill : 1,
            transformOrigin: "top",
            borderRadius: 999,
            background: "linear-gradient(to bottom, #2563EB, #22D3EE, #0EA5E9)",
            boxShadow: "0 0 14px rgba(37,99,235,0.6), 0 0 34px rgba(37,99,235,0.25)",
          }}
        />

        <div className="flex flex-col gap-14">
          {HACKATHONS.map((item, i) => {
            const side: "left" | "right" = i % 2 === 0 ? "left" : "right";
            return (
              <div key={item.id} className="relative grid items-center" style={{ gridTemplateColumns: "1fr 88px 1fr" }}>
                {side === "left" ? (
                  <>
                    <div style={{ paddingRight: 8 }}>
                      <HackathonCard item={item} index={i} side="left" />
                    </div>
                    <div />
                    <div style={{ paddingLeft: 8 }}>
                      <YearPlate item={item} side="left" />
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ paddingRight: 8 }}>
                      <YearPlate item={item} side="right" />
                    </div>
                    <div />
                    <div style={{ paddingLeft: 8 }}>
                      <HackathonCard item={item} index={i} side="right" />
                    </div>
                  </>
                )}

                {/* Node on the rail */}
                <motion.span
                  className="absolute left-1/2 top-1/2"
                  style={{ translate: "-50% -50%", zIndex: 2 }}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={VIEWPORT}
                  transition={{ delay: 0.15 + i * 0.08, type: "spring", stiffness: 300, damping: 18 }}
                >
                  <motion.span
                    className="block rounded-full"
                    style={{ width: 15, height: 15, background: item.color, border: "3px solid #03060F" }}
                    /* Paint property, infinite loop — see the matching note in
                       `Internship`. High tier only. */
                    animate={
                      ambient
                        ? {
                            boxShadow: [
                              `0 0 0 ${alpha(item.color, 0)}`,
                              `0 0 20px ${alpha(item.color, 0.7)}`,
                              `0 0 0 ${alpha(item.color, 0)}`,
                            ],
                          }
                        : undefined
                    }
                    transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.35 }}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute rounded-full"
                    style={{ inset: -7, border: `1px solid ${alpha(item.color, 0.24)}` }}
                  />
                </motion.span>
              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* ── Mobile: left-aligned rail ── */}
      {!wide && (
      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute inset-y-0"
          style={{ left: 19, width: 2, background: "rgba(96,165,250,0.08)", borderRadius: 999 }}
        >
          <motion.div
            className="absolute inset-x-0 top-0"
            style={{
              borderRadius: 999,
              background: "linear-gradient(to bottom, #2563EB, #22D3EE, #0EA5E9)",
              boxShadow: "0 0 12px rgba(37,99,235,0.55)",
            }}
            initial={{ height: "0%" }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 2, ease: EASE_OUT }}
          />
        </div>

        <div className="flex flex-col gap-6" style={{ paddingLeft: 52 }}>
          {HACKATHONS.map((item, i) => (
            <div key={item.id} className="relative">
              <motion.span
                className="absolute rounded-full"
                style={{
                  left: -40,
                  top: 24,
                  width: 13,
                  height: 13,
                  background: item.color,
                  border: "3px solid #03060F",
                  zIndex: 2,
                }}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={VIEWPORT}
                transition={{ delay: i * 0.08, type: "spring", stiffness: 300, damping: 18 }}
              />
              <div className="mono mb-2" style={{ fontSize: 10.5, color: alpha(item.color, 0.75), letterSpacing: "0.1em" }}>
                {item.year} · {item.location}
              </div>
              <HackathonCard item={item} index={i} side="right" />
            </div>
          ))}
        </div>
      </div>
      )}

      {/* ── Stats ── */}
      <div
        className="mt-20"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
          gap: 14,
        }}
      >
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} scale>
            <SpotlightCard accent={s.color} radius={16} underline={false} style={{ padding: "22px", textAlign: "center" }}>
              <CountUp
                value={s.value}
                style={{
                  display: "block",
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.6rem, 3.6vw, 2.2rem)",
                  fontWeight: 700,
                  color: s.color,
                  letterSpacing: "-0.05em",
                  lineHeight: 1,
                }}
              />
              <span style={{ display: "block", marginTop: 7, fontSize: 12.5, color: "#607E9E" }}>{s.label}</span>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
