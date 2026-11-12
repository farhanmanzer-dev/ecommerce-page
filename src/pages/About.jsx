import { useRef } from "react";
import { Link } from "react-router-dom";
import { gsap, useGSAP } from "../lib/gsap";
import SplitWords from "../components/SplitWords";
import Page from "../components/Page";

const STATS = [
  ["30+", "Stories per issue"],
  ["6", "Categories"],
  ["∞", "Ways to see"],
];

export default function About() {
  const root = useRef();
  useGSAP(
    () => {
      gsap.from(".about .word", { yPercent: 110, stagger: 0.04, duration: 1.2, ease: "expo.out", delay: 0.3 });
      gsap.from(".stat", { y: 40, opacity: 0, stagger: 0.12, duration: 1, delay: 0.7, ease: "power3.out" });
    },
    { scope: root }
  );

  return (
    <Page>
      <section className="about" ref={root}>
        <p className="eyebrow">About Lumen</p>
        <h1>
          <SplitWords text="A slow journal for a fast world." />
        </h1>
        <p className="about-copy">
          Lumen collects photographs worth lingering over and gives each one room to breathe. No infinite feed, no noise —
          just images and the stories around them.
        </p>
        <div className="stats">
          {STATS.map(([n, l]) => (
            <div className="stat" key={l}>
              <strong>{n}</strong>
              <span>{l}</span>
            </div>
          ))}
        </div>
        <Link to="/" className="hero-cta">Read the journal →</Link>
      </section>
    </Page>
  );
}
