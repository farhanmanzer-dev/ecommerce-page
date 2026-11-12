import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default function PostCard({ post, index }) {
  const ref = useRef();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotX = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 200, damping: 20 });
  const rotY = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 200, damping: 20 });

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.article
      layout
      ref={ref}
      className="card"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.6, delay: (index % 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 900 }}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      <Link to={`/post/${post.id}`}>
        <div className="card-media" style={{ background: post.color, aspectRatio: `${post.width} / ${post.height}` }}>
          <img src={post.image.thumb} alt={post.title} loading="lazy" />
          <span className="chip chip--floating">{post.category}</span>
        </div>
        <div className="card-body">
          <h3>{post.title}</h3>
          <p className="card-meta">
            {post.author} · {fmtDate(post.date)} · {post.readTime} min
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
