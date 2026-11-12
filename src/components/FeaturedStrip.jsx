import { useRef } from "react";
import { Link } from "react-router-dom";
import { gsap, useGSAP } from "../lib/gsap";

// Pinned section that scrolls horizontally as the user scrolls vertically (GSAP ScrollTrigger).
export default function FeaturedStrip({ posts }) {
  const root = useRef();
  const track = useRef();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 800px)", () => {
        const distance = () => track.current.scrollWidth - window.innerWidth;
        const tween = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        gsap.utils.toArray(".feature img").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -12 },
            {
              xPercent: 12,
              ease: "none",
              scrollTrigger: {
                trigger: img.parentElement,
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [posts.length] }
  );

  return (
    <section className="featured" ref={root}>
      <div className="featured-track" ref={track}>
        <div className="featured-intro">
          <p className="eyebrow">Editor's picks</p>
          <h2>
            This week's <em>finest</em> frames
          </h2>
          <p className="muted">Scroll to drift through the collection →</p>
        </div>
        {posts.map((p, i) => (
          <Link to={`/post/${p.id}`} className="feature" key={p.id}>
            <div className="feature-media" style={{ background: p.color }}>
              <img src={p.image.regular} alt={p.title} loading="lazy" />
            </div>
            <div className="feature-meta">
              <span className="feature-num">0{i + 1}</span>
              <div>
                <h3>{p.title}</h3>
                <p className="muted">by {p.author}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
