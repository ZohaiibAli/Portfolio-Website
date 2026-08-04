import { motion, useReducedMotion } from "framer-motion";
import Section from "@/components/fx/Section";
import SectionHeading from "@/components/fx/SectionHeading";
import SpotlightCard from "@/components/fx/SpotlightCard";
import Reveal from "@/components/fx/Reveal";
import Tag from "@/components/ui/Tag";
import { EASE_OUT, VIEWPORT, alpha, stagger } from "@/lib/motion";

interface Skill {
  name: string;
  description: string;
  icon: string;
  color: string;
  /** Rough proficiency, drives the meter under each card. */
  level: number;
}

// Mirrors the "Technical Skills" section of the resume.
const SKILLS: Skill[] = [
  { name: "JavaScript", description: "Core language for dynamic, interactive web applications", icon: "JS", color: "#F59E0B", level: 92 },
  { name: "TypeScript", description: "Strict typing, generics & compiler-driven correctness at scale", icon: "TS", color: "#3B82F6", level: 88 },
  { name: "Python", description: "Backend services, data preprocessing & ML pipelines", icon: "Py", color: "#FBBF24", level: 82 },
  { name: "React.js", description: "Declarative UI architecture with hooks, context & concurrent mode", icon: "Re", color: "#22D3EE", level: 93 },
  { name: "Tailwind CSS", description: "Utility-first styling for fast, consistent, responsive UI", icon: "Tw", color: "#38BDF8", level: 90 },
  { name: "Node.js", description: "Event-driven server runtime powering high-throughput APIs", icon: "No", color: "#34D399", level: 87 },
  { name: "Express.js", description: "Minimal, unopinionated framework for RESTful Node.js APIs", icon: "Ex", color: "#818CF8", level: 88 },
  { name: "FastAPI", description: "High-performance Python APIs with async support & auto docs", icon: "Fa", color: "#10B981", level: 78 },
  { name: "MongoDB", description: "Document database with horizontal scaling and flexible schema", icon: "MG", color: "#4ADE80", level: 85 },
  { name: "PostgreSQL", description: "Relational database with strong consistency & geospatial support", icon: "Pg", color: "#A78BFA", level: 80 },
  { name: "Machine Learning", description: "Model training & inference with scikit-learn for real-world data", icon: "ML", color: "#F472B6", level: 72 },
  { name: "RAG Pipelines", description: "Retrieval-augmented generation with embeddings & semantic search", icon: "RAG", color: "#C084FC", level: 76 },
];

const EXTRAS = ["RESTful APIs", "WebSockets", "Git & GitHub", "Agile Development", "H3 Geospatial", "JWT Auth"];

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 38, rotateX: -14, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.65, delay: (index % 3) * 0.08, ease: EASE_OUT }}
      whileHover={reduced ? undefined : { y: -6 }}
      style={{ perspective: 900 }}
    >
      <SpotlightCard accent={skill.color} style={{ height: "100%", padding: 22 }}>
        <div className="flex items-start gap-4">
          <motion.span
            className="mono grid flex-shrink-0 place-items-center"
            whileHover={reduced ? undefined : { rotate: -8, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              background: `linear-gradient(135deg, ${alpha(skill.color, 0.16)}, ${alpha(skill.color, 0.05)})`,
              border: `1px solid ${alpha(skill.color, 0.24)}`,
              color: skill.color,
              fontSize: 11.5,
              fontWeight: 700,
              letterSpacing: "0.03em",
            }}
          >
            {skill.icon}
          </motion.span>

          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#F1F5F9",
                  letterSpacing: "-0.02em",
                }}
              >
                {skill.name}
              </span>
              <span className="mono" style={{ fontSize: 10, color: alpha(skill.color, 0.7) }}>
                {skill.level}%
              </span>
            </div>

            <p style={{ marginTop: 6, fontSize: 12.5, color: "#64748B", lineHeight: 1.65 }}>
              {skill.description}
            </p>

            {/* Proficiency meter — fills once the card is in view. */}
            <div
              className="mt-3.5 overflow-hidden"
              style={{ height: 3, borderRadius: 999, background: "rgba(255,255,255,0.06)" }}
            >
              <motion.div
                style={{
                  height: "100%",
                  borderRadius: 999,
                  background: `linear-gradient(90deg, ${alpha(skill.color, 0.55)}, ${skill.color})`,
                  boxShadow: `0 0 10px ${alpha(skill.color, 0.6)}`,
                }}
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                viewport={VIEWPORT}
                transition={{ duration: 1.1, delay: 0.25 + (index % 3) * 0.08, ease: EASE_OUT }}
              />
            </div>
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

export default function Skills() {
  return (
    <Section id="skills" label="Technical Skills">
      <SectionHeading eyebrow="what I work with" title="Technical" accent="Expertise">
        A curated toolkit honed across production systems — from browser to bare metal, each chosen
        for <span style={{ color: "#94A3B8" }}>performance, reliability, and developer experience</span>.
      </SectionHeading>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 296px), 1fr))",
          gap: 18,
        }}
      >
        {SKILLS.map((skill, i) => (
          <SkillCard key={skill.name} skill={skill} index={i} />
        ))}
      </div>

      <Reveal delay={0.1} className="mt-14">
        <motion.div
          className="flex flex-wrap justify-center gap-2"
          variants={stagger(0.05)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          {EXTRAS.map((tag, i) => (
            <Tag key={tag} label={tag} index={i} />
          ))}
        </motion.div>
      </Reveal>
    </Section>
  );
}
