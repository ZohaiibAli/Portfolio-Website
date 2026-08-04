import { useCallback, useEffect, useRef, type RefObject } from "react";

/**
 * Caches an element's bounding box for the duration of a hover.
 *
 * Every pointer-driven card here needs its own rect to normalise the cursor
 * position, and each one used to call `getBoundingClientRect()` inside its
 * `pointermove` handler. That read forces the browser to flush layout
 * synchronously — and it lands in the middle of a stream of pointer events,
 * interleaved with the style writes Framer Motion is making on the next frame.
 * The result is the classic layout-thrash sawtooth: hundreds of forced reflows
 * a second, every one of them blocking the main thread.
 *
 * The rect only changes when the element moves, so measure once on enter and
 * again after a scroll, and read from the cache in between.
 */
export function useHoverRect(ref: RefObject<HTMLElement | null>) {
  const rect = useRef<DOMRect | null>(null);
  const hovering = useRef(false);

  const measure = useCallback(() => {
    const el = ref.current;
    if (el) rect.current = el.getBoundingClientRect();
  }, [ref]);

  const enter = useCallback(() => {
    hovering.current = true;
    measure();
  }, [measure]);

  const leave = useCallback(() => {
    hovering.current = false;
    rect.current = null;
  }, []);

  /** The cached rect, re-measuring only if we somehow never captured one. */
  const get = useCallback((): DOMRect | null => {
    if (!rect.current) measure();
    return rect.current;
  }, [measure]);

  // Scrolling moves the element out from under the cached box. Only listen
  // while a pointer is actually inside one.
  useEffect(() => {
    const onScroll = () => {
      if (hovering.current) measure();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [measure]);

  return { enter, leave, get };
}
