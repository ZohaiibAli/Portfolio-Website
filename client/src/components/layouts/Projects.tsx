import { motion, useMotionValue, useSpring, useTransform, useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import React from "react";

function GridBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg width="100%" height="100%" style={{ opacity: 0.05 }}>
        <defs>
          <pattern id="projects-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#10B981" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#projects-grid)" />
      </svg>
      <div style={{
        position: "absolute", left: "50%", top: "40%",
        transform: "translate(-50%, -50%)", width: "900px", height: "900px",
        background: "radial-gradient(ellipse at center, rgba(16,185,129,0.07) 0%, rgba(6,182,212,0.04) 40%, transparent 70%)",
        filter: "blur(2px)",
      }} />
      <div style={{
        position: "absolute", right: "6%", top: "10%",
        width: "340px", height: "340px",
        background: "radial-gradient(ellipse at center, rgba(6,182,212,0.06) 0%, transparent 70%)",
      }} />
      <div style={{
        position: "absolute", left: "2%", bottom: "10%",
        width: "400px", height: "400px",
        background: "radial-gradient(ellipse at center, rgba(16,185,129,0.05) 0%, transparent 70%)",
      }} />
    </div>
  );
}

function ParticleField() {
  const particles = Array.from({ length: 35 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.35 + 0.08,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div key={p.id} className="absolute rounded-full"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            background: p.id % 4 === 0 ? "#10B981" : p.id % 4 === 1 ? "#06B6D4" : p.id % 4 === 2 ? "#F59E0B" : "#818CF8",
            opacity: p.opacity,
          }}
          animate={{ y: [-20, 20, -20], x: [-10, 10, -10], opacity: [p.opacity, p.opacity * 0.3, p.opacity] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ✅ CONFIGURE YOUR PROJECTS HERE
// Order matches the resume: HelpGhar -> AI Dataset Cleaner -> ServiceHub
// Each project can have: liveDemo (optional), github (optional), or both
const projects: Project[] = [
  {
    name: "HelpGhar",
    subtitle: "Home Services Marketplace Platform",
    description: "Full-stack home services marketplace connecting customers with verified workers, featuring a RAG-powered chatbot for user queries and ML-driven gig ranking with personalized worker recommendations.",
    gradient: "linear-gradient(135deg, #091a07 0%, #0d2a0a 40%, #123510 100%)",
    accent: "#4ADE80",
    accentGlow: "rgba(74,222,128,0.25)",
    tags: ["React.js", "TypeScript", "RAG Chatbot", "ML Recommendations"],
    icon: "⬟",
    liveDemo: "https://help-ghar-beta.vercel.app/",
    github: null,
  },
  {
    name: "AI Dataset Cleaner",
    subtitle: "Data Preprocessing & Analysis Tool",
    description: "Streamlit-based web application to streamline dataset cleaning and analysis, handling missing values, duplicates, outliers, and inconsistencies with automated multi-strategy imputation and a recommendation engine.",
    gradient: "linear-gradient(135deg, #1a1207 0%, #281a0a 40%, #40260d 100%)",
    accent: "#F59E0B",
    accentGlow: "rgba(245,158,11,0.28)",
    tags: ["Streamlit", "Python", "Pandas", "Data Cleaning"],
    icon: "◆",
    liveDemo: null, // TODO: add your AI Dataset Cleaner live demo URL here
    github: null,
  },
  {
    name: "ServiceHub",
    subtitle: "Role-Based & Real-Time System",
    description: "Full-stack service marketplace connecting seekers and providers with secure three-role auth (Admin, Seeker, Provider), real-time WebSocket chat, and H3 geospatial indexing for radius-based discovery.",
    gradient: "linear-gradient(135deg, #071a12 0%, #0a2018 40%, #0d2d22 100%)",
    accent: "#10B981",
    accentGlow: "rgba(16,185,129,0.28)",
    tags: ["React.js", "Node.js", "Express.js", "PostgreSQL", "WebSockets", "H3"],
    icon: "⬡",
    liveDemo: "https://frontend-pro-battle26-stage3.vercel.app/login",
    github: null, // No github link for this one
  },
];

interface LinkButtonProps {
  href?: string;
  label: string;
  isPrimary: boolean;
  accent: string;
  accentGlow: string;
  hovered: boolean;
}

function LinkButton({
  href,
  label,
  isPrimary,
  accent,
  accentGlow,
  hovered,
}: LinkButtonProps) {
  if (!href) return null;
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      animate={{ y: hovered ? 0 : 16, opacity: hovered ? 1 : 0 }}
      transition={{ duration: 0.25, delay: isPrimary ? 0.04 : 0.1 }}
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "12px",
        fontWeight: 600,
        color: isPrimary ? "#fff" : "#94A3B8",
        background: isPrimary
          ? `linear-gradient(135deg, ${accent} 0%, ${accent}cc 100%)`
          : "rgba(255,255,255,0.06)",
        border: isPrimary ? "none" : "1px solid rgba(255,255,255,0.12)",
        padding: "9px 18px",
        borderRadius: "9px",
        textDecoration: "none",
        letterSpacing: "0.04em",
        backdropFilter: "blur(8px)",
        display: "inline-block",
        whiteSpace: "nowrap",
        boxShadow: isPrimary ? `0 0 20px ${accentGlow}` : "none",
      }}
    >
      {label}
    </motion.a>
  );
}

interface Project {
  name: string;
  subtitle: string;
  description: string;
  gradient: string;
  accent: string;
  accentGlow: string;
  tags: string[];
  icon: string;
  liveDemo?: string | null;
  github?: string | null;
}

interface ProjectCardProps {
  project: Project;
  index: number;
  inView: boolean;
}

function ProjectCard({ project, index, inView }: ProjectCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 200, damping: 22 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), { stiffness: 200, damping: 22 });

  const handleMouseMove = useCallback(
  (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  },
  [mx, my]
);

  const handleMouseLeave = useCallback(() => {
    mx.set(0); my.set(0); setHovered(false);
  }, [mx, my]);

  const hasLinks = Boolean(project.liveDemo || project.github);

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX, rotateY,
          transformStyle: "preserve-3d",
          perspective: 900,
        }}
        animate={{ y: [0, -5, 0] }}
        transition={{
          y: { duration: 4.5 + index * 0.4, repeat: Infinity, ease: "easeInOut", delay: index * 0.25 }
        }}
      >
        <div style={{
          background: "rgba(10,14,20,0.88)",
          border: hovered ? `1px solid ${project.accent}50` : "1px solid rgba(255,255,255,0.07)",
          borderRadius: "18px",
          overflow: "hidden",
          backdropFilter: "blur(20px)",
          boxShadow: hovered
            ? `0 0 40px ${project.accentGlow}, 0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)`
            : "0 4px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)",
          transition: "border 0.25s ease, box-shadow 0.25s ease",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}>

          {/* Card Header Visual */}
          <div style={{
            position: "relative", height: "160px",
            background: project.gradient, overflow: "hidden", flexShrink: 0,
          }}>
            <motion.div
              animate={{ scale: hovered ? 1.06 : 1 }}
              transition={{ duration: 0.4 }}
              style={{ position: "absolute", inset: 0, background: project.gradient }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: `radial-gradient(ellipse at 30% 40%, ${project.accentGlow} 0%, transparent 65%)`,
              opacity: 0.8,
            }} />
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(255,255,255,0.012) 28px, rgba(255,255,255,0.012) 29px), repeating-linear-gradient(90deg, transparent, transparent 28px, rgba(255,255,255,0.012) 28px, rgba(255,255,255,0.012) 29px)`,
            }} />

            {/* Icon */}
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "48px", color: project.accent,
              opacity: hovered ? 0.12 : 0.22,
              transition: "opacity 0.25s ease",
              fontFamily: "monospace", userSelect: "none",
              filter: `drop-shadow(0 0 18px ${project.accent})`,
            }}>
              {project.icon}
            </div>

            {/* Primary tag badge */}
            <div style={{ position: "absolute", bottom: "12px", left: "14px" }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "9.5px", color: project.accent,
                letterSpacing: "0.1em", textTransform: "uppercase",
                background: `${project.accentGlow}`,
                border: `1px solid ${project.accent}44`,
                borderRadius: "6px", padding: "3px 8px",
                backdropFilter: "blur(8px)",
              }}>
                {project.tags[0]}
              </span>
            </div>

            {/* Hover overlay with links */}
            {hasLinks && (
              <motion.div
                animate={{ opacity: hovered ? 1 : 0 }}
                transition={{ duration: 0.22 }}
                style={{
                  position: "absolute", inset: 0,
                  background: "rgba(4,8,16,0.8)",
                  backdropFilter: "blur(5px)",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "10px",
                }}
              >
                <LinkButton
                  href={project.liveDemo ?? undefined}
                  label="Live Demo →"
                  isPrimary={true}
                  accent={project.accent}
                  accentGlow={project.accentGlow}
                  hovered={hovered}
                />
                <LinkButton
                  href={project.github ?? undefined}
                  label="GitHub"
                  isPrimary={false}
                  accent={project.accent}
                  accentGlow={project.accentGlow}
                  hovered={hovered}
                />
              </motion.div>
            )}

            {/* No links indicator */}
            {!hasLinks && (
              <motion.div
                animate={{ opacity: hovered ? 1 : 0 }}
                transition={{ duration: 0.22 }}
                style={{
                  position: "absolute", inset: 0,
                  background: "rgba(4,8,16,0.7)",
                  backdropFilter: "blur(5px)",
                  display: "flex", alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <motion.span
                  animate={{ y: hovered ? 0 : 10, opacity: hovered ? 1 : 0 }}
                  transition={{ duration: 0.25, delay: 0.05 }}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "11px", color: "#64748B",
                    letterSpacing: "0.08em",
                  }}
                >
                  Coming Soon
                </motion.span>
              </motion.div>
            )}
          </div>

          {/* Card Body */}
          <div style={{ padding: "18px 20px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: "4px" }}>
              <h3 style={{
                fontFamily: "'Sora', 'DM Sans', sans-serif",
                fontSize: "15.5px", fontWeight: 700,
                color: hovered ? project.accent : "#F1F5F9",
                letterSpacing: "-0.03em", marginBottom: "2px",
                transition: "color 0.25s ease",
              }}>
                {project.name}
              </h3>
              <p style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px", color: `${project.accent}99`,
                letterSpacing: "0.06em", textTransform: "uppercase",
              }}>
                {project.subtitle}
              </p>
            </div>

            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12.5px", color: "#4E6080",
              lineHeight: 1.75, marginBottom: "14px", marginTop: "10px",
              flex: 1,
            }}>
              {project.description}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "12px" }}>
              {project.tags.map((tag, i) => (
                <span key={tag} style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px", color: "#4E6080",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "5px", padding: "2.5px 8px",
                  letterSpacing: "0.03em",
                }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Inline link badges at bottom */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {project.liveDemo && (
                <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px", color: project.accent,
                  display: "inline-flex", alignItems: "center", gap: "4px",
                  textDecoration: "none", letterSpacing: "0.04em",
                  opacity: 0.7, transition: "opacity 0.2s",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = "0.7"}
                >
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: project.accent, display: "inline-block" }} />
                  Live
                </a>
              )}
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px", color: "#64748B",
                  display: "inline-flex", alignItems: "center", gap: "4px",
                  textDecoration: "none", letterSpacing: "0.04em",
                  opacity: 0.7, transition: "opacity 0.2s",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = "0.7"}
                >
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#64748B", display: "inline-block" }} />
                  GitHub
                </a>
              )}
              {!project.liveDemo && !project.github && (
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px", color: "#2a3a4a",
                  letterSpacing: "0.04em",
                }}>
                  Private / In Progress
                </span>
              )}
            </div>
          </div>

          {/* Bottom accent bar */}
          <div style={{
            height: "2px",
            background: hovered
              ? `linear-gradient(90deg, transparent, ${project.accent}, transparent)`
              : "transparent",
            transition: "background 0.3s ease",
            flexShrink: 0,
          }} />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const sectionRef = useRef(null);
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
        backgroundColor: "#060A10",
        fontFamily: "'DM Sans', 'Sora', sans-serif",
        paddingTop: "100px",
        paddingBottom: "110px",
      }}
      aria-label="Projects"
    >
      <GridBackground />
      <ParticleField />

      {/* Mouse follow glow */}
      <div
        className="absolute pointer-events-none transition-all duration-700"
        style={{
          width: "700px", height: "700px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16,185,129,0.055) 0%, transparent 70%)",
          left: `${mousePos.x * 100}%`, top: `${mousePos.y * 100}%`,
          transform: "translate(-50%, -50%)", zIndex: 0,
        }}
      />

      <div
        className="relative z-10 w-full max-w-7xl mx-auto"
        style={{ paddingLeft: "clamp(1.5rem, 5vw, 4rem)", paddingRight: "clamp(1.5rem, 5vw, 4rem)" }}
      >
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col items-center text-center mb-16"
        >
          <div
            className="mb-6 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full"
            style={{
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.2)",
              color: "#6EE7B7",
              fontSize: "10.5px", letterSpacing: "0.13em",
              textTransform: "uppercase",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full"
              style={{ background: "#10B981", boxShadow: "0 0 8px #10B981" }}
            />
            projects
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              fontWeight: 700, color: "#F1F5F9",
              letterSpacing: "-0.04em", lineHeight: 1.1,
              marginBottom: "16px",
            }}
          >
            Selected{" "}
            <span style={{
              background: "linear-gradient(135deg, #10B981 0%, #06B6D4 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Work
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.65, delay: 0.2 }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(0.88rem, 2vw, 1rem)",
              color: "#4E6080", lineHeight: 1.8, maxWidth: "520px",
            }}
          >
            Real-world systems built for{" "}
            <span style={{ color: "#94A3B8" }}>scale, reliability, and real users</span> — from
            geospatial marketplaces to fintech UIs and wildlife platforms.
          </motion.p>
        </motion.div>

        {/* Projects Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 310px), 1fr))",
          gap: "20px",
          alignItems: "start",
        }}>
          {projects.map((project, i) => (
            <ProjectCard key={project.name} project={project} index={i} inView={inView} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.85, duration: 0.5 }}
          className="flex justify-center mt-14"
        >
          <motion.a
            href="https://github.com/githubzohaib"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12.5px", fontWeight: 600,
              color: "#94A3B8",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              padding: "12px 28px", borderRadius: "12px",
              textDecoration: "none", letterSpacing: "0.04em",
              backdropFilter: "blur(10px)",
              transition: "border-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(16,185,129,0.4)";
              e.currentTarget.style.color = "#E2E8F0";
              e.currentTarget.style.boxShadow = "0 0 24px rgba(16,185,129,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.color = "#94A3B8";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <span>View all projects on GitHub</span>
            <span style={{ color: "#10B981" }}>→</span>
          </motion.a>
        </motion.div>
      </div>

      {/* Top/bottom dividers */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{
        background: "linear-gradient(90deg, transparent 0%, #0d3d2a 30%, #10B98155 50%, #0d3d2a 70%, transparent 100%)",
      }} />
      <div className="absolute top-0 left-0 right-0 h-px" style={{
        background: "linear-gradient(90deg, transparent 0%, #0d3d2a 30%, #10B98155 50%, #0d3d2a 70%, transparent 100%)",
      }} />
    </section>
  );
}