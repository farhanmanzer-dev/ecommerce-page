import { useEffect, useRef } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { ScrollTrigger } from "./lib/gsap";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Page from "./components/Page";
import Home from "./pages/Home";
import Post from "./pages/Post";
import About from "./pages/About";

function NotFound() {
  return (
    <Page>
      <div className="notfound">
        <h1>404</h1>
        <p className="muted">This page wandered out of frame.</p>
        <Link to="/" className="hero-cta">← Back to the journal</Link>
      </div>
    </Page>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <>
      <Nav />
      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          // Runs after the old page leaves and before the new one is painted.
          const id = location.hash.slice(1);
          const el = id && document.getElementById(id);
          if (el) el.scrollIntoView();
          else window.scrollTo(0, 0);
          requestAnimationFrame(() => ScrollTrigger.refresh());
        }}
      >
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <HashScroll />
    </>
  );
}

// Same-page hash links (e.g. "Stories" while already on Home)
function HashScroll() {
  const { hash, pathname } = useLocation();
  const lastPath = useRef(pathname);
  useEffect(() => {
    const changedPage = lastPath.current !== pathname;
    lastPath.current = pathname;
    if (!hash) return;
    // Wait for the page transition when arriving from another page
    const t = setTimeout(
      () => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" }),
      changedPage ? 900 : 0
    );
    return () => clearTimeout(t);
  }, [hash, pathname]);
  return null;
}
