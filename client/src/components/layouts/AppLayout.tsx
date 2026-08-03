import { useCallback, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import SceneBackground from "@/components/fx/SceneBackground";
import Cursor from "@/components/fx/Cursor";
import ScrollProgress from "@/components/fx/ScrollProgress";
import Preloader from "@/components/fx/Preloader";
import Navbar from "./Navbar";
import Hero from "./Hero";
import AboutMe from "./AboutMe";
import Skills from "./Skills";
import Projects from "./Projects";
import Internship from "./Internship";
import HackExp from "./HackExp";
import Contact from "./Contact";
import Footer from "./Footer";
import { EASE_OUT } from "@/lib/motion";

/**
 * The landing page shell.
 *
 * All ambient effects live here exactly once — background, cursor, progress
 * rail, preloader — so sections only own their content. Sections render behind
 * the curtain while the preloader counts, then the whole stack is revealed
 * mid-animation rather than starting cold.
 */
export default function AppLayout() {
  const [ready, setReady] = useState(false);
  const reduced = useReducedMotion();
  const onPreloaderDone = useCallback(() => setReady(true), []);

  return (
    <>
      <SceneBackground />
      <Cursor />
      <ScrollProgress />
      <Preloader onDone={onPreloaderDone} />

      <motion.div
        className="relative flex min-h-screen flex-col"
        style={{ zIndex: 1 }}
        initial={reduced ? undefined : { opacity: 0 }}
        animate={{ opacity: ready || reduced ? 1 : 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
      >
        <Navbar />

        <main className="flex-1">
          <Hero />
          <AboutMe />
          <Skills />
          <Projects />
          <Internship />
          <HackExp />
          <Contact />
        </main>

        <Footer />
      </motion.div>
    </>
  );
}
