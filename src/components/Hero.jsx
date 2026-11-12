import { lazy, Suspense, useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import SplitWords from "./SplitWords";

const HeroScene = lazy(() => import("../three/HeroScene"));

export default function Hero({ images }) {
  const root = useRef();

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(".hero .word", { yPercent: 110, duration: 1.4, stagger: 0.06 })
        .from(".hero-eyebrow, .hero-sub, .hero-cta", { y: 24, opacity: 0, duration: 1, stagger: 0.1 }, "-=1.0")
        .from(".hero-canvas", { opacity: 0, scale: 0.92, duration: 2 }, 0);

      // Parallax out as the user scrolls past the hero
      gsap.to(".hero-copy", {
        yPercent: -30,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero-canvas", {
        scale: 1.15,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: root }
  );

  return (
    <section className="hero" ref={root}>
      <div className="hero-canvas">
        <Suspense fallback={null}>
          <HeroScene images={images} />
        </Suspense>
      </div>
      <div className="hero-copy">
        <p className="hero-eyebrow">Issue Nº 12 — Winter 2026</p>
        <h1 className="hero-title">
          <SplitWords text="Stories told" />
          <br />
          <SplitWords text="in light." className="accent" />
        </h1>
        <p className="hero-sub">
          A visual journal of places, people and quiet moments — curated from photographers around the world.
        </p>
        <a href="#stories" className="hero-cta">
          Start reading <span aria-hidden>↓</span>
        </a>
      </div>
      <div className="hero-scroll" aria-hidden>
        <span />
      </div>
    </section>
  );
}
