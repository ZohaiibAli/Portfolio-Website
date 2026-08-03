import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import TiltCard from "@/components/fx/TiltCard";
import SplitText from "@/components/fx/SplitText";
import Marquee from "@/components/fx/Marquee";
import { LiveDot } from "@/components/fx/SectionHeading";
import GlowButton from "@/components/ui/GlowButton";
import { usePointer } from "@/lib/usePointer";
import { EASE_OUT, EASE_SOFT, EASE_INOUT } from "@/lib/motion";

const ROLES = [
  "Full-Stack Developer",
  "MERN / PERN Engineer",
  "AI & RAG Integrator",
  "Backend Engineer",
];

const STACK = [
  "React.js",
  "TypeScript",
  "Node.js",
  "Express.js",
  "FastAPI",
  "PostgreSQL",
  "MongoDB",
  "Python",
  "Tailwind CSS",
  "WebSockets",
];

/* ── Typewriter ───────────────────────────────────────────────────────── */

function useTypewriter(texts: string[], speed = 62, pause = 1900): string {
  const [out, setOut] = useState("");
  const [i, setI] = useState(0);
  const [n, setN] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const current = texts[i];

    const t = setTimeout(
      () => {
        if (!deleting) {
          if (n < current.length) {
            setOut(current.slice(0, n + 1));
            setN(n + 1);
          } else {
            setTimeout(() => setDeleting(true), pause);
          }
        } else if (n > 0) {
          setOut(current.slice(0, n - 1));
          setN(n - 1);
        } else {
          setDeleting(false);
          setI((v) => (v + 1) % texts.length);
        }
      },
      deleting ? speed / 2.2 : speed
    );

    return () => clearTimeout(t);
  }, [n, deleting, i, texts, speed, pause, reduced]);

  return reduced ? texts[0] : out;
}

/* ── Code editor ──────────────────────────────────────────────────────── */

type Token = { t: string; c: string };

const CODE: Token[][] = [
  [{ t: "const ", c: "#C792EA" }, { t: "developer", c: "#82AAFF" }, { t: " = {", c: "#E2E8F0" }],
  [
    { t: "  stack", c: "#7FDBCA" },
    { t: ": [", c: "#E2E8F0" },
    { t: '"TypeScript"', c: "#ECC48D" },
    { t: ", ", c: "#E2E8F0" },
    { t: '"Python"', c: "#ECC48D" },
    { t: "],", c: "#E2E8F0" },
  ],
  [
    { t: "  builds", c: "#7FDBCA" },
    { t: ": ", c: "#E2E8F0" },
    { t: '"full-stack marketplaces"', c: "#ECC48D" },
    { t: ",", c: "#E2E8F0" },
  ],
  [
    { t: "  focus", c: "#7FDBCA" },
    { t: ": ", c: "#E2E8F0" },
    { t: '"RAG + ML integration"', c: "#ECC48D" },
    { t: ",", c: "#E2E8F0" },
  ],
  [{ t: "  deploy", c: "#F78C6C" }, { t: ": ", c: "#E2E8F0" }, { t: "async", c: "#C792EA" }, { t: " () => {", c: "#E2E8F0" }],
  [
    { t: "    await ", c: "#C792EA" },
    { t: "ship", c: "#82AAFF" },
    { t: "(", c: "#E2E8F0" },
    { t: "production", c: "#ECC48D" },
    { t: ");", c: "#E2E8F0" },
  ],
  [{ t: "  },", c: "#E2E8F0" }],
  [{ t: "};", c: "#E2E8F0" }],
];

function CodeEditor() {
  const [lines, setLines] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setLines(CODE.length);
      return;
    }
    if (lines >= CODE.length) return;
    const t = setTimeout(() => setLines((v) => v + 1), 190);
    return () => clearTimeout(t);
  }, [lines, reduced]);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        borderRadius: 16,
        background: "linear-gradient(160deg, #0D1117 0%, #12161F 100%)",
        border: "1px solid #232A35",
        boxShadow:
          "0 0 0 1px rgba(96,165,250,0.06), 0 40px 80px -20px rgba(0,0,0,0.85), 0 0 90px rgba(37,99,235,0.1)",
        fontFamily: "var(--font-mono)",
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: "1px solid #1E242E", background: "#151A22" }}
      >
        {["#FF5F57", "#FFBD2E", "#28C840"].map((c) => (
          <span key={c} className="h-3 w-3 rounded-full" style={{ background: c }} />
        ))}
        <span className="ml-3" style={{ fontSize: 11, color: "#6B7280", letterSpacing: "0.05em" }}>
          developer.ts
        </span>
        <span className="ml-auto flex items-center gap-1.5">
          <LiveDot size={6} />
          <span style={{ fontSize: 11, color: "#34D399" }}>compiling</span>
        </span>
      </div>

      {/* Code body */}
      <div className="px-5 py-5" style={{ fontSize: 13, lineHeight: "1.85", minHeight: 232 }}>
        {CODE.slice(0, lines).map((tokens, i) => (
          <motion.div
            key={i}
            className="flex items-center"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.24, ease: EASE_OUT }}
          >
            <span
              className="mr-5 w-4 select-none text-right"
              style={{ fontSize: 11, color: "#3B4757" }}
            >
              {i + 1}
            </span>
            <span>
              {tokens.map((tk, j) => (
                <span key={j} style={{ color: tk.c }}>
                  {tk.t}
                </span>
              ))}
            </span>
            {i === lines - 1 && (
              <motion.span
                className="ml-0.5 inline-block"
                style={{ width: 2, height: 15, background: "#60A5FA" }}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Status bar */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ background: "#1A202A", borderTop: "1px solid #1E242E", fontSize: 11, color: "#6B7280" }}
      >
        <span>TypeScript 5.4</span>
        <span style={{ color: "#34D399" }}>✓ No errors</span>
        <span>UTF-8</span>
      </div>
    </div>
  );
}

/* ── Floating metric ──────────────────────────────────────────────────── */

interface MetricProps {
  label: string;
  value: string;
  sub: string;
  color: string;
  delay: number;
  x: string;
  y: string;
  depth: number;
  px: MotionValue<number>;
  py: MotionValue<number>;
}

function Metric({ label, value, sub, color, delay, x, y, depth, px, py }: MetricProps) {
  const reduced = useReducedMotion();
  // Cards at different depths drift by different amounts — parallax against
  // the editor behind them.
  const tx = useTransform(px, [0, 1], [depth, -depth]);
  const ty = useTransform(py, [0, 1], [depth * 0.6, -depth * 0.6]);

  return (
    <motion.div
      className="absolute gpu"
      style={{
        left: x,
        top: y,
        translateX: "-50%",
        translateY: "-50%",
        x: reduced ? 0 : tx,
        y: reduced ? 0 : ty,
        zIndex: 20,
        minWidth: 132,
        padding: "12px 16px",
        borderRadius: 14,
        background: "rgba(10,14,22,0.82)",
        border: `1px solid ${color}33`,
        backdropFilter: "blur(18px)",
        boxShadow: `0 0 26px ${color}22, 0 12px 40px rgba(0,0,0,0.5)`,
      }}
      initial={{ opacity: 0, scale: 0.72 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.7, ease: EASE_OUT }}
    >
      <motion.div
        animate={reduced ? undefined : { y: [0, -5, 0] }}
        transition={{ duration: 3.4 + delay, repeat: Infinity, ease: EASE_INOUT }}
      >
        <div
          className="mono"
          style={{ fontSize: 9.5, color: "#5B6B80", letterSpacing: "0.12em", textTransform: "uppercase" }}
        >
          {label}
        </div>
        <div
          className="mono"
          style={{ fontSize: 22, fontWeight: 700, color, letterSpacing: "-0.03em", marginTop: 4 }}
        >
          {value}
        </div>
        <div style={{ fontSize: 10.5, color: "#3E4C5E", marginTop: 2 }}>{sub}</div>
      </motion.div>
    </motion.div>
  );
}

/* ── Hero ─────────────────────────────────────────────────────────────── */

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const role = useTypewriter(ROLES);
  const { x, y } = usePointer();

  // Pointer as a 0…1 fraction of the viewport, spring-damped. Computed per
  // frame rather than from a captured width, so it survives resizes.
  const damp = { stiffness: 60, damping: 20 };
  const px = useSpring(useTransform(x, (v) => v / (window.innerWidth || 1)), damp);
  const py = useSpring(useTransform(y, (v) => v / (window.innerHeight || 1)), damp);

  // The hero sinks away as the next section rises over it.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  return (
    <section
      ref={ref}
      id="hero"
      aria-label="Introduction"
      className="relative flex w-full items-center"
      style={{ minHeight: "100svh", paddingTop: 96, paddingBottom: 72 }}
    >
      <motion.div
        className="relative mx-auto flex w-full flex-col items-center gap-14 lg:flex-row lg:gap-20"
        style={{
          maxWidth: 1200,
          paddingLeft: "clamp(1.25rem, 5vw, 4rem)",
          paddingRight: "clamp(1.25rem, 5vw, 4rem)",
          y: reduced ? 0 : contentY,
          opacity: reduced ? 1 : contentOpacity,
          scale: reduced ? 1 : contentScale,
        }}
      >
        {/* ── Left column ──────────────────────────────────────────────── */}
        <div className="flex w-full flex-1 flex-col items-center text-center lg:items-start lg:text-left">
          <motion.span
            className="mono inline-flex items-center gap-2.5 rounded-full"
            initial={{ opacity: 0, y: -14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE_OUT }}
            style={{
              padding: "6px 16px",
              background: "rgba(96,165,250,0.08)",
              border: "1px solid rgba(96,165,250,0.2)",
              color: "#93C5FD",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            <LiveDot />
            open to new roles
          </motion.span>

          {/* Name — per-letter 3D reveal, starts immediately behind the curtain. */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(2.7rem, 10vw, 5rem)",
              lineHeight: 0.98,
              letterSpacing: "-0.05em",
              color: "#F1F5F9",
              margin: "26px 0 14px",
            }}
          >
            <SplitText text="Zohaib Ali" immediate delay={0.25} stagger={0.05} />
          </h1>

          {/* Typed role */}
          <motion.div
            className="flex h-9 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75, duration: 0.6 }}
          >
            <span
              className="mono font-semibold"
              style={{
                color: "#60A5FA",
                fontSize: "clamp(1.05rem, 3.6vw, 1.7rem)",
                letterSpacing: "-0.02em",
                textShadow: "0 0 26px rgba(96,165,250,0.35)",
              }}
            >
              {role}
              <motion.span
                className="ml-1 inline-block align-middle"
                style={{ width: 2, height: "1.05em", background: "#60A5FA" }}
                animate={reduced ? undefined : { opacity: [1, 0, 1] }}
                transition={{ duration: 1.05, repeat: Infinity, ease: "linear" }}
              />
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.85, ease: EASE_OUT }}
            style={{
              margin: "24px 0 38px",
              maxWidth: 520,
              color: "#64748B",
              lineHeight: 1.85,
              fontSize: "clamp(0.92rem, 2.4vw, 1.08rem)",
            }}
          >
            I build <span style={{ color: "#94A3B8" }}>scalable full-stack web applications</span> and
            ship AI-powered features — RAG chatbots, ML recommendations and real-time systems — with
            clean architecture and a strong focus on user-centric design.
          </motion.p>

          <motion.div
            className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 1, ease: EASE_OUT }}
          >
            <GlowButton
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View Projects <span aria-hidden="true">→</span>
            </GlowButton>
            <GlowButton
              href="/resume/Zohaib_Ali_Full_Stack_Developer_Resume.pdf"
              variant="ghost"
              download
            >
              Download Resume
            </GlowButton>
          </motion.div>

          {/* Velocity-reactive tech ticker */}
          <motion.div
            className="mt-12 w-full"
            style={{ maxWidth: 520 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.25, duration: 0.8 }}
          >
            <Marquee items={STACK} speed={30} />
          </motion.div>
        </div>

        {/* ── Right column ─────────────────────────────────────────────── */}
        <motion.div
          className="relative hidden flex-1 lg:block"
          style={{ minHeight: 440 }}
          initial={{ opacity: 0, x: 60, filter: "blur(14px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, delay: 0.5, ease: EASE_SOFT }}
        >
          <Metric label="Projects Shipped" value="6+" sub="full-stack builds" color="#34D399" delay={1.4} x="2%" y="10%" depth={26} px={px} py={py} />
          <Metric label="Internships" value="2+" sub="full stack + frontend" color="#60A5FA" delay={1.55} x="92%" y="6%" depth={-20} px={px} py={py} />
          <Metric label="Hackathons" value="3" sub="top performer" color="#F59E0B" delay={1.7} x="90%" y="84%" depth={18} px={px} py={py} />

          <TiltCard max={10} lift={30} style={{ borderRadius: 16 }}>
            <motion.div
              animate={reduced ? undefined : { y: [0, -8, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: EASE_INOUT }}
            >
              <CodeEditor />
            </motion.div>
          </TiltCard>

          <motion.div
            className="mt-4 flex items-center gap-3 rounded-xl px-4 py-3"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.7, ease: EASE_OUT }}
            style={{
              background: "rgba(10,14,22,0.7)",
              border: "1px solid #1E242E",
              backdropFilter: "blur(10px)",
              fontFamily: "var(--font-mono)",
              fontSize: 12.5,
            }}
          >
            <span style={{ color: "#34D399" }}>❯</span>
            <span style={{ color: "#64748B" }}>
              git log --oneline <span style={{ color: "#94A3B8" }}>|</span>{" "}
              <span style={{ color: "#60A5FA" }}>wc -l</span>
            </span>
            <span className="ml-auto" style={{ color: "#34D399" }}>
              842
            </span>
          </motion.div>

          {/* Glow bed behind the editor stack */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute"
            style={{
              inset: -50,
              zIndex: -1,
              filter: "blur(26px)",
              background:
                "radial-gradient(ellipse at 50% 50%, rgba(37,99,235,0.16) 0%, rgba(124,58,237,0.08) 48%, transparent 72%)",
            }}
          />
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#about"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
        }}
        className="absolute bottom-7 left-1/2 flex flex-col items-center gap-2"
        style={{ translateX: "-50%", textDecoration: "none", color: "#334155" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        whileHover={{ color: "#60A5FA" }}
      >
        <span className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase" }}>
          scroll
        </span>
        <span className="relative block overflow-hidden" style={{ width: 1, height: 40, background: "rgba(96,165,250,0.15)" }}>
          <motion.span
            className="absolute inset-x-0"
            style={{ height: 14, background: "linear-gradient(180deg, transparent, #60A5FA)" }}
            animate={reduced ? undefined : { y: [-14, 40] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: EASE_INOUT }}
          />
        </span>
      </motion.a>
    </section>
  );
}
