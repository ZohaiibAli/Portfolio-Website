import { motion, useMotionValue, useSpring, useTransform, useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";

function GridBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg width="100%" height="100%" style={{ opacity: 0.06 }}>
        <defs>
          <pattern id="skills-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#60A5FA" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#skills-grid)" />
      </svg>
      <div
        className="absolute"
        style={{
          left: "50%",
          top: "30%",
          transform: "translate(-50%, -50%)",
          width: "700px",
          height: "700px",
          background: "radial-gradient(ellipse at center, rgba(37,99,235,0.1) 0%, rgba(124,58,237,0.05) 40%, transparent 70%)",
          filter: "blur(2px)",
        }}
      />
      <div
        className="absolute"
        style={{
          right: "5%",
          bottom: "10%",
          width: "350px",
          height: "350px",
          background: "radial-gradient(ellipse at center, rgba(52,211,153,0.07) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute"
        style={{
          left: "5%",
          top: "15%",
          width: "300px",
          height: "300px",
          background: "radial-gradient(ellipse at center, rgba(124,58,237,0.07) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

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

// ✅ Matches the "Technical Skills" section of the resume
const skills = [
  // Programming Languages
  {
    name: "JavaScript",
    description: "Core language for dynamic, interactive web applications",
    icon: "JS",
    color: "#F59E0B",
    glow: "rgba(245,158,11,0.25)",
  },
  {
    name: "TypeScript",
    description: "Strict typing, generics & compiler-driven correctness at scale",
    icon: "TS",
    color: "#3B82F6",
    glow: "rgba(59,130,246,0.25)",
  },
  {
    name: "Python",
    description: "Backend services, data preprocessing & ML pipelines",
    icon: "Py",
    color: "#FBBF24",
    glow: "rgba(251,191,36,0.25)",
  },
  // Frontend
  {
    name: "React.js",
    description: "Declarative UI architecture with hooks, context & concurrent mode",
    icon: "Re",
    color: "#22D3EE",
    glow: "rgba(34,211,238,0.25)",
  },
  {
    name: "Tailwind CSS",
    description: "Utility-first styling for fast, consistent, responsive UI",
    icon: "Tw",
    color: "#38BDF8",
    glow: "rgba(56,189,248,0.25)",
  },
  // Backend
  {
    name: "Node.js",
    description: "Event-driven server runtime powering high-throughput APIs",
    icon: "No",
    color: "#34D399",
    glow: "rgba(52,211,153,0.25)",
  },
  {
    name: "Express.js",
    description: "Minimal, unopinionated framework for RESTful Node.js APIs",
    icon: "Ex",
    color: "#3444d3",
    glow: "rgba(52, 113, 211, 0.25)",
  },
  {
    name: "FastAPI",
    description: "High-performance Python APIs with async support & auto docs",
    icon: "Fa",
    color: "#10B981",
    glow: "rgba(16,185,129,0.25)",
  },
  // Databases
  {
    name: "MongoDB",
    description: "Document-oriented database with horizontal scaling and flexible schema",
    icon: "MG",
    color: "#81f89f",
    glow: "rgba(61, 122, 42, 0.25)",
  },
  {
    name: "PostgreSQL",
    description: "Relational database with strong consistency & geospatial support",
    icon: "Pg",
    color: "#818CF8",
    glow: "rgba(129,140,248,0.25)",
  },
  // AI/ML
  {
    name: "Machine Learning",
    description: "Model training & inference with scikit-learn for real-world data",
    icon: "ML",
    color: "#F472B6",
    glow: "rgba(244,114,182,0.25)",
  },
  {
    name: "RAG Pipelines",
    description: "Retrieval-augmented generation with vector embeddings & semantic search",
    icon: "RAG",
    color: "#A78BFA",
    glow: "rgba(167,139,250,0.25)",
  },
];

function SkillCard({
  skill,
  index,
  inView,
}: {
  skill: (typeof skills)[0];
  index: number;
  inView: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 200, damping: 20 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      mx.set((e.clientX - rect.left) / rect.width - 0.5);
      my.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [mx, my]
  );

  const handleMouseLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
    setHovered(false);
  }, [mx, my]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          perspective: 800,
        }}
        animate={{ y: [0, -5, 0] }}
        transition={{
          y: {
            duration: 4 + index * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.15,
          },
        }}
      >
        <div
          style={{
            background: hovered
              ? "rgba(255,255,255,0.055)"
              : "rgba(255,255,255,0.025)",
            border: hovered
              ? `1px solid ${skill.color}66`
              : "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px",
            backdropFilter: "blur(16px)",
            padding: "24px",
            boxShadow: hovered
              ? `0 0 32px ${skill.glow}, 0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)`
              : "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
            transition: "background 0.3s ease, border 0.3s ease, box-shadow 0.3s ease",
            cursor: "default",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {hovered && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(ellipse at 50% 0%, ${skill.glow} 0%, transparent 65%)`,
                pointerEvents: "none",
              }}
            />
          )}

          <div className="flex items-start gap-4 relative">
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: `linear-gradient(135deg, ${skill.color}22 0%, ${skill.color}11 100%)`,
                border: `1px solid ${skill.color}33`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: hovered ? `0 0 16px ${skill.glow}` : "none",
                transition: "box-shadow 0.3s ease",
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: skill.color,
                  letterSpacing: "0.04em",
                }}
              >
                {skill.icon}
              </span>
            </div>

            <div className="flex flex-col gap-1 min-w-0">
              <span
                style={{
                  fontFamily: "'Sora', 'DM Sans', sans-serif",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: hovered ? "#22D3EE" : "#F1F5F9",
                  letterSpacing: "-0.02em",
                  transition: "color 0.25s ease",
                }}
              >
                {skill.name}
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12.5px",
                  color: "#64748B",
                  lineHeight: 1.6,
                }}
              >
                {skill.description}
              </span>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "2px",
              background: hovered
                ? `linear-gradient(90deg, transparent, ${skill.color}, transparent)`
                : "transparent",
              transition: "background 0.3s ease",
              borderRadius: "0 0 16px 16px",
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function SkillsSection(): JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
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
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: "#060A12",
        fontFamily: "'DM Sans', 'Sora', sans-serif",
        paddingTop: "100px",
        paddingBottom: "100px",
      }}
      aria-label="Skills"
    >
      <GridBackground />
      <ParticleField />

      <div
        className="absolute pointer-events-none transition-all duration-700"
        style={{
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(96,165,250,0.06) 0%, transparent 70%)",
          left: `${mousePos.x * 100}%`,
          top: `${mousePos.y * 100}%`,
          transform: "translate(-50%, -50%)",
          zIndex: 0,
        }}
      />

      <div
        className="relative z-10 w-full max-w-7xl mx-auto"
        style={{ paddingLeft: "clamp(1.5rem, 5vw, 4rem)", paddingRight: "clamp(1.5rem, 5vw, 4rem)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col items-center text-center mb-16"
        >
          <div
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
            what I work with
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              fontFamily: "'Sora', 'DM Sans', sans-serif",
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              fontWeight: 700,
              color: "#F1F5F9",
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              marginBottom: "16px",
            }}
          >
            Technical{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #2563EB 0%, #22D3EE 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Expertise
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.65, delay: 0.2 }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(0.9rem, 2vw, 1.05rem)",
              color: "#64748B",
              lineHeight: 1.8,
              maxWidth: "520px",
            }}
          >
            A curated toolkit honed across production systems — from browser to bare metal,
            each chosen for{" "}
            <span style={{ color: "#94A3B8" }}>performance, reliability, and developer experience</span>.
          </motion.p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
            gap: "16px",
          }}
        >
          {skills.map((skill, i) => (
            <SkillCard key={skill.name} skill={skill} index={i} inView={inView} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-wrap gap-2 justify-center mt-14"
        >
          {["RESTful APIs", "WebSockets", "Git & GitHub", "Agile Development"].map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
              transition={{ delay: 1.0 + i * 0.06, type: "spring", stiffness: 300 }}
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
              {tag}
            </motion.span>
          ))}
        </motion.div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #1E3A5F 30%, #2563EB55 50%, #1E3A5F 70%, transparent 100%)",
        }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #1E3A5F 30%, #2563EB55 50%, #1E3A5F 70%, transparent 100%)",
        }}
      />
    </section>
  );
}