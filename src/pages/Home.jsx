import { useMemo } from "react";
import { usePosts } from "../lib/usePosts";
import Hero from "../components/Hero";
import FeaturedStrip from "../components/FeaturedStrip";
import PostGrid from "../components/PostGrid";
import Page from "../components/Page";

export default function Home() {
  const { data: posts, error, loading } = usePosts();
  const heroImages = useMemo(() => (posts ?? []).slice(0, 8).map((p) => p.image.thumb), [posts]);

  return (
    <Page>
      <Hero images={heroImages} />
      {loading && <SkeletonGrid />}
      {error && <p className="empty">Couldn’t load stories ({error.message}). Check your connection and refresh.</p>}
      {posts && (
        <>
          <FeaturedStrip posts={posts.slice(0, 6)} />
          <PostGrid posts={posts.slice(6)} />
        </>
      )}
    </Page>
  );
}

function SkeletonGrid() {
  return (
    <section className="stories">
      <div className="masonry">
        {[0, 1, 2].map((c) => (
          <div className="masonry-col" key={c}>
            {[0, 1].map((r) => (
              <div className="skeleton" key={r} style={{ height: 240 + ((c + r) % 3) * 90 }} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
