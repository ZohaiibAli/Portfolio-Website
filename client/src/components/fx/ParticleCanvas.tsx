import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useQuality } from "@/lib/useQuality";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: number;
  twinkle: number;
}

const PALETTE = [
  [96, 165, 250], // blue
  [34, 211, 238], // cyan
  [52, 211, 153], // green
  [167, 139, 250], // violet
];

/** Max link length in px. Doubles as the spatial-grid cell size. */
const LINK_DIST = 110;
const LINK_DIST_SQ = LINK_DIST * LINK_DIST;

/* Half-neighbourhood offsets: own cell, right, and the row below. Every pair
   is still visited exactly once, at roughly a third of the lookups. Hoisted
   out of the frame loop so the hot path allocates nothing. */
const NEIGHBOUR_DX = [0, 1, -1, 0, 1];
const NEIGHBOUR_DY = [0, 0, 1, 1, 1];

/** Opacity bands for the link mesh, faintest first. */
const BANDS = [0.03, 0.055, 0.08];

/** Particle count scales with area so phones don't render a desktop field. */
function densityFor(w: number, h: number, high: boolean): number {
  const target = (w * h) / (high ? 16000 : 26000);
  return Math.round(Math.min(high ? 120 : 46, Math.max(24, target)));
}

/**
 * The starfield behind the entire site.
 *
 * One canvas and one RAF loop for what would otherwise be hundreds of animated
 * DOM nodes. Because it is the only thing on this layer it can afford richer
 * behaviour: parallax drift, cursor repulsion, and proximity links between
 * neighbours.
 *
 * The link mesh is the expensive part and is built two ways:
 *
 *  - Neighbour search runs over a spatial hash, not every pair. The naive
 *    version was O(n²) — 120 particles is 7,140 distance tests per frame, all
 *    on the main thread, competing directly with scroll handling. Bucketing by
 *    a `LINK_DIST` grid makes it effectively O(n).
 *  - Segments are batched into three alpha bands and stroked three times per
 *    frame. Previously each link was its own `beginPath`/`stroke` pair — a
 *    canvas state change per link, several hundred per frame, which costs far
 *    more than the geometry itself. The per-link alpha fade is quantised, and
 *    at a peak opacity of 0.08 that is not a visible difference.
 *
 * On the low tier the mesh is dropped entirely and the field is thinned; the
 * drifting starfield reads the same and the frame cost is a fraction.
 */
export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const tier = useQuality();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const high = tier === "high";
    const linksEnabled = high && !reduced;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let t = 0;

    // Cursor lives in a closure: never causes a React render.
    const pointer = { x: -9999, y: -9999 };
    const repel = high;

    /* ── Spatial hash ───────────────────────────────────────────────────
       Rebuilt each frame from scratch — with these counts that is cheaper
       than maintaining it incrementally, and it can never drift. */
    let cols = 0;
    let rows = 0;
    let cells: number[][] = [];

    const buildGrid = () => {
      for (let i = 0; i < cells.length; i++) cells[i].length = 0;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const cx = Math.min(cols - 1, Math.max(0, (p.x / LINK_DIST) | 0));
        const cy = Math.min(rows - 1, Math.max(0, (p.y / LINK_DIST) | 0));
        cells[cy * cols + cx].push(i);
      }
    };

    const seed = () => {
      particles = Array.from({ length: densityFor(width, height, high) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: Math.random() * 1.5 + 0.4,
        hue: Math.floor(Math.random() * PALETTE.length),
        twinkle: Math.random() * Math.PI * 2,
      }));

      cols = Math.max(1, Math.ceil(width / LINK_DIST));
      rows = Math.max(1, Math.ceil(height / LINK_DIST));
      cells = Array.from({ length: cols * rows }, () => [] as number[]);
    };

    const applySize = () => {
      // Retina is free-looking and expensive: a 3x buffer is 9x the fill cost
      // for a field of 1px dots nobody inspects. Cap hard, harder on mobile.
      const dpr = Math.min(window.devicePixelRatio || 1, high ? 1.75 : 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /* Segment endpoints per alpha band, refilled each frame. Reused arrays,
       so a steady-state frame allocates nothing and never triggers a GC
       pause mid-scroll. */
    const segments: number[][] = BANDS.map(() => []);

    const draw = () => {
      raf = requestAnimationFrame(draw);

      ctx.clearRect(0, 0, width, height);
      t += 0.01;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!reduced) {
          p.x += p.vx;
          p.y += p.vy;

          // Soft repulsion so the field parts around the cursor. Pointless on
          // touch, where there is no cursor to part around.
          if (repel) {
            const dx = p.x - pointer.x;
            const dy = p.y - pointer.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 26000 && d2 > 0.01) {
              const f = (1 - d2 / 26000) * 0.9;
              const d = Math.sqrt(d2);
              p.x += (dx / d) * f;
              p.y += (dy / d) * f;
            }
          }

          // Wrap rather than bounce — no visible edges.
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;
        }

        const [r, g, b] = PALETTE[p.hue];
        const pulse = reduced ? 0.34 : 0.24 + Math.sin(t * 1.6 + p.twinkle) * 0.16;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${pulse})`;
        ctx.fill();
      }

      if (linksEnabled) {
        buildGrid();
        for (let i = 0; i < segments.length; i++) segments[i].length = 0;

        // One pass over the grid collects every link and files it by strength.
        for (let cy = 0; cy < rows; cy++) {
          for (let cx = 0; cx < cols; cx++) {
            const bucket = cells[cy * cols + cx];
            if (bucket.length === 0) continue;

            for (let n = 0; n < NEIGHBOUR_DX.length; n++) {
              const nx = cx + NEIGHBOUR_DX[n];
              const ny = cy + NEIGHBOUR_DY[n];
              if (nx < 0 || nx >= cols || ny >= rows) continue;
              const other = cells[ny * cols + nx];
              if (other.length === 0) continue;
              const same = n === 0;

              for (let a = 0; a < bucket.length; a++) {
                const p = particles[bucket[a]];
                for (let b = same ? a + 1 : 0; b < other.length; b++) {
                  const q = particles[other[b]];
                  const lx = p.x - q.x;
                  const ly = p.y - q.y;
                  const l2 = lx * lx + ly * ly;
                  if (l2 >= LINK_DIST_SQ) continue;

                  // Nearer links are stronger; quantise into a band.
                  const strength = 1 - l2 / LINK_DIST_SQ;
                  const band = Math.min(BANDS.length - 1, (strength * BANDS.length) | 0);
                  segments[band].push(p.x, p.y, q.x, q.y);
                }
              }
            }
          }
        }

        // Three strokes for the whole mesh, instead of one per link.
        ctx.lineWidth = 0.5;
        for (let band = 0; band < BANDS.length; band++) {
          const seg = segments[band];
          if (seg.length === 0) continue;
          ctx.beginPath();
          for (let i = 0; i < seg.length; i += 4) {
            ctx.moveTo(seg[i], seg[i + 1]);
            ctx.lineTo(seg[i + 2], seg[i + 3]);
          }
          ctx.strokeStyle = `rgba(120,180,250,${BANDS[band]})`;
          ctx.stroke();
        }
      }
    };

    /* ── Resize ─────────────────────────────────────────────────────────
       Mobile browsers fire `resize` every time the URL bar slides away, so a
       naive handler reallocates the canvas and reseeds the entire field
       mid-scroll — a visible pop, at the worst possible moment. Only a real
       width change, or a large height change, counts as a new layout. */
    let resizeTimer = 0;

    const measure = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isNewLayout = w !== width || Math.abs(h - height) > 140;
      width = w;
      height = h;
      applySize();
      if (isNewLayout || particles.length === 0) seed();
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(measure, 150);
    };

    const onPointer = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };
    // A hidden tab still runs RAF in some browsers; stop burning cycles.
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(draw);
    };

    measure();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", onResize);
    if (repel) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("pointerleave", onLeave);
    }
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced, tier]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{ opacity: 0.85 }}
    />
  );
}
