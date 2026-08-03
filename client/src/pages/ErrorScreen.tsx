import { motion } from "framer-motion";
import SceneBackground from "@/components/fx/SceneBackground";
import Cursor from "@/components/fx/Cursor";
import SplitText from "@/components/fx/SplitText";
import GlowButton from "@/components/ui/GlowButton";
import { EASE_OUT } from "@/lib/motion";

interface Props {
  code: string;
  title: string;
  message: string;
  accent?: string;
}

/**
 * Shared shell for 404 / 500. Keeps the error states inside the same visual
 * world as the portfolio instead of dropping to an unstyled fallback.
 */
export default function ErrorScreen({ code, title, message, accent = "#60A5FA" }: Props) {
  return (
    <>
      <SceneBackground />
      <Cursor />

      <main
        className="relative grid min-h-screen place-items-center px-6 text-center"
        style={{ zIndex: 1 }}
      >
        <div className="flex flex-col items-center">
          <motion.span
            className="mono"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            style={{
              padding: "6px 16px",
              borderRadius: 999,
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: accent,
              background: "rgba(96,165,250,0.08)",
              border: "1px solid rgba(96,165,250,0.2)",
            }}
          >
            error {code}
          </motion.span>

          <h1
            className="grad-text"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(4rem, 20vw, 10rem)",
              fontWeight: 800,
              letterSpacing: "-0.06em",
              lineHeight: 1,
              margin: "22px 0 8px",
            }}
          >
            <SplitText text={code} immediate stagger={0.07} />
          </h1>

          <motion.h2
            initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.35, ease: EASE_OUT }}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.2rem, 4vw, 1.7rem)",
              fontWeight: 700,
              color: "#F1F5F9",
              letterSpacing: "-0.035em",
            }}
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: EASE_OUT }}
            style={{ margin: "14px 0 32px", maxWidth: 420, color: "#64748B", lineHeight: 1.8, fontSize: 15 }}
          >
            {message}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: EASE_OUT }}
          >
            <GlowButton href="/">
              <span aria-hidden="true">←</span> Back to portfolio
            </GlowButton>
          </motion.div>
        </div>
      </main>
    </>
  );
}
