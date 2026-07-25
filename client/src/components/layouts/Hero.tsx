import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import Navbar from "./Navbar";

// ─── Typing animation hook ───────────────────────────────────────────────────
function useTypingEffect(texts: string[], speed = 60, pause = 1800) {
  const [displayed, setDisplayed] = useState("");
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIdx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (charIdx < current.length) {
          setDisplayed(current.slice(0, charIdx + 1));
          setCharIdx((c) => c + 1);
        } else {
          setTimeout(() => setDeleting(true), pause);
        }
      } else {
        if (charIdx > 0) {
          setDisplayed(current.slice(0, charIdx - 1));
          setCharIdx((c) => c - 1);
        } else {
          setDeleting(false);
          setTextIdx((i) => (i + 1) % texts.length);
        }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, textIdx, texts, speed, pause]);

  return displayed;
}

// ─── Animated code block ─────────────────────────────────────────────────────
const codeLines = [
  { tokens: [{ t: "const ", c: "#7C3AED" }, { t: "developer", c: "#60A5FA" }, { t: " = {", c: "#E2E8F0" }] },
  { tokens: [{ t: "  stack", c: "#34D399" }, { t: ": [", c: "#E2E8F0" }, { t: '"TypeScript"', c: "#FCD34D" }, { t: ", ", c: "#E2E8F0" }, { t: '"Python"', c: "#FCD34D" }, { t: ", ", c: "#E2E8F0" }, { t: '"PostgreSQL"', c: "#FCD34D" }, { t: "],", c: "#E2E8F0" }] },
  { tokens: [{ t: "  builds", c: "#34D399" }, { t: ": ", c: "#E2E8F0" }, { t: '"full-stack marketplaces"', c: "#FCD34D" }, { t: ",", c: "#E2E8F0" }] },
  { tokens: [{ t: "  focus", c: "#34D399" }, { t: ": ", c: "#E2E8F0" }, { t: '"RAG + ML integration"', c: "#FCD34D" }, { t: ",", c: "#E2E8F0" }] },
  { tokens: [{ t: "  deploy", c: "#F87171" }, { t: ": async () => {", c: "#E2E8F0" }] },
  { tokens: [{ t: "    await ", c: "#7C3AED" }, { t: "ship(", c: "#60A5FA" }, { t: "production", c: "#FCD34D" }, { t: ");", c: "#E2E8F0" }] },
  { tokens: [{ t: "  }", c: "#E2E8F0" }] },
  { tokens: [{ t: "}", c: "#E2E8F0" }, { t: ";", c: "#94A3B8" }] },
];

function CodeEditor() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (visibleLines < codeLines.length) {
      const t = setTimeout(() => setVisibleLines((v) => v + 1), 220);
      return () => clearTimeout(t);
    }
  }, [visibleLines]);

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0D1117 0%, #161B22 100%)",
        border: "1px solid #30363D",
        boxShadow: "0 0 0 1px #30363D, 0 32px 64px -12px rgba(0,0,0,0.8), 0 0 80px rgba(96,165,250,0.08)",
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
      }}
    >
      {/* Window chrome */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: "1px solid #21262D", background: "#161B22" }}
      >
        <div className="w-3 h-3 rounded-full" style={{ background: "#FF5F57" }} />
        <div className="w-3 h-3 rounded-full" style={{ background: "#FFBD2E" }} />
        <div className="w-3 h-3 rounded-full" style={{ background: "#28C840" }} />
        <span className="ml-3 text-xs" style={{ color: "#6B7280", letterSpacing: "0.05em" }}>
          developer.ts
        </span>
        <div className="ml-auto flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#34D399" }} />
          <span className="text-xs" style={{ color: "#34D399" }}>compiling</span>
        </div>
      </div>

      {/* Code */}
      <div className="p-5 text-sm leading-7" style={{ minHeight: "220px" }}>
        {codeLines.slice(0, visibleLines).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center"
          >
            <span className="select-none mr-5 text-xs w-4 text-right" style={{ color: "#4B5563" }}>
              {i + 1}
            </span>
            <span>
              {line.tokens.map((tok, j) => (
                <span key={j} style={{ color: tok.c }}>{tok.t}</span>
              ))}
            </span>
            {i === visibleLines - 1 && (
              <span
                className="inline-block w-0.5 h-4 ml-0.5 animate-pulse"
                style={{ background: "#60A5FA", verticalAlign: "middle" }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Status bar */}
      <div
        className="flex items-center justify-between px-4 py-1.5 text-xs"
        style={{ background: "#1C2128", borderTop: "1px solid #21262D", color: "#6B7280" }}
      >
        <span>TypeScript 5.4</span>
        <span style={{ color: "#34D399" }}>✓ No errors</span>
        <span>UTF-8</span>
      </div>
    </div>
  );
}

// ─── Floating metric card ─────────────────────────────────────────────────────
function MetricCard({
  label, value, sub, color, delay, x, y
}: {
  label: string; value: string; sub: string; color: string; delay: number; x: number; y: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
        background: "rgba(13,17,23,0.85)",
        border: `1px solid ${color}33`,
        borderRadius: "12px",
        padding: "10px 14px",
        backdropFilter: "blur(16px)",
        boxShadow: `0 0 20px ${color}22, 0 8px 32px rgba(0,0,0,0.4)`,
        minWidth: "120px",
        zIndex: 10,
      }}
    >
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3 + delay, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="text-xs mb-1" style={{ color: "#6B7280", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "monospace" }}>
          {label}
        </div>
        <div className="text-xl font-bold" style={{ color, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.02em" }}>
          {value}
        </div>
        <div className="text-xs mt-0.5" style={{ color: "#4B5563" }}>{sub}</div>
      </motion.div>
    </motion.div>
  );
}

// ─── Particle field ──────────────────────────────────────────────────────────
function ParticleField() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.4 + 0.1,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.id % 3 === 0 ? "#60A5FA" : p.id % 3 === 1 ? "#34D399" : "#7C3AED",
            opacity: p.opacity,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [p.opacity, p.opacity * 0.3, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── Grid background ─────────────────────────────────────────────────────────
function GridBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg width="100%" height="100%" style={{ opacity: 0.06 }}>
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#60A5FA" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {/* Glowing focal point */}
      <div
        className="absolute"
        style={{
          right: "10%",
          top: "20%",
          width: "600px",
          height: "600px",
          background: "radial-gradient(ellipse at center, rgba(96,165,250,0.12) 0%, rgba(124,58,237,0.06) 40%, transparent 70%)",
          filter: "blur(1px)",
        }}
      />
      <div
        className="absolute"
        style={{
          left: "0%",
          bottom: "10%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(ellipse at center, rgba(52,211,153,0.08) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

// ─── 3D tilt card wrapper ─────────────────────────────────────────────────────
function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
    >
      {children}
    </motion.div>
  );
}

// ─── Main Hero ────────────────────────────────────────────────────────────────
export default function HeroSection(): JSX.Element {
  const typedRole = useTypingEffect(
    ["Full-Stack Developer", "MERN / PERN Engineer", "AI & RAG Integrator", "Backend Engineer"],
    65, 2000
  );

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <section
      className="relative min-h-screen w-full flex items-center overflow-hidden"
      style={{ backgroundColor: "#060A12", fontFamily: "'DM Sans', 'Sora', sans-serif" }}
      aria-label="Hero"
    >

      {/* Navbar overlay */}
    <Navbar />
    
      <GridBackground />
      <ParticleField />

      {/* Ambient light that follows cursor */}
      <div
        className="absolute pointer-events-none transition-all duration-700"
        style={{
          width: "800px",
          height: "800px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(96,165,250,0.07) 0%, transparent 70%)",
          left: `${mousePos.x * 100}%`,
          top: `${mousePos.y * 100}%`,
          transform: "translate(-50%, -50%)",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

        {/* ── LEFT: Text content ── */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left w-full">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full"
            style={{
              background: "rgba(96,165,250,0.08)",
              border: "1px solid rgba(96,165,250,0.2)",
              color: "#93C5FD",
              fontSize: "11px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full"
              style={{ background: "#34D399", boxShadow: "0 0 8px #34D399" }}
            />
            open to new roles
          </motion.div>

          {/* Name */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h1
              className="font-bold leading-none mb-3"
              style={{
                fontFamily: "'Sora', 'DM Sans', sans-serif",
                letterSpacing: "-0.04em",
                color: "#F1F5F9",
                fontSize: "clamp(2.5rem, 10vw, 4.5rem)",
              }}
            >
              Zohaib Ali
            </h1>
          </motion.div>

          {/* Typed role */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-6 h-10 flex items-center"
          >
            <span
              className="font-semibold"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: "#60A5FA",
                letterSpacing: "-0.02em",
                fontSize: "clamp(1.1rem, 4vw, 1.875rem)",
              }}
            >
              {typedRole}
              <span
                className="inline-block w-0.5 h-7 ml-1 align-middle animate-pulse"
                style={{ background: "#60A5FA" }}
              />
            </span>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mb-10 max-w-lg"
            style={{ color: "#64748B", lineHeight: 1.8, fontSize: "clamp(0.9rem, 2.5vw, 1.125rem)" }}
          >
            I build{" "}
            <span style={{ color: "#94A3B8" }}>scalable full-stack web applications</span> and
            ship AI-powered features , RAG chatbots, ML recommendations, real-time systems ,
            with clean architecture and a strong focus on user-centric design.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7, delay: 0.65 }}
  className="flex flex-col sm:flex-row gap-4 mb-12 w-full sm:w-auto"
>
  {/* View Projects */}
  <motion.a
    href="#projects"
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    className="relative px-8 py-4 rounded-xl font-semibold text-sm overflow-hidden"
    style={{
      background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
      color: "#fff",
      fontFamily: "'JetBrains Mono', monospace",
      letterSpacing: "0.02em",
      boxShadow: "0 0 30px rgba(37,99,235,0.35), 0 4px 24px rgba(0,0,0,0.4)",
      display: "inline-block",
    }}
  >
    <motion.span
      className="absolute inset-0"
      style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 100%)" }}
      initial={{ opacity: 0 }}
      whileHover={{ opacity: 1 }}
    />
    <span className="relative">View Projects →</span>
  </motion.a>

  {/* Download CV */}
  <motion.a
    href="/resume/Zohaib_Full_Stack_Developer_Resume.pdf"
    download
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    className="px-8 py-4 rounded-xl font-semibold text-sm"
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.1)",
      color: "#94A3B8",
      fontFamily: "'JetBrains Mono', monospace",
      letterSpacing: "0.02em",
      backdropFilter: "blur(8px)",
      display: "inline-block",
    }}
  >
    Download Resume
  </motion.a>
</motion.div>
          {/* Social / tech stack pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85 }}
            className="flex flex-wrap gap-2 justify-center lg:justify-start"
          >
            {["React.js", "TypeScript", "Node.js", "Express.js", "FastAPI", "MongoDB"].map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + i * 0.07, type: "spring", stiffness: 300 }}
                whileHover={{ scale: 1.08, y: -1 }}
                className="px-3 py-1 rounded-full text-xs cursor-default"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#64748B",
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: "0.04em",
                }}
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* ── RIGHT: Code editor + floating cards — hidden below lg ── */}
        <motion.div
          className="flex-1 relative hidden lg:block"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ minHeight: "420px", overflow: "visible" }}
        >
          {/* Floating metric cards — repositioned to stay within visible bounds */}
          <MetricCard label="Projects Shipped" value="6+" sub="full-stack builds" color="#34D399" delay={1.2} x={5} y={15} />
          <MetricCard label="Internships" value="2+" sub="Full Stack + Frontend" color="#60A5FA" delay={1.4} x={88} y={10} />
          <MetricCard label="Service Categories" value="9" sub="HelpGhar platform" color="#F59E0B" delay={1.6} x={88} y={82} />

          {/* Main code editor with 3D tilt */}
          <TiltCard>
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
              <CodeEditor />
            </motion.div>
          </TiltCard>

          {/* Terminal snippet below */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="mt-4 rounded-lg px-4 py-3 flex items-center gap-3"
            style={{
              background: "rgba(13,17,23,0.7)",
              border: "1px solid #21262D",
              backdropFilter: "blur(8px)",
            }}
          >
            <span style={{ color: "#34D399", fontFamily: "monospace", fontSize: "13px" }}>❯</span>
            <span style={{ color: "#64748B", fontFamily: "monospace", fontSize: "13px" }}>
              git log --oneline{" "}
              <span style={{ color: "#94A3B8" }}>|</span>{" "}
              <span style={{ color: "#60A5FA" }}>wc -l</span>
            </span>
            <span
              className="ml-auto"
              style={{ color: "#34D399", fontFamily: "monospace", fontSize: "13px" }}
            >
              842
            </span>
          </motion.div>

          {/* Decorative glow behind editor */}
          <div
            className="absolute pointer-events-none"
            style={{
              inset: "-40px",
              background: "radial-gradient(ellipse at 50% 50%, rgba(37,99,235,0.12) 0%, rgba(124,58,237,0.06) 50%, transparent 70%)",
              zIndex: -1,
              filter: "blur(20px)",
            }}
          />
        </motion.div>
      </div>

      {/* Bottom separator */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent 0%, #1E3A5F 30%, #2563EB55 50%, #1E3A5F 70%, transparent 100%)" }}
      />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ color: "#334155" }}
      >
        <span className="text-xs" style={{ fontFamily: "monospace", letterSpacing: "0.1em" }}>scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-8"
          style={{ background: "linear-gradient(to bottom, #2563EB55, transparent)" }}
        />
      </motion.div>
    </section>
  );
}