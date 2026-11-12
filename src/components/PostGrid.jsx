import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { CATEGORIES } from "../lib/api";
import PostCard from "./PostCard";

const FILTERS = ["All", ...CATEGORIES];

export default function PostGrid({ posts }) {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter(
      (p) =>
        (filter === "All" || p.category === filter) &&
        (!q || p.title.toLowerCase().includes(q) || p.author.toLowerCase().includes(q))
    );
  }, [posts, filter, query]);

  // Distribute into columns for a masonry look that keeps reading order left→right
  const columns = useMemo(() => {
    const cols = [[], [], []];
    visible.forEach((p, i) => cols[i % 3].push({ p, i }));
    return cols;
  }, [visible]);

  return (
    <section className="stories" id="stories">
      <div className="stories-head">
        <div>
          <p className="eyebrow">The journal</p>
          <h2>Latest stories</h2>
        </div>
        <label className="search">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="Search stories or photographers"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>

      <LayoutGroup>
        <div className="filters" role="tablist">
          {FILTERS.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              className={`filter ${filter === f ? "is-active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {filter === f && <motion.span layoutId="filter-pill" className="filter-pill" transition={{ type: "spring", bounce: 0.25, duration: 0.5 }} />}
              <span className="filter-label">{f}</span>
            </button>
          ))}
        </div>
      </LayoutGroup>

      {visible.length === 0 ? (
        <motion.p className="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Nothing matches “{query}”. Try another word.
        </motion.p>
      ) : (
        <div className="masonry">
          {columns.map((col, c) => (
            <div className={`masonry-col masonry-col--${c}`} key={c}>
              <AnimatePresence mode="popLayout">
                {col.map(({ p, i }) => (
                  <PostCard key={p.id} post={p} index={i} />
                ))}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
