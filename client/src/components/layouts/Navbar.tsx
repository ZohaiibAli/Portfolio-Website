import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useReducedMotion } from "framer-motion";
import Magnetic from "@/components/fx/Magnetic";
import { EASE_OUT, SPRING_SNAP } from "@/lib/motion";

const LINKS = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Internship", href: "#internship" },
  { label: "Hackathons", href: "#hackathons" },
] as const;

const NAV_HEIGHT = 68;

/* ── Logo ─────────────────────────────────────────────────────────────── */

function Logo({ onClick }: { onClick: (e: React.MouseEvent) => void }) {
  return (
    <Magnetic strength={0.3}>
      <a
        href="#hero"
        onClick={onClick}
        aria-label="Back to top"
        className="flex select-none items-center gap-2.5"
        style={{ textDecoration: "none" }}
      >
        <motion.span
          className="grid place-items-center rounded-lg"
          style={{
            width: 30,
            height: 30,
            background: "linear-gradient(135deg, rgba(37,99,235,0.22), rgba(124,58,237,0.12))",
            border: "1px solid rgba(96,165,250,0.28)",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            fontWeight: 700,
            color: "#60A5FA",
          }}
          whileHover={{ rotate: 90, scale: 1.08 }}
          transition={SPRING_SNAP}
        >
          Z
        </motion.span>
        <span
          className="grad-text"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            whiteSpace: "nowrap",
            filter: "drop-shadow(0 0 12px rgba(96,165,250,0.4))",
          }}
        >
          Zohaib Ali
        </span>
      </a>
    </Magnetic>
  );
}

/* ── Desktop link ─────────────────────────────────────────────────────── */

interface LinkProps {
  label: string;
  href: string;
  active: boolean;
  onClick: (e: React.MouseEvent) => void;
}

function NavLink({ label, href, active, onClick }: LinkProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Magnetic strength={0.4}>
      <a
        href={href}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative block"
        style={{ padding: "8px 14px", textDecoration: "none", whiteSpace: "nowrap" }}
      >
        {/* Hover capsule — a single element that slides between links. */}
        <AnimatePresence>
          {hovered && !active && (
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{ background: "rgba(255,255,255,0.05)" }}
              initial={{ opacity: 0, scale: 0.86 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.86 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>

        {/* Active capsule — shared layout id makes it glide between sections. */}
        {active && (
          <motion.span
            layoutId="nav-active"
            className="absolute inset-0 rounded-full"
            style={{
              background: "rgba(37,99,235,0.16)",
              border: "1px solid rgba(96,165,250,0.28)",
              boxShadow: "0 0 22px rgba(37,99,235,0.22)",
            }}
            transition={SPRING_SNAP}
          />
        )}

        <span
          className="mono relative"
          style={{
            fontSize: 12,
            letterSpacing: "0.04em",
            color: active ? "#E2E8F0" : hovered ? "#94A3B8" : "#4B5563",
            fontWeight: active ? 600 : 400,
            transition: "color 220ms ease",
          }}
        >
          {label}
        </span>
      </a>
    </Magnetic>
  );
}

/* ── Hamburger ────────────────────────────────────────────────────────── */

function Burger({ open }: { open: boolean }) {
  const bar = {
    display: "block",
    height: 1.5,
    borderRadius: 999,
    background: "#CBD5E1",
  } as const;

  return (
    <div className="flex h-5 w-5 flex-col justify-center gap-[5px]">
      <motion.span style={bar} animate={open ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }} transition={SPRING_SNAP} />
      <motion.span style={bar} animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }} transition={{ duration: 0.18 }} />
      <motion.span style={bar} animate={open ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }} transition={SPRING_SNAP} />
    </div>
  );
}

/* ── Navbar ───────────────────────────────────────────────────────────── */

export default function Navbar() {
  const [active, setActive] = useState<string>("hero");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const reduced = useReducedMotion();

  // Condense on scroll, and hide entirely while scrolling down past the fold
  // so long sections get the full viewport back.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(!open && y > 320 && y > prev);
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close the overlay on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Highlight whichever section owns the middle band of the viewport.
  useEffect(() => {
    const ids = [...LINKS.map((l) => l.href.slice(1)), "contact"];
    const observers = ids
      .map((id) => {
        const el = document.getElementById(id);
        if (!el) return null;
        const obs = new IntersectionObserver(
          ([entry]) => entry.isIntersecting && setActive(id),
          { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
        );
        obs.observe(el);
        return obs;
      })
      .filter(Boolean) as IntersectionObserver[];

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const go = useCallback(
    (e: React.MouseEvent, href: string) => {
      e.preventDefault();
      setOpen(false);
      const el = document.getElementById(href.slice(1));
      if (!el) return;
      // Wait a frame so the body scroll-lock is released before we scroll.
      requestAnimationFrame(() => {
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT,
          behavior: reduced ? "auto" : "smooth",
        });
      });
    },
    [reduced]
  );

  return (
    <>
      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: hidden ? -90 : 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: EASE_OUT }}
        className="fixed inset-x-0 top-0"
        style={{
          zIndex: 9998,
          height: NAV_HEIGHT,
          background: scrolled ? "rgba(6,10,18,0.72)" : "transparent",
          backdropFilter: scrolled ? "blur(22px) saturate(170%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(22px) saturate(170%)" : "none",
          borderBottom: `1px solid ${scrolled ? "rgba(96,165,250,0.11)" : "transparent"}`,
          boxShadow: scrolled ? "0 8px 40px rgba(0,0,0,0.5)" : "none",
          transition: "background 380ms ease, border-color 380ms ease, box-shadow 380ms ease",
        }}
      >
        <nav
          className="mx-auto flex h-full items-center justify-between"
          style={{
            maxWidth: 1200,
            paddingLeft: "clamp(1.25rem, 5vw, 4rem)",
            paddingRight: "clamp(1.25rem, 5vw, 4rem)",
          }}
          aria-label="Primary"
        >
          <Logo onClick={(e) => go(e, "#hero")} />

          <div className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <NavLink
                key={l.href}
                label={l.label}
                href={l.href}
                active={active === l.href.slice(1)}
                onClick={(e) => go(e, l.href)}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <Magnetic strength={0.3}>
                <motion.a
                  href="#contact"
                  onClick={(e) => go(e, "#contact")}
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="mono inline-flex items-center gap-2 rounded-lg"
                  style={{
                    padding: "9px 18px",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    color: "#fff",
                    textDecoration: "none",
                    background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
                    boxShadow: "0 0 24px rgba(37,99,235,0.34)",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 999,
                      background: "#34D399",
                      boxShadow: "0 0 6px #34D399",
                    }}
                  />
                  Get in touch
                </motion.a>
              </Magnetic>
            </div>

            <button
              className="rounded-lg p-2 lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              style={{
                background: open ? "rgba(96,165,250,0.1)" : "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                lineHeight: 0,
              }}
            >
              <Burger open={open} />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* ── Full-screen mobile overlay ─────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 lg:hidden"
            style={{ zIndex: 9997, background: "rgba(4,7,14,0.97)", backdropFilter: "blur(28px)" }}
            initial={{ opacity: 0, clipPath: "circle(0% at 92% 5%)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 92% 5%)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 92% 5%)" }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
          >
            <div
              className="flex h-full flex-col justify-center gap-1"
              style={{ padding: "0 clamp(1.5rem, 8vw, 4rem)" }}
            >
              {LINKS.map((l, i) => {
                const isActive = active === l.href.slice(1);
                return (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    onClick={(e) => go(e, l.href)}
                    initial={{ opacity: 0, x: -32, filter: "blur(8px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: -20, filter: "blur(6px)" }}
                    transition={{ delay: 0.14 + i * 0.06, duration: 0.5, ease: EASE_OUT }}
                    className="flex items-baseline gap-4"
                    style={{ padding: "12px 0", textDecoration: "none" }}
                  >
                    <span
                      className="mono"
                      style={{ fontSize: 11, color: isActive ? "#60A5FA" : "#1E3A5F", minWidth: 24 }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(1.8rem, 8vw, 2.8rem)",
                        fontWeight: 700,
                        letterSpacing: "-0.04em",
                        color: isActive ? "#F1F5F9" : "#475569",
                      }}
                    >
                      {l.label}
                    </span>
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-mobile"
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: 999,
                          background: "#60A5FA",
                          boxShadow: "0 0 10px #60A5FA",
                        }}
                      />
                    )}
                  </motion.a>
                );
              })}

              <motion.a
                href="#contact"
                onClick={(e) => go(e, "#contact")}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ delay: 0.5, duration: 0.5, ease: EASE_OUT }}
                className="mono mt-8 flex items-center justify-center gap-2 rounded-xl"
                style={{
                  padding: "16px 24px",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  color: "#fff",
                  textDecoration: "none",
                  background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
                  boxShadow: "0 0 30px rgba(37,99,235,0.32)",
                }}
              >
                <span
                  style={{ width: 6, height: 6, borderRadius: 999, background: "#34D399", boxShadow: "0 0 6px #34D399" }}
                />
                Get in touch
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
