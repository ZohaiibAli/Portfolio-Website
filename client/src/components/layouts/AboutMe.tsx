import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Section from "@/components/fx/Section";
import Reveal from "@/components/fx/Reveal";
import SplitText from "@/components/fx/SplitText";
import TiltCard from "@/components/fx/TiltCard";
import CountUp from "@/components/fx/CountUp";
import { LiveDot, Pill } from "@/components/fx/SectionHeading";
import Tag from "@/components/ui/Tag";
import { EASE_INOUT, EASE_OUT, VIEWPORT, stagger } from "@/lib/motion";

const STACK = ["React.js", "TypeScript", "Node.js", "Express.js", "FastAPI", "MongoDB"];

const STATS = [
  { value: "2+", label: "Internships", color: "#60A5FA" },
  { value: "6+", label: "Projects", color: "#34D399" },
  { value: "3+", label: "Tech Stacks", color: "#A78BFA" },
];

/** A chip that hovers off the corner of the portrait. */
function FloatingChip({
  emoji,
  title,
  sub,
  color,
  position,
  delay,
}: {
  emoji: string;
  title: string;
  sub: string;
  color: string;
  position: React.CSSProperties;
  delay: number;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="absolute flex items-center gap-2.5 rounded-xl px-3.5 py-2.5"
      style={{
        ...position,
        zIndex: 5,
        background: "rgba(10,14,22,0.86)",
        border: `1px solid ${color}33`,
        backdropFilter: "blur(18px)",
        boxShadow: `0 0 24px ${color}1f, 0 12px 36px rgba(0,0,0,0.5)`,
      }}
      initial={{ opacity: 0, scale: 0.7 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={VIEWPORT}
      transition={{ delay, duration: 0.6, ease: EASE_OUT }}
    >
      <motion.span
        animate={reduced ? undefined : { y: [0, -5, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 5 + delay, repeat: Infinity, ease: EASE_INOUT }}
        style={{ fontSize: 17 }}
      >
        {emoji}
      </motion.span>
      <span>
        <span
          className="mono block"
          style={{ fontSize: 11.5, fontWeight: 700, color, lineHeight: 1.2 }}
        >
          {title}
        </span>
        <span className="mono block" style={{ fontSize: 10, color: "#475569", lineHeight: 1.3 }}>
          {sub}
        </span>
      </span>
    </motion.div>
  );
}

export default function AboutMe() {
  const portraitRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // The portrait drifts against the copy as the section passes through.
  const { scrollYProgress } = useScroll({
    target: portraitRef,
    offset: ["start end", "end start"],
  });
  const portraitY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.14, 1.02, 1.14]);

  return (
    <Section id="about" label="About Me">
      <Reveal from="down" distance={16} className="mb-16 flex justify-center">
        <Pill label="about.me" />
      </Reveal>

      <div className="flex flex-col items-center gap-16 lg:flex-row lg:gap-24">
        {/* ── Portrait ─────────────────────────────────────────────────── */}
        <motion.div
          ref={portraitRef}
          className="flex flex-1 justify-center lg:justify-start"
          style={{ y: reduced ? 0 : portraitY }}
        >
          <Reveal from="left" distance={48} scale duration={1}>
            <TiltCard max={11} lift={26} glare={false} style={{ borderRadius: 22 }}>
              <motion.div
                className="relative"
                style={{ width: "min(78vw, 340px)" }}
                animate={reduced ? undefined : { y: [0, -10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: EASE_INOUT }}
              >
                {/* Aura — softness comes from the gradient falloff, not from a
                    filter: this sits inside a continuously floating parent, so
                    a blur here would be re-rasterised on every frame of it. */}
                <div
                  aria-hidden="true"
                  className="absolute rounded-[32px]"
                  style={{
                    inset: -26,
                    opacity: 0.3,
                    background:
                      "radial-gradient(ellipse, #2563EB 0%, #7C3AED 42%, transparent 74%)",
                  }}
                />

                {/* Rotating conic ring — a slow halo around the frame. */}
                {!reduced && (
                  <motion.div
                    aria-hidden="true"
                    className="absolute rounded-[26px]"
                    style={{
                      inset: -2,
                      padding: 1,
                      background:
                        "conic-gradient(from 0deg, transparent 0deg, rgba(96,165,250,0.75) 60deg, rgba(167,139,250,0.75) 120deg, transparent 200deg)",
                      WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  />
                )}

                <div
                  className="relative overflow-hidden"
                  style={{
                    borderRadius: 22,
                    aspectRatio: "4 / 5",
                    border: "1px solid rgba(96,165,250,0.16)",
                    boxShadow: "0 40px 80px -20px rgba(0,0,0,0.85)",
                  }}
                >
                  <motion.img
                    src="/images/Pic.png"
                    alt="Zohaib Ali, Full Stack Developer"
                    loading="lazy"
                    className="h-full w-full object-cover"
                    style={{
                      scale: reduced ? 1 : imageScale,
                      filter: "brightness(0.94) saturate(1.06) contrast(1.04)",
                    }}
                  />

                  {/* Scanline sweep */}
                  {!reduced && (
                    <motion.div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0"
                      style={{
                        height: 90,
                        background:
                          "linear-gradient(180deg, transparent, rgba(96,165,250,0.12), transparent)",
                      }}
                      animate={{ y: ["-90px", "460px"] }}
                      transition={{ duration: 5.5, repeat: Infinity, ease: EASE_INOUT, repeatDelay: 2 }}
                    />
                  )}

                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(6,10,18,0.88) 0%, transparent 48%)",
                    }}
                  />

                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <span
                      className="mono inline-flex items-center gap-2 rounded-lg px-3 py-1.5"
                      style={{
                        background: "rgba(6,10,18,0.78)",
                        border: "1px solid rgba(96,165,250,0.18)",
                        backdropFilter: "blur(12px)",
                        fontSize: 11,
                        color: "#93C5FD",
                        letterSpacing: "0.05em",
                      }}
                    >
                      <LiveDot size={6} />
                      Open to opportunities
                    </span>
                  </div>
                </div>

                <FloatingChip
                  emoji="⚡"
                  title="NED University"
                  sub="software engineering"
                  color="#34D399"
                  position={{ top: -18, right: -18 }}
                  delay={0.5}
                />
                <FloatingChip
                  emoji="🚀"
                  title="6+ shipped"
                  sub="projects"
                  color="#60A5FA"
                  position={{ bottom: -18, left: -18 }}
                  delay={0.65}
                />
              </motion.div>
            </TiltCard>
          </Reveal>
        </motion.div>

        {/* ── Copy ─────────────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col items-center gap-7 text-center lg:items-start lg:text-left">
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5.4vw, 3.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.045em",
              lineHeight: 1.08,
              color: "#F1F5F9",
            }}
          >
            <SplitText text="Crafting systems that" stagger={0.02} />{" "}
            <SplitText text="scale and last." className="grad-text" stagger={0.02} delay={0.18} />
          </h2>

          <Reveal delay={0.15}>
            <p style={{ maxWidth: 520, color: "#64748B", lineHeight: 1.85, fontSize: "clamp(0.95rem, 2.2vw, 1.08rem)" }}>
              Full Stack Developer specializing in{" "}
              <span style={{ color: "#94A3B8" }}>scalable web applications</span> and{" "}
              <span style={{ color: "#94A3B8" }}>RAG/ML-powered features</span>. I turn complex
              problems into simple, reliable, user-centric solutions.
            </p>
          </Reveal>

          <motion.div
            className="flex flex-wrap justify-center gap-2 lg:justify-start"
            variants={stagger(0.05, 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            {STACK.map((tech, i) => (
              <Tag key={tech} label={tech} index={i} />
            ))}
          </motion.div>

          <Reveal delay={0.3}>
            <div className="flex justify-center gap-10 lg:justify-start">
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-1 lg:items-start">
                  <CountUp
                    value={s.value}
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(1.8rem, 4vw, 2.2rem)",
                      fontWeight: 700,
                      color: s.color,
                      letterSpacing: "-0.05em",
                      textShadow: `0 0 24px ${s.color}55`,
                    }}
                  />
                  <span
                    className="mono"
                    style={{ fontSize: 10.5, color: "#475569", letterSpacing: "0.14em", textTransform: "uppercase" }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
