import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useCallback, useEffect, useState } from "react";

// ─── Particle field (exact copy from Hero) ────────────────────────────────────
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

// ─── Grid background (exact copy from Hero) ──────────────────────────────────
function GridBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg width="100%" height="100%" style={{ opacity: 0.06 }}>
        <defs>
          <pattern id="about-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#60A5FA" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#about-grid)" />
      </svg>
      <div
        className="absolute"
        style={{
          right: "10%",
          top: "20%",
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(ellipse at center, rgba(96,165,250,0.12) 0%, rgba(124,58,237,0.06) 40%, transparent 70%)",
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

// ─── 3D tilt wrapper (exact copy from Hero) ───────────────────────────────────
function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      x.set((e.clientX - rect.left) / rect.width - 0.5);
      y.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [x, y]
  );
  const handleMouseLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

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

// ─── Main About section ───────────────────────────────────────────────────────
export default function AboutMe(): JSX.Element {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  // Cursor-following ambient light — exact same as Hero
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <section
      ref={ref}
      aria-label="About Me"
      className="relative w-full py-28 sm:py-36 overflow-hidden"
      style={{ backgroundColor: "#060A12", fontFamily: "'DM Sans', 'Sora', sans-serif" }}
    >
      <GridBackground />
      <ParticleField />

      {/* Cursor-following ambient glow — exact Hero behaviour */}
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

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-16"
        >
          <div
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full"
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
            about.me
          </div>
        </motion.div>

        {/* Main 2-col layout */}
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

          {/* ── LEFT: Photo ── */}
          <motion.div
            className="flex-1 flex justify-center lg:justify-start order-1"
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <TiltCard>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
                style={{ width: "340px" }}
              >
                {/* Ambient glow behind photo */}
                <div
                  className="absolute -inset-6 rounded-3xl opacity-25"
                  style={{
                    background:
                      "radial-gradient(ellipse, #2563EB 0%, #7C3AED 50%, transparent 70%)",
                    filter: "blur(28px)",
                  }}
                />

                {/* Photo frame */}
                <div
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    border: "1px solid rgba(96,165,250,0.15)",
                    boxShadow:
                      "0 0 0 1px rgba(96,165,250,0.06), 0 32px 64px -12px rgba(0,0,0,0.8)",
                    aspectRatio: "4/5",
                  }}
                >
                  <img
                    src="/images/Pic.png"
                    alt="Zohaib Ali — Full Stack Developer"
                    className="w-full h-full object-cover"
                    style={{ filter: "brightness(0.92) saturate(1.05)" }}
                  />

                  {/* Bottom gradient */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(6,10,18,0.80) 0%, transparent 45%)",
                    }}
                  />

                  {/* Availability badge */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg"
                      style={{
                        background: "rgba(6,10,18,0.75)",
                        border: "1px solid rgba(96,165,250,0.15)",
                        backdropFilter: "blur(12px)",
                      }}
                    >
                      <motion.span
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "#34D399", boxShadow: "0 0 6px #34D399" }}
                      />
                      <span
                        className="text-xs"
                        style={{
                          color: "#93C5FD",
                          fontFamily: "'JetBrains Mono', monospace",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Open to opportunities
                      </span>
                    </div>
                  </div>
                </div>

                {/* Top-right floating chip */}
                <motion.div
                  animate={{ y: [0, -5, 0], rotate: [0, 2, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -top-4 -right-4 px-3 py-2 rounded-xl flex items-center gap-2"
                  style={{
                    background: "rgba(13,17,23,0.85)",
                    border: "1px solid rgba(52,211,153,0.25)",
                    backdropFilter: "blur(16px)",
                    boxShadow: "0 0 20px rgba(52,211,153,0.10), 0 8px 32px rgba(0,0,0,0.4)",
                  }}
                >
                  <span className="text-base">⚡</span>
                  <div>
                    <div
                      className="text-xs font-bold leading-none mb-0.5"
                      style={{ color: "#34D399", fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      NED University
                    </div>
                    <div
                      className="text-xs leading-none"
                      style={{ color: "#4B5563", fontFamily: "monospace" }}
                    >
                      software engineering
                    </div>
                  </div>
                </motion.div>

                {/* Bottom-left floating chip */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  className="absolute -bottom-4 -left-4 px-3 py-2 rounded-xl flex items-center gap-2"
                  style={{
                    background: "rgba(13,17,23,0.85)",
                    border: "1px solid rgba(96,165,250,0.2)",
                    backdropFilter: "blur(16px)",
                    boxShadow: "0 0 20px rgba(96,165,250,0.08), 0 8px 32px rgba(0,0,0,0.4)",
                  }}
                >
                  <span className="text-base">🚀</span>
                  <div>
                    <div
                      className="text-xs font-bold leading-none mb-0.5"
                      style={{ color: "#60A5FA", fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      6+ shipped
                    </div>
                    <div
                      className="text-xs leading-none"
                      style={{ color: "#4B5563", fontFamily: "monospace" }}
                    >
                      projects
                    </div>
                  </div>
                </motion.div>

                {/* Decorative glow behind photo — mirrors Hero editor glow */}
                <div
                  className="absolute pointer-events-none"
                  style={{
                    inset: "-40px",
                    background:
                      "radial-gradient(ellipse at 50% 50%, rgba(37,99,235,0.12) 0%, rgba(124,58,237,0.06) 50%, transparent 70%)",
                    zIndex: -1,
                    filter: "blur(20px)",
                  }}
                />
              </motion.div>
            </TiltCard>
          </motion.div>

          {/* ── RIGHT: Text content ── */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left order-2 gap-7">

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold"
              style={{
                fontFamily: "'Sora', 'DM Sans', sans-serif",
                color: "#F1F5F9",
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
              }}
            >
              Crafting systems that{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #60A5FA, #7C3AED)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                scale and last.
              </span>
            </motion.h2>

            {/* Short bio */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-base sm:text-lg max-w-lg"
              style={{ color: "#64748B", lineHeight: 1.8 }}
            >
              Full Stack Developer specializing in{" "}
              <span style={{ color: "#94A3B8" }}>scalable web applications</span> and{" "}
              <span style={{ color: "#94A3B8" }}>RAG/ML-powered features</span>. I turn
              complex problems into simple, reliable, user-centric solutions.
            </motion.p>

            {/* Tech stack pills — same style as Hero */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-2 justify-center lg:justify-start"
            >
              {["React.js", "TypeScript", "Node.js", "Express.js", "FastAPI", "MongoDB"].map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.55 + i * 0.07, type: "spring", stiffness: 300 }}
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

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex gap-10 justify-center lg:justify-start"
            >
              {[
                { value: "2+", label: "Internships", color: "#60A5FA" },
                { value: "6+", label: "Projects", color: "#34D399" },
                { value: "3+", label: "Tech Stacks", color: "#A78BFA" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center lg:items-start gap-0.5">
                  <span
                    className="text-3xl font-bold"
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      color: stat.color,
                      letterSpacing: "-0.04em",
                      textShadow: `0 0 20px ${stat.color}44`,
                    }}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="text-xs uppercase tracking-widest"
                    style={{ color: "#475569", fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom separator — exact Hero style */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #1E3A5F 30%, #2563EB55 50%, #1E3A5F 70%, transparent 100%)",
        }}
      />
    </section>
  );
}