import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import ParticleCanvas from "./ParticleCanvas";
import { usePointer, useHasFinePointer } from "@/lib/usePointer";
import { useQuality } from "@/lib/useQuality";
import { EASE_INOUT } from "@/lib/motion";

/* Procedural grain — a data URI so the strict-CSP-friendly build ships no
   extra requests. It kills banding in the large radial gradients. */
const GRAIN =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
       <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="4" stitchTiles="stitch"/>
       <feColorMatrix type="saturate" values="0"/></filter>
       <rect width="180" height="180" filter="url(#n)" opacity="0.42"/>
     </svg>`
  );

interface BlobProps {
  color: string;
  size: number;
  left: string;
  top: string;
  duration: number;
  delay?: number;
  drift: [number, number];
}

/**
 * A slow-breathing aurora lobe.
 *
 * Animates transform and opacity only, so the compositor owns it. The static
 * `filter: blur()` is set once and never animated — a blurred layer is cheap
 * to *move*, but re-blurring it every frame is not, which is why the drift is
 * a translate rather than a change in blur radius. The gradient's own falloff
 * does most of the softening; the blur only kills banding, so it can be far
 * smaller than it looks like it needs to be.
 */
function Blob({ color, size, left, top, duration, delay = 0, drift }: BlobProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      className="absolute rounded-full gpu"
      style={{
        left,
        top,
        width: size,
        height: size,
        background: `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 68%)`,
        filter: "blur(14px)",
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={
        reduced
          ? undefined
          : {
              x: [0, drift[0], -drift[0] * 0.6, 0],
              y: [0, drift[1], -drift[1] * 0.7, 0],
              scale: [1, 1.18, 0.94, 1],
              opacity: [0.55, 0.9, 0.5, 0.55],
            }
      }
      transition={{ duration, delay, repeat: Infinity, ease: EASE_INOUT }}
    />
  );
}

/**
 * The single ambient backdrop for the whole site.
 *
 * Every section used to render its own grid + 40-node particle field + a
 * mouse-tracking glow driven by React state. That is now one fixed layer:
 * aurora → grid → particles → cursor spotlight → grain → vignette.
 */
export default function SceneBackground() {
  const reduced = useReducedMotion();
  const high = useQuality() === "high";
  const fine = useHasFinePointer();
  const { sx, sy } = usePointer();
  const { scrollYProgress } = useScroll();

  // The aurora field drifts slightly as the page scrolls: cheap depth.
  const parallax = useSpring(scrollYProgress, { stiffness: 40, damping: 22 });
  const auroraY = useTransform(parallax, [0, 1], ["0%", "-14%"]);
  const gridY = useTransform(parallax, [0, 1], ["0%", "-6%"]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 0, backgroundColor: "#060A12" }}
    >
      {/* ── Aurora ───────────────────────────────────────────────────────
          The container used to carry a scroll-linked `hue-rotate`. A filter on
          a full-viewport element is recomputed on every scroll frame and
          forces its whole subtree — four large blurred lobes — to re-render
          with it. The colour shift was worth a few degrees of hue and cost
          more than everything else on this layer combined. */}
      <motion.div className="absolute inset-0" style={{ y: reduced ? 0 : auroraY }}>
        <Blob color="rgba(37,99,235,0.30)" size={820} left="18%" top="12%" duration={26} drift={[70, 50]} />
        <Blob color="rgba(124,58,237,0.24)" size={720} left="82%" top="26%" duration={31} delay={2} drift={[-80, 60]} />
        {/* The back two lobes are the least legible and the largest to
            composite — high tier only. */}
        {high && (
          <>
            <Blob color="rgba(34,211,238,0.18)" size={640} left="62%" top="72%" duration={35} delay={4} drift={[60, -70]} />
            <Blob color="rgba(52,211,153,0.16)" size={560} left="12%" top="82%" duration={29} delay={1.5} drift={[-50, -55]} />
          </>
        )}
      </motion.div>

      {/* ── Grid ───────────────────────────────────────────────────────── */}
      <motion.svg
        className="absolute"
        style={{ y: reduced ? 0 : gridY, left: 0, top: "-8%", width: "100%", height: "118%", opacity: 0.07 }}
      >
        <defs>
          <pattern id="scene-grid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M 64 0 L 0 0 0 64" fill="none" stroke="#60A5FA" strokeWidth="0.5" />
          </pattern>
          <radialGradient id="scene-grid-mask">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="scene-grid-fade">
            <rect width="100%" height="100%" fill="url(#scene-grid-mask)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#scene-grid)" mask="url(#scene-grid-fade)" />
      </motion.svg>

      {/* ── Particles ──────────────────────────────────────────────────── */}
      <ParticleCanvas />

      {/* ── Cursor spotlight ───────────────────────────────────────────
          Driven by motion values, so it tracks without re-rendering React.
          Nothing to track on a touch device, where it would just be a 760px
          layer pinned to the middle of the screen. */}
      {fine && (
        <motion.div
          className="absolute rounded-full gpu"
          style={{
            // `x`/`y` rather than `left`/`top`: the same movement, but as a
            // transform it never invalidates layout.
            x: sx,
            y: sy,
            left: 0,
            top: 0,
            width: 760,
            height: 760,
            marginLeft: -380,
            marginTop: -380,
            background:
              "radial-gradient(circle, rgba(96,165,250,0.10) 0%, rgba(124,58,237,0.05) 38%, transparent 68%)",
          }}
        />
      )}

      {/* ── Grain ────────────────────────────────────────────────────────
          `mix-blend-mode` here forced the browser to re-blend this layer
          against the animating aurora beneath it on every frame, for the whole
          viewport. A plain low-opacity tile is indistinguishable over a
          backdrop this dark and costs nothing. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${GRAIN}")`,
          backgroundRepeat: "repeat",
          opacity: 0.1,
        }}
      />

      {/* ── Vignette — pins attention to the centre column ─────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% 40%, transparent 40%, rgba(3,6,12,0.55) 100%)",
        }}
      />
    </div>
  );
}
