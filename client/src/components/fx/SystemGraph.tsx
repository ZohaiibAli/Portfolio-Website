import { motion, useReducedMotion } from "framer-motion";
import { useAmbient } from "@/lib/useAmbient";
import { useQuality } from "@/lib/useQuality";
import { EASE_OUT, alpha } from "@/lib/motion";

/*
  ── The hero's centrepiece ──────────────────────────────────────────────────

  A request moving through the stack this site's author actually builds: a
  client calls an API, the API fans out to Postgres and a vector store, and the
  vector store feeds an LLM. It is the shape of HelpGhar and CodeChronicle both,
  drawn as the system rather than described in a paragraph.

  ── Why the geometry is a module constant ─────────────────────────────────
  Every edge's `d` string is consumed twice: once by the `<path>` that draws it
  and once by the `offset-path` of the packets travelling along it. Declaring it
  once is what guarantees the traffic runs *on* the wire instead of near it —
  move a node and both follow. It is also why the stage is a fixed pixel box
  rather than a scaling `viewBox`: `offset-path` resolves in the element's own
  coordinate space, so a stretched SVG would slide the packets off the lines.
  Fitting smaller columns is a `scale()` on the wrapper, which moves both
  together.

  ── Why almost none of this is JavaScript ─────────────────────────────────
  Nine things here never stop moving — five packets and four node pulses. Driven
  from Framer that would be nine `repeat: Infinity` animations holding nine
  slots on the main thread's frame loop for the entire session, in the hero, on
  the screen the user is about to scroll. As CSS with staggered delays the
  cascade is declared once and the compositor runs it; the main thread hears
  about the graph exactly once, at mount.
*/

const W = 340;
const H = 400;

interface NodeSpec {
  id: string;
  label: string;
  sub: string;
  icon: string;
  accent: string;
  cx: number;
  cy: number;
  w: number;
  h: number;
  /** Seconds into the 2.2s loop at which traffic reaches this node. */
  pulseAt: number;
}

const NODES: NodeSpec[] = [
  { id: "client", label: "CLIENT", sub: "React · TypeScript", icon: "◤", accent: "#60A5FA", cx: 170, cy: 36, w: 136, h: 50, pulseAt: 0 },
  { id: "api", label: "API", sub: "Node · FastAPI", icon: "⬡", accent: "#38BDF8", cx: 170, cy: 152, w: 136, h: 50, pulseAt: 0.55 },
  { id: "db", label: "POSTGRES", sub: "H3 · geo", icon: "▤", accent: "#34D399", cx: 70, cy: 272, w: 116, h: 46, pulseAt: 1.2 },
  { id: "vector", label: "VECTOR", sub: "pgvector", icon: "◈", accent: "#22D3EE", cx: 270, cy: 272, w: 116, h: 46, pulseAt: 1.35 },
  { id: "llm", label: "LLM", sub: "RAG answer", icon: "✳", accent: "#7DD3FC", cx: 270, cy: 368, w: 116, h: 46, pulseAt: 1.95 },
];

interface EdgeSpec {
  d: string;
  label: string;
  /** Label anchor, in stage coordinates. */
  lx: number;
  ly: number;
  anchor: "start" | "middle" | "end";
}

/* Endpoints are the node borders, not their centres, so no line runs under a
   card: `cy ± h/2` on each side of every hop. */
const EDGES: EdgeSpec[] = [
  { d: "M 170 61 L 170 127", label: "https", lx: 179, ly: 98, anchor: "start" },
  { d: "M 152 177 C 152 220, 70 218, 70 249", label: "sql", lx: 101, ly: 222, anchor: "middle" },
  { d: "M 188 177 C 188 220, 270 218, 270 249", label: "embed", lx: 243, ly: 222, anchor: "middle" },
  { d: "M 270 295 L 270 345", label: "context", lx: 279, ly: 324, anchor: "start" },
];

/** `edge` indexes `EDGES`; `delay` staggers the cascade across the 2.2s loop. */
const PACKETS: { edge: number; delay: number; color: string }[] = [
  { edge: 0, delay: 0, color: "#7DD3FC" },
  { edge: 0, delay: 1.1, color: "#60A5FA" },
  { edge: 1, delay: 0.55, color: "#34D399" },
  { edge: 2, delay: 0.7, color: "#22D3EE" },
  { edge: 3, delay: 1.3, color: "#A5F3FC" },
];

function Node({ node, index, animate }: { node: NodeSpec; index: number; animate: boolean }) {
  const high = useQuality() === "high";

  return (
    <motion.div
      className="absolute"
      style={{
        left: node.cx - node.w / 2,
        top: node.cy - node.h / 2,
        width: node.w,
        height: node.h,
      }}
      initial={{ opacity: 0, scale: 0.82 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.55 + index * 0.11, duration: 0.6, ease: EASE_OUT }}
    >
      {/* The ring thrown off as traffic lands. Purely decorative, so it is the
          first thing dropped when there is no budget for it. */}
      {animate && (
        <span
          aria-hidden="true"
          className="node-pulse pointer-events-none absolute inset-0"
          style={{
            borderRadius: 12,
            border: `1px solid ${node.accent}`,
            animationDelay: `${node.pulseAt}s`,
          }}
        />
      )}

      <div
        className="flex h-full w-full items-center gap-2.5 px-3"
        style={{
          borderRadius: 12,
          background: "rgba(6,11,24,0.88)",
          border: `1px solid ${alpha(node.accent, 0.32)}`,
          boxShadow: `0 0 22px ${alpha(node.accent, 0.14)}, 0 10px 30px rgba(0,0,0,0.5)`,
          backdropFilter: high ? "blur(12px)" : undefined,
          WebkitBackdropFilter: high ? "blur(12px)" : undefined,
        }}
      >
        <span
          className="mono grid flex-shrink-0 place-items-center"
          style={{
            width: 26,
            height: 26,
            borderRadius: 8,
            background: alpha(node.accent, 0.12),
            border: `1px solid ${alpha(node.accent, 0.26)}`,
            color: node.accent,
            fontSize: 12,
          }}
        >
          {node.icon}
        </span>

        <span className="min-w-0">
          <span
            className="mono block truncate"
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              color: "#E9F1FF",
              letterSpacing: "0.1em",
            }}
          >
            {node.label}
          </span>
          <span
            className="mono block truncate"
            style={{ fontSize: 9, color: alpha(node.accent, 0.85), letterSpacing: "0.04em" }}
          >
            {node.sub}
          </span>
        </span>
      </div>
    </motion.div>
  );
}

interface Props {
  /** Uniform scale on the whole stage, for columns narrower than 340px. */
  scale?: number;
  className?: string;
}

export default function SystemGraph({ scale = 1, className }: Props) {
  const ambient = useAmbient();
  const reduced = useReducedMotion();

  return (
    <div
      className={className}
      style={{
        // The stage is a fixed box; the wrapper reserves its *scaled* size so
        // the layout around it doesn't have to know about the transform.
        width: W * scale,
        height: H * scale,
        position: "relative",
      }}
    >
      <div
        style={{
          width: W,
          height: H,
          position: "relative",
          transform: scale === 1 ? undefined : `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {/* Pool of light the whole system sits in. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{
            inset: -40,
            background:
              "radial-gradient(ellipse at 50% 42%, rgba(37,99,235,0.20) 0%, rgba(34,211,238,0.07) 46%, transparent 72%)",
          }}
        />

        <svg
          width={W}
          height={H}
          className="absolute inset-0"
          aria-hidden="true"
          style={{ overflow: "visible" }}
        >
          {EDGES.map((edge, i) => (
            <g key={i}>
              {/*
                The wire — dashed, and faded in rather than drawn in.

                Framer's `pathLength` implements the draw by writing
                `strokeDasharray` itself, so it and a dash pattern cannot both
                have the wire: asking for the stroke-on entrance silently ends
                with a solid line. The dashes win. They are what makes the thing
                read as a diagram, they are on screen for the whole session
                rather than for the 0.7s of an entrance, and the packets already
                supply all the motion this edge needs.
              */}
              <motion.path
                d={edge.d}
                fill="none"
                stroke="rgba(96,165,250,0.30)"
                strokeWidth={1.25}
                strokeLinecap="round"
                strokeDasharray="4 5"
                initial={reduced ? undefined : { opacity: 0 }}
                animate={reduced ? undefined : { opacity: 1 }}
                transition={{ delay: 0.7 + i * 0.12, duration: 0.6, ease: EASE_OUT }}
              />
              <motion.text
                x={edge.lx}
                y={edge.ly}
                textAnchor={edge.anchor}
                className="mono"
                style={{ fontSize: 8, fill: "#4F6C90", letterSpacing: "0.14em" }}
                initial={reduced ? undefined : { opacity: 0 }}
                animate={reduced ? undefined : { opacity: 1 }}
                transition={{ delay: 1.1 + i * 0.1, duration: 0.5 }}
              >
                {edge.label}
              </motion.text>
            </g>
          ))}
        </svg>

        {/* Traffic. `offset-path` takes the very same `d` the wire was drawn
            from, which is what keeps a packet on its line. */}
        {ambient &&
          PACKETS.map((packet, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="packet pointer-events-none absolute"
              style={{
                left: 0,
                top: 0,
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: packet.color,
                boxShadow: `0 0 12px ${packet.color}, 0 0 22px ${alpha(packet.color, 0.6)}`,
                offsetPath: `path("${EDGES[packet.edge].d}")`,
                animationDelay: `${packet.delay}s`,
              }}
            />
          ))}

        {NODES.map((node, i) => (
          <Node key={node.id} node={node} index={i} animate={ambient} />
        ))}
      </div>
    </div>
  );
}
