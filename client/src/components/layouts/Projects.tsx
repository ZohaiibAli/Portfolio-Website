import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Section from "@/components/fx/Section";
import SectionHeading from "@/components/fx/SectionHeading";
import Reveal from "@/components/fx/Reveal";
import GlowButton from "@/components/ui/GlowButton";
import Tag from "@/components/ui/Tag";
import { useAmbient } from "@/lib/useAmbient";
import { useHasFinePointer } from "@/lib/usePointer";
import { EASE_OUT, SPRING_SOFT, VIEWPORT, alpha } from "@/lib/motion";
import { PROJECTS_SHIPPED } from "@/lib/profile";

interface Project {
  id: string;
  name: string;
  subtitle: string;
  year: string;
  description: string;
  /** Bullet points surfaced only in the expanded view. */
  features: string[];
  gradient: string;
  accent: string;
  tags: string[];
  icon: string;
  /** Basename in `public/images/projects/` — a screenshot of the deployed
      site. `null` falls back to the generated gradient artwork. */
  preview: string | null;
  liveDemo: string | null;
  github: string | null;
}

/* Order matches the resume — HelpGhar → AI Dataset Cleaner → CodeChronicle —
   with ServiceHub last, since it is the one build the resume doesn't list. */
const PROJECTS: Project[] = [
  {
    id: "helpghar",
    name: "HelpGhar",
    subtitle: "Home Services Marketplace Platform",
    year: "2025",
    description:
      "Full-stack home services marketplace connecting customers with verified workers, featuring a RAG-powered chatbot for user queries and ML-driven gig ranking with personalized worker recommendations.",
    features: [
      "RAG chatbot answering user queries over a vectorised service knowledge base",
      "ML-driven gig ranking that personalises worker recommendations per customer",
      "Nine service categories with verified-worker onboarding and review flows",
      "Responsive React + TypeScript frontend backed by a REST API",
    ],
    gradient: "linear-gradient(135deg, #091a07 0%, #0d2a0a 42%, #123510 100%)",
    accent: "#4ADE80",
    tags: ["React.js", "TypeScript", "RAG Chatbot", "ML Recommendations"],
    icon: "⬟",
    preview: "helpghar",
    liveDemo: "https://help-ghar-beta.vercel.app/",
    github: null,
  },
  {
    id: "dataset-cleaner",
    name: "AI Dataset Cleaner",
    subtitle: "Data Preprocessing & Analysis Tool",
    year: "2025",
    description:
      "Streamlit web application that streamlines dataset cleaning and analysis — handling missing values, duplicates, outliers and inconsistencies with automated multi-strategy imputation and a recommendation engine.",
    features: [
      "Multi-strategy imputation with automatic selection per column type",
      "Outlier and duplicate detection with a preview-before-apply workflow",
      "Recommendation engine that suggests the next cleaning step",
      "Exportable, reproducible cleaning pipeline built on Pandas",
    ],
    gradient: "linear-gradient(135deg, #1a1207 0%, #281a0a 42%, #40260d 100%)",
    accent: "#F59E0B",
    tags: ["Streamlit", "Python", "Pandas", "Data Cleaning"],
    icon: "◆",
    preview: "dataset-cleaner",
    liveDemo: "https://raw2ready-ai.streamlit.app/",
    github: null,
  },
  {
    id: "codechronicle",
    name: "CodeChronicle",
    subtitle: "AI Repository Analysis & Code Intelligence",
    year: "2026",
    description:
      "Full-stack platform that connects to GitHub, GitLab and Bitbucket repositories and automatically analyses codebase architecture, commit history and development patterns — surfacing potential defects and rendering the whole system as an interactive architecture graph.",
    features: [
      "Connects to GitHub, GitLab and Bitbucket and analyses architecture, commit history and development patterns",
      "AI-powered code intelligence detecting potential defects, with categorised issue filtering",
      "Interactive visualisations of repository architecture and development insights",
      "Actionable output letting teams evaluate project structure, code quality and history at a glance",
    ],
    gradient: "linear-gradient(135deg, #07101a 0%, #0a1826 42%, #0d2033 100%)",
    accent: "#60A5FA",
    tags: ["React.js", "FastAPI", "Python", "Code Intelligence", "Data Viz"],
    icon: "◉",
    preview: "codechronicle",
    liveDemo: "https://living-system-architecture-48kw.vercel.app/",
    github: null,
  },
  {
    id: "servicehub",
    name: "ServiceHub",
    subtitle: "Role-Based & Real-Time System",
    year: "2026",
    description:
      "Full-stack service marketplace connecting seekers and providers with secure three-role auth (Admin, Seeker, Provider), real-time WebSocket chat, and H3 geospatial indexing for radius-based discovery.",
    features: [
      "Three-role access control (Admin / Seeker / Provider) on JWT auth",
      "Real-time seeker↔provider chat over WebSockets",
      "H3 geospatial indexing for radius-based, location-aware discovery",
      "PostgreSQL schema designed for consistency under concurrent bookings",
    ],
    gradient: "linear-gradient(135deg, #071a12 0%, #0a2018 42%, #0d2d22 100%)",
    accent: "#10B981",
    tags: [
      "React.js",
      "Node.js",
      "Express.js",
      "PostgreSQL",
      "WebSockets",
      "H3",
    ],
    icon: "⬡",
    preview: "servicehub",
    liveDemo: "https://frontend-pro-battle26-stage3.vercel.app/login",
    github: null,
  },
];

/* ── Card artwork ─────────────────────────────────────────────────────────
   Shared between the grid card and the modal so `layoutId` can morph it.    */

/** Hostname only, for the fake address bar: `help-ghar-beta.vercel.app`. */
function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

/**
 * Browser window frame shared by every card.
 *
 * The metadata lives in the chrome bar rather than floating over the artwork.
 * That was the first version, and it failed the moment the artwork became a
 * real screenshot: HelpGhar's site is mostly white, so accent-coloured text
 * sat on white and disappeared. A scrim would have to be heavy enough for the
 * brightest screenshot any future project might have — which is to say heavy
 * enough to hide the screenshot. The chrome bar is a surface this component
 * controls, so contrast is fixed no matter what is behind it.
 */
function BrowserFrame({
  label,
  year,
  accent,
  height,
  children,
}: {
  label: string;
  /** Omitted in the expanded view, where the close button occupies that
      corner and the subtitle already carries the year. */
  year?: string;
  accent: string;
  height: number;
  children: React.ReactNode;
}) {
  const CHROME = 26;

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height, background: "#050A16", flexShrink: 0 }}
    >
      {/* Traffic lights + address bar — the same language as the hero's code
          editor, so the two read as one system. */}
      <div
        className="flex items-center gap-1.5 px-3"
        style={{ height: CHROME, background: "#0B1224", borderBottom: "1px solid #151E36" }}
      >
        {["#FF5F57", "#FFBD2E", "#28C840"].map((c) => (
          <span
            key={c}
            style={{ width: 6, height: 6, borderRadius: 999, background: c, flexShrink: 0 }}
          />
        ))}
        <span
          className="mono ml-2 truncate rounded"
          style={{
            padding: "1px 8px",
            fontSize: 8.5,
            color: "#5A7492",
            background: "rgba(96,165,250,0.06)",
            letterSpacing: "0.02em",
            minWidth: 0,
          }}
        >
          {label}
        </span>
        {year && (
          <span
            className="mono ml-auto pl-2"
            style={{ fontSize: 9, color: alpha(accent, 0.8), letterSpacing: "0.1em", flexShrink: 0 }}
          >
            {year}
          </span>
        )}
      </div>

      <div className="relative overflow-hidden" style={{ height: height - CHROME }}>
        {children}
        {/* Fades the artwork into the card body below it. Cosmetic only now —
            nothing depends on it for legibility. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0"
          style={{
            height: 40,
            background: "linear-gradient(to top, rgba(3,6,15,0.85), transparent)",
          }}
        />
      </div>
    </div>
  );
}

/**
 * The card's visual: a screenshot of the deployed site where one exists.
 *
 * The generated gradient-and-glyph artwork was a reasonable placeholder, but it
 * told a visitor nothing — every card looked like every other card and none of
 * them looked like software. A screenshot of the actual running thing is the
 * most persuasive image a project card can carry, so it wins wherever there is
 * something deployed to point a browser at.
 *
 * On hover the screenshot pans down to reveal more of the page. That is a plain
 * `translateY`, so a grid of them animates on the compositor for free.
 */
function Artwork({
  project,
  tall = false,
  hovered = false,
}: {
  project: Project;
  tall?: boolean;
  hovered?: boolean;
}) {
  const reduced = useReducedMotion();
  const ambient = useAmbient();
  const height = tall ? 200 : 158;

  if (project.preview) {
    return (
      <BrowserFrame
        label={project.liveDemo ? hostOf(project.liveDemo) : project.name.toLowerCase()}
        year={tall ? undefined : project.year}
        accent={project.accent}
        height={height}
      >
        {/* Deliberately wider than its frame is tall, so there is page left to
            pan to; `top` keeps the site's own header in shot at rest. */}
        <motion.img
          src={`/images/projects/${project.preview}.webp`}
          alt={`${project.name} — screenshot of the live site`}
          loading="lazy"
          decoding="async"
          width={1200}
          height={750}
          className="absolute inset-x-0 top-0 w-full"
          style={{ display: "block" }}
          animate={{ y: hovered && !reduced ? -(height * 0.3) : 0 }}
          transition={{ duration: 0.85, ease: EASE_OUT }}
        />
      </BrowserFrame>
    );
  }

  // Nothing deployed — keep the generated artwork, but inside the same frame so
  // the row doesn't read as two finished cards and one unfinished one.
  return (
    <BrowserFrame
      label="runs locally"
      year={tall ? undefined : project.year}
      accent={project.accent}
      height={height}
    >
      <div className="absolute inset-0" style={{ background: project.gradient }} />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 30% 35%, ${alpha(project.accent, 0.3)} 0%, transparent 66%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(255,255,255,0.015) 28px, rgba(255,255,255,0.015) 29px), repeating-linear-gradient(90deg, transparent, transparent 28px, rgba(255,255,255,0.015) 28px, rgba(255,255,255,0.015) 29px)",
        }}
      />

      {/* Slow orbit of the glyph, so the artwork never sits perfectly still.

          The glyph carries a 22px `drop-shadow`, and a filtered element cannot
          be transformed on the compositor: rotating and scaling it means the
          browser re-runs the shadow every frame for as long as the card is
          mounted. Off below the high tier — the glyph keeps its glow, it just
          stops moving. */}
      <motion.span
        className="absolute left-1/2 top-1/2 select-none"
        style={{
          translateX: "-50%",
          translateY: "-50%",
          fontSize: tall ? 68 : 50,
          fontFamily: "var(--font-mono)",
          color: project.accent,
          opacity: 0.22,
          filter: `drop-shadow(0 0 22px ${project.accent})`,
        }}
        animate={ambient ? { rotate: [0, 8, -8, 0], scale: [1, 1.06, 1] } : undefined}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        {project.icon}
      </motion.span>
    </BrowserFrame>
  );
}

/* ── Grid card ────────────────────────────────────────────────────────── */

function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const reduced = useReducedMotion();
  /* `pointerenter` fires on touch too — see the note in `SpotlightCard`. Here
     it also kicks off the artwork's pan, so a thumb dragging past a card
     started a 0.85s image animation nobody asked for, mid-scroll. */
  const hoverable = useHasFinePointer() && !reduced;

  return (
    <motion.div
      initial={{ opacity: 0, y: 44, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.7, delay: index * 0.1, ease: EASE_OUT }}
      className="h-full"
    >
      {/*
        Deliberately no 3D tilt here. `layoutId` measures bounding boxes, and a
        rotated ancestor at click time makes the morph start from a skewed box.
        The card gets its depth from the lift + spotlight instead.
      */}
      <motion.button
        layoutId={`project-${project.id}`}
        onClick={onOpen}
        onPointerEnter={hoverable ? () => setHovered(true) : undefined}
        onPointerLeave={hoverable ? () => setHovered(false) : undefined}
        transition={SPRING_SOFT}
        whileHover={reduced ? undefined : { y: -8 }}
        className="flex h-full w-full flex-col overflow-hidden text-left"
        style={{
          borderRadius: 20,
          background: "rgba(6,11,24,0.86)",
          border: `1px solid ${hovered ? alpha(project.accent, 0.4) : "rgba(96,165,250,0.13)"}`,
          backdropFilter: "blur(20px)",
          boxShadow: hovered
            ? `0 0 44px ${alpha(project.accent, 0.2)}, 0 24px 64px rgba(0,0,0,0.6)`
            : "0 6px 30px rgba(0,0,0,0.42)",
          transition: "border-color 260ms ease, box-shadow 260ms ease",
          cursor: "pointer",
        }}
        aria-label={`Open details for ${project.name}`}
      >
        <motion.div layoutId={`project-art-${project.id}`}>
          <Artwork project={project} hovered={hovered} />
        </motion.div>

        <div className="flex flex-1 flex-col p-5">
          <motion.h3
            layoutId={`project-title-${project.id}`}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: hovered ? project.accent : "#E9F1FF",
              transition: "color 260ms ease",
            }}
          >
            {project.name}
          </motion.h3>

          <p
            className="mono"
            style={{
              marginTop: 3,
              fontSize: 10,
              color: alpha(project.accent, 0.66),
              letterSpacing: "0.07em",
              textTransform: "uppercase",
            }}
          >
            {project.subtitle}
          </p>

          <p
            style={{
              margin: "12px 0 14px",
              flex: 1,
              fontSize: 12.5,
              color: "#4F6C90",
              lineHeight: 1.75,
            }}
          >
            {project.description}
          </p>

          <div className="mb-3.5 flex flex-wrap gap-1.5">
            {project.tags.map((t, i) => (
              <Tag
                key={t}
                label={t}
                index={i}
                size="sm"
                accent={project.accent}
              />
            ))}
          </div>

          <span
            className="mono inline-flex items-center gap-2"
            style={{
              fontSize: 10.5,
              color: project.accent,
              letterSpacing: "0.06em",
            }}
          >
            View case study
            <motion.span
              animate={{ x: hovered && !reduced ? 4 : 0 }}
              transition={{ duration: 0.24 }}
            >
              →
            </motion.span>
          </span>
        </div>

        <div
          aria-hidden="true"
          style={{
            height: 2,
            background: hovered
              ? `linear-gradient(90deg, transparent, ${project.accent}, transparent)`
              : "transparent",
            transition: "background 300ms ease",
          }}
        />
      </motion.button>
    </motion.div>
  );
}

/* ── Detail modal ─────────────────────────────────────────────────────── */

function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 grid place-items-center p-4"
      style={{ zIndex: 9990 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: "rgba(1,3,10,0.82)",
          backdropFilter: "blur(14px)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      />

      <motion.div
        layoutId={`project-${project.id}`}
        transition={SPRING_SOFT}
        role="dialog"
        aria-modal="true"
        aria-label={`${project.name} case study`}
        className="relative flex max-h-[88vh] w-full flex-col overflow-hidden"
        style={{
          maxWidth: 660,
          borderRadius: 22,
          background: "rgba(6,11,24,0.96)",
          border: `1px solid ${alpha(project.accent, 0.3)}`,
          boxShadow: `0 0 70px ${alpha(project.accent, 0.18)}, 0 40px 100px rgba(0,0,0,0.75)`,
        }}
      >
        <motion.div layoutId={`project-art-${project.id}`}>
          <Artwork project={project} tall />
        </motion.div>

        <button
          onClick={onClose}
          aria-label="Close"
          className="mono absolute right-3.5 top-3.5 grid h-8 w-8 place-items-center rounded-lg"
          style={{
            background: "rgba(3,6,15,0.72)",
            border: "1px solid rgba(96,165,250,0.22)",
            color: "#8FA8C8",
            fontSize: 15,
            cursor: "pointer",
            backdropFilter: "blur(10px)",
          }}
        >
          ✕
        </button>

        <div className="overflow-y-auto p-7">
          <motion.h3
            layoutId={`project-title-${project.id}`}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.4rem, 4vw, 1.9rem)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "#E9F1FF",
            }}
          >
            {project.name}
          </motion.h3>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.45, ease: EASE_OUT }}
          >
            <p
              className="mono"
              style={{
                marginTop: 5,
                fontSize: 11,
                color: alpha(project.accent, 0.8),
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {project.subtitle} · {project.year}
            </p>

            <p
              style={{
                margin: "18px 0 22px",
                fontSize: 14,
                color: "#607E9E",
                lineHeight: 1.85,
              }}
            >
              {project.description}
            </p>

            <div
              className="mono mb-4 flex items-center gap-3"
              style={{
                fontSize: 10.5,
                color: "#2E4560",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              <span>What it does</span>
              <span
                style={{
                  flex: 1,
                  height: 1,
                  background: `linear-gradient(90deg, ${alpha(project.accent, 0.3)}, transparent)`,
                }}
              />
            </div>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px" }}>
              {project.features.map((f, i) => (
                <motion.li
                  key={f}
                  className="flex gap-3"
                  style={{ marginBottom: 9 }}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.24 + i * 0.06,
                    duration: 0.4,
                    ease: EASE_OUT,
                  }}
                >
                  <span
                    style={{
                      color: project.accent,
                      fontSize: 12,
                      marginTop: 3,
                      flexShrink: 0,
                    }}
                  >
                    ▸
                  </span>
                  <span
                    style={{ fontSize: 13, color: "#5E7A9C", lineHeight: 1.75 }}
                  >
                    {f}
                  </span>
                </motion.li>
              ))}
            </ul>

            <div className="mb-7 flex flex-wrap gap-1.5">
              {project.tags.map((t, i) => (
                <Tag
                  key={t}
                  label={t}
                  index={i}
                  size="sm"
                  accent={project.accent}
                />
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {project.liveDemo ? (
                <GlowButton href={project.liveDemo} external>
                  Live Demo <span aria-hidden="true">↗</span>
                </GlowButton>
              ) : (
                <span
                  className="mono"
                  style={{
                    padding: "15px 30px",
                    borderRadius: 14,
                    fontSize: 13,
                    color: "#2E4560",
                    background: "rgba(96,165,250,0.05)",
                    border: "1px solid rgba(96,165,250,0.13)",
                  }}
                >
                  Private / In progress
                </span>
              )}
              {project.github && (
                <GlowButton href={project.github} variant="ghost" external>
                  GitHub
                </GlowButton>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Section ──────────────────────────────────────────────────────────── */

export default function Projects() {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = PROJECTS.find((p) => p.id === openId) ?? null;

  return (
    <Section id="projects" label="Selected Work">
      <SectionHeading eyebrow="projects" title="Selected" accent="Work">
        {/* Says out loud that this is a subset. Without it, a grid of three
            cards sits directly under a hero claiming ten-plus shipped, and a
            visitor reads the gap as the number being inflated. Both figures
            are derived, so adding a case study updates the sentence itself. */}
        {PROJECTS.length} of {PROJECTS_SHIPPED} shipped builds — real-world systems made for{" "}
        <span style={{ color: "#8FA8C8" }}>
          scale, reliability, and real users
        </span>
        , from geospatial marketplaces to RAG-powered assistants.
      </SectionHeading>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(min(100%, 310px), 1fr))",
          gap: 22,
          alignItems: "stretch",
        }}
      >
        {PROJECTS.map((p, i) => (
          <ProjectCard
            key={p.id}
            project={p}
            index={i}
            onOpen={() => setOpenId(p.id)}
          />
        ))}
      </div>

      <Reveal delay={0.1} className="mt-14 flex justify-center">
        <GlowButton
          href="https://github.com/ZohaiibAli"
          variant="ghost"
          external
        >
          View all projects on GitHub{" "}
          <span style={{ color: "#10B981" }}>→</span>
        </GlowButton>
      </Reveal>

      {/*
        Portalled to <body>: `Section` applies a scroll-linked `filter`, which
        makes it a containing block for fixed children and would trap the modal
        inside the section. The portal keeps React context, so the `layoutId`
        morph from card to dialog still runs.
      */}
      {createPortal(
        <AnimatePresence>
          {open && (
            <ProjectModal
              key={open.id}
              project={open}
              onClose={() => setOpenId(null)}
            />
          )}
        </AnimatePresence>,
        document.body,
      )}
    </Section>
  );
}
