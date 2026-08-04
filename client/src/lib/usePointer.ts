import { useEffect, useState } from "react";
import { motionValue, type MotionValue } from "framer-motion";

export interface Pointer {
  /** Raw viewport pixel position. */
  x: MotionValue<number>;
  y: MotionValue<number>;
  /** Smoothed position — use for anything large and laggy-by-design. */
  sx: MotionValue<number>;
  sy: MotionValue<number>;
}

/* ── Shared pointer store ──────────────────────────────────────────────────
   One `pointermove` listener and one rAF loop for the entire page.

   Each consumer used to install its own listener and its own spring, so a
   single mouse move woke four listeners and four independent spring loops.
   Pointer events also fire faster than the display refreshes (120–1000Hz on
   gaming mice), so writing motion values directly from the handler did work
   the browser would immediately throw away. Now the handler only records the
   latest coordinate; the rAF loop publishes it once per frame.               */

const startX = typeof window === "undefined" ? 0 : window.innerWidth / 2;
const startY = typeof window === "undefined" ? 0 : window.innerHeight / 2;

const x = motionValue(startX);
const y = motionValue(startY);
const sx = motionValue(startX);
const sy = motionValue(startY);

/** Latest event coordinate, written by the listener, read by the frame loop. */
let latestX = startX;
let latestY = startY;
let dirty = false;

let subscribers = 0;
let raf = 0;
let attached = false;

/** Per-frame approach factor for the smoothed values. Frame-rate independent. */
const SMOOTHING = 0.12;

function onMove(e: PointerEvent) {
  latestX = e.clientX;
  latestY = e.clientY;
  dirty = true;
}

function frame() {
  raf = requestAnimationFrame(frame);

  if (dirty) {
    x.set(latestX);
    y.set(latestY);
    dirty = false;
  }

  const cx = sx.get();
  const cy = sy.get();
  const dx = latestX - cx;
  const dy = latestY - cy;

  // Park the loop's work once the smoothed value has caught up; sub-pixel
  // chasing is invisible and keeps the compositor busy for nothing.
  if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
    sx.set(cx + dx * SMOOTHING);
    sy.set(cy + dy * SMOOTHING);
  }
}

function attach() {
  if (attached) return;
  attached = true;
  window.addEventListener("pointermove", onMove, { passive: true });
  raf = requestAnimationFrame(frame);
}

function detach() {
  if (!attached) return;
  attached = false;
  window.removeEventListener("pointermove", onMove);
  cancelAnimationFrame(raf);
}

/**
 * Viewport pointer position as motion values.
 *
 * Motion values are written outside React, so the cursor drives transforms at
 * refresh rate with zero re-renders — and every caller shares one store.
 */
export function usePointer(): Pointer {
  useEffect(() => {
    subscribers += 1;
    attach();

    // A hidden tab still services rAF in some browsers; stop burning cycles.
    const onVisibility = () => (document.hidden ? detach() : subscribers > 0 && attach());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      subscribers -= 1;
      document.removeEventListener("visibilitychange", onVisibility);
      if (subscribers === 0) detach();
    };
  }, []);

  return { x, y, sx, sy };
}

/**
 * True only for devices with a real hover-capable pointer. Guards the custom
 * cursor and every hover-only affordance so touch users are never stranded.
 */
export function useHasFinePointer(): boolean {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setFine(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return fine;
}
