import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "motion/react";
import { usePost, usePosts } from "../lib/usePosts";
import { gsap, useGSAP } from "../lib/gsap";
import SplitWords from "../components/SplitWords";
import Page from "../components/Page";

const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

export default function Post() {
  const { id } = useParams();
  const { data: post, error, loading } = usePost(id);

  return (
    <Page>
      {loading && <div className="post-loading"><div className="skeleton" style={{ height: "70vh" }} /></div>}
      {error && (
        <div className="notfound">
          <h1>Story not found</h1>
          <Link to="/" className="hero-cta">← Back to the journal</Link>
        </div>
      )}
      {post && <Article key={post.id} post={post} />}
    </Page>
  );
}

function Article({ post }) {
  const root = useRef();
  const cover = useRef();
  const [zoom, setZoom] = useState(false);
  const [liked, setLiked] = useState(false);
  const { data: all } = usePosts();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
  const { scrollYProgress: coverProgress } = useScroll({ target: cover, offset: ["start start", "end start"] });
  const coverY = useTransform(coverProgress, [0, 1], ["0%", "25%"]);

  useGSAP(
    () => {
      gsap.from(".post-title .word", { yPercent: 110, duration: 1.3, stagger: 0.05, ease: "expo.out", delay: 0.4 });
      gsap.from(".post-meta > *", { opacity: 0, y: 16, stagger: 0.08, delay: 0.8, duration: 0.8 });
      gsap.utils.toArray(".post-body p").forEach((p) =>
        gsap.from(p, { opacity: 0, y: 40, duration: 1, ease: "power3.out", scrollTrigger: { trigger: p, start: "top 88%" } })
      );
    },
    { scope: root }
  );

  const related = (all ?? []).filter((p) => p.id !== post.id && p.category === post.category).slice(0, 3);

  return (
    <article className="post" ref={root}>
      <motion.div className="progress" style={{ scaleX: progress }} />

      <header className="post-cover" ref={cover} style={{ background: post.color }}>
        <motion.img src={post.image.regular} alt={post.title} style={{ y: coverY }} onClick={() => setZoom(true)} />
        <div className="post-cover-shade" />
        <div className="post-cover-copy">
          <Link to="/" className="back">← Journal</Link>
          <span className="chip">{post.category}</span>
          <h1 className="post-title"><SplitWords text={post.title} /></h1>
          <div className="post-meta">
            {post.avatar && <img src={post.avatar} alt="" className="avatar" />}
            <span>{post.author}</span>
            <span>·</span>
            <span>{fmtDate(post.date)}</span>
            <span>·</span>
            <span>{post.readTime} min read</span>
          </div>
        </div>
      </header>

      <div className="post-body">
        <p className="lead">{post.excerpt}</p>
        {post.body.map((t, i) => <p key={i}>{t}</p>)}

        <div className="post-actions">
          <motion.button
            className={`like ${liked ? "is-liked" : ""}`}
            whileTap={{ scale: 0.85 }}
            onClick={() => setLiked((v) => !v)}
          >
            <motion.span animate={{ scale: liked ? [1, 1.5, 1] : 1 }} transition={{ duration: 0.4 }}>♥</motion.span>
            {post.likes + (liked ? 1 : 0)}
          </motion.button>
          <button className="ghost" onClick={() => setZoom(true)}>View full image</button>
          {post.source && <a className="ghost" href={post.source} target="_blank" rel="noreferrer">Original ↗</a>}
        </div>
      </div>

      {related.length > 0 && (
        <section className="related">
          <h2>More in {post.category}</h2>
          <div className="related-grid">
            {related.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link to={`/post/${r.id}`} className="related-card">
                  <div className="related-media" style={{ background: r.color }}><img src={r.image.thumb} alt={r.title} loading="lazy" /></div>
                  <h3>{r.title}</h3>
                  <p className="muted">{r.author}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <AnimatePresence>
        {zoom && (
          <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setZoom(false)}>
            <motion.img
              src={post.image.full}
              alt={post.title}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
            <button className="lightbox-close" aria-label="Close">✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
