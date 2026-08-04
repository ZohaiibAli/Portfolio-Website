import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import SystemGraph from "@/components/fx/SystemGraph";
import SplitText from "@/components/fx/SplitText";
import ScrambleText from "@/components/fx/ScrambleText";
import Marquee from "@/components/fx/Marquee";
import { LiveDot } from "@/components/fx/SectionHeading";
import GlowButton from "@/components/ui/GlowButton";
import { usePointer } from "@/lib/usePointer";
import { useAmbient, useMediaQuery, useScrollFx } from "@/lib/useAmbient";
import { useQuality } from "@/lib/useQuality";
import { EASE_OUT, EASE_INOUT } from "@/lib/motion";
import { INTERNSHIPS_COMPLETED, PROJECTS_SHIPPED } from "@/lib/profile";

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

/* ── Role line ────────────────────────────────────────────────────────────

   Still its own component, for the reason the typewriter it replaced was: the
   line rewrites itself twenty-five times a second, and anything sharing a
   component with it is reconciled on every one of those ticks. Held in `Hero`,
   that would be both columns, the system graph and all three stat tiles.       */

function Role() {
  return (
    <motion.div
      className="flex h-9 items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.75, duration: 0.6 }}
    >
      <span
        className="mono font-semibold"
        style={{
          color: "#38BDF8",
          fontSize: "clamp(1.05rem, 3.6vw, 1.7rem)",
          letterSpacing: "-0.02em",
          textShadow: "0 0 26px rgba(56,189,248,0.4)",
        }}
      >
        <ScrambleText texts={ROLES} />
        {/* CSS rather than a Framer loop — see the note on `.caret`. */}
        <span className="caret ml-1 inline-block align-middle" />
      </span>
    </motion.div>
  );
}

/* ── Stat tile ────────────────────────────────────────────────────────────

   Tiles at different depths drift by different amounts as the pointer moves,
   so the row shears slightly against the graph above it. The parallax is the
   only thing here that runs continuously, and it is off below the high tier.  */

interface MetricProps {
  label: string;
  value: string;
  color: string;
  delay: number;
  depth: number;
  px: MotionValue<number>;
  py: MotionValue<number>;
}

function Metric({ label, value, color, delay, depth, px, py }: MetricProps) {
  const ambient = useAmbient();
  const tx = useTransform(px, [0, 1], [depth, -depth]);
  const ty = useTransform(py, [0, 1], [depth * 0.5, -depth * 0.5]);

  return (
    <motion.div
      className="gpu"
      style={{
        x: ambient ? tx : 0,
        y: ambient ? ty : 0,
        padding: "12px 14px",
        borderRadius: 13,
        background: "rgba(6,11,24,0.86)",
        border: `1px solid ${color}33`,
        backdropFilter: "blur(18px)",
        boxShadow: `0 0 24px ${color}1f, 0 10px 34px rgba(0,0,0,0.5)`,
      }}
      initial={{ opacity: 0, y: 18, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.65, ease: EASE_OUT }}
    >
      <motion.div
        animate={ambient ? { y: [0, -4, 0] } : undefined}
        transition={{ duration: 3.4 + delay, repeat: Infinity, ease: EASE_INOUT }}
      >
        <div
          className="mono"
          style={{ fontSize: 20, fontWeight: 700, color, letterSpacing: "-0.03em" }}
        >
          {value}
        </div>
        <div
          className="mono"
          style={{
            fontSize: 8.5,
            color: "#5A7492",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginTop: 3,
          }}
        >
          {label}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Hero ─────────────────────────────────────────────────────────────────── */

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const sink = useScrollFx();
  const high = useQuality() === "high";
  const reduced = useReducedMotion();
  const { x, y } = usePointer();

  /* The right column is desktop-only, and CSS `display: none` hides a subtree
     without unmounting it: the graph would keep its five packets and four node
     pulses running, and three stat tiles would keep subscribing to two springs
     each — all on phones, for a column nobody can see. Matching the breakpoint
     in JS means it is simply not there. */
  const wideEnoughForColumn = useMediaQuery("(min-width: 1024px)");

  // Pointer as a 0…1 fraction of the viewport, spring-damped. Computed per
  // frame rather than from a captured width, so it survives resizes.
  const damp = { stiffness: 60, damping: 20 };
  const px = useSpring(useTransform(x, (v) => v / (window.innerWidth || 1)), damp);
  const py = useSpring(useTransform(y, (v) => v / (window.innerHeight || 1)), damp);

  /* The hero sinks away as the next section rises over it.

     `scale` on this subtree is the most expensive scroll-linked transform on
     the page: it covers the headline, the paragraph, both buttons, the ticker
     and the whole graph, so the browser re-rasterises a screenful at a new
     scale factor on every frame — and it fires on the user's very first scroll
     gesture, the frame that decides whether the site feels smooth. High tier
     only; below it the hero simply scrolls away.

     Which makes the element-targeted tracking dead weight too: it measures the
     hero's box on every scroll frame to produce numbers nothing reads. See the
     note in `Section`. */
  const { scrollYProgress } = useScroll(
    sink ? { target: ref, offset: ["start start", "end start"] } : {}
  );
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
        className="relative mx-auto flex w-full flex-col items-center gap-16 lg:flex-row lg:gap-20"
        style={{
          maxWidth: 1200,
          paddingLeft: "clamp(1.25rem, 5vw, 4rem)",
          paddingRight: "clamp(1.25rem, 5vw, 4rem)",
          y: sink ? contentY : 0,
          opacity: sink ? contentOpacity : 1,
          scale: sink ? contentScale : 1,
        }}
      >
        {/* ── Left column ──────────────────────────────────────────────── */}
        <div className="flex w-full flex-1 flex-col items-center text-center lg:items-start lg:text-left">
          <motion.span
            className="mono inline-flex items-center gap-2.5 rounded-full"
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE_OUT }}
            style={{
              padding: "6px 16px",
              background: "rgba(56,189,248,0.08)",
              border: "1px solid rgba(56,189,248,0.22)",
              color: "#93C5FD",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            <LiveDot />
            open to new roles
          </motion.span>

          {/* Name — per-letter 3D reveal starting immediately behind the
              curtain, then a single specular sweep once the letters have
              landed. The sweep is high-tier only: it repaints the glyphs for
              its duration, and this is the one moment in the hero where that is
              affordable, not a licence to run it everywhere. */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(2.7rem, 10vw, 5rem)",
              lineHeight: 0.98,
              letterSpacing: "-0.05em",
              color: "#E9F1FF",
              margin: "26px 0 14px",
            }}
          >
            <SplitText
              text="Zohaib Ali"
              className={high && !reduced ? "name-sweep" : undefined}
              immediate
              delay={0.25}
              stagger={0.05}
            />
          </h1>

          <Role />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85, ease: EASE_OUT }}
            style={{
              margin: "24px 0 38px",
              maxWidth: 520,
              color: "#607E9E",
              lineHeight: 1.85,
              fontSize: "clamp(0.92rem, 2.4vw, 1.08rem)",
            }}
          >
            I build <span style={{ color: "#8FA8C8" }}>scalable full-stack web applications</span> and
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

        {/* ── Right column ─────────────────────────────────────────────────
            The system, then the numbers. The graph is a fixed-size stage — see
            the note in `SystemGraph` on why it cannot be a scaling viewBox — so
            it is centred rather than stretched, and the stat row below it is
            what squares the column off at any width. */}
        {wideEnoughForColumn && (
          <div className="flex flex-1 flex-col items-center" style={{ maxWidth: 440 }}>
            <SystemGraph />

            <div className="mt-9 grid w-full grid-cols-3 gap-3">
              <Metric
                label="Projects"
                value={PROJECTS_SHIPPED}
                color="#34D399"
                delay={1.25}
                depth={16}
                px={px}
                py={py}
              />
              <Metric
                label="Internships"
                value={`${INTERNSHIPS_COMPLETED}+`}
                color="#38BDF8"
                delay={1.38}
                depth={-12}
                px={px}
                py={py}
              />
              <Metric
                label="Hackathons"
                value="3"
                color="#F59E0B"
                delay={1.51}
                depth={20}
                px={px}
                py={py}
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#about"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
        }}
        className="absolute bottom-7 left-1/2 flex flex-col items-center gap-2"
        style={{ translateX: "-50%", textDecoration: "none", color: "#2E4560" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        whileHover={{ color: "#38BDF8" }}
      >
        <span
          className="mono"
          style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase" }}
        >
          scroll
        </span>
        <span
          className="relative block overflow-hidden"
          style={{ width: 1, height: 40, background: "rgba(56,189,248,0.16)" }}
        >
          {/* CSS rather than a motion loop: a permanent animation on a 1px
              element has no business holding a slot on the frame loop. */}
          <span
            className="scroll-cue absolute inset-x-0"
            style={{ height: 14, background: "linear-gradient(180deg, transparent, #38BDF8)" }}
          />
        </span>
      </motion.a>
    </section>
  );
}
