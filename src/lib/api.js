// Data layer: Unsplash first (if a key is configured), Picsum as a key-free fallback.
// Every photo is normalised into the same "post" shape so the UI never cares about the source.

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const UNSPLASH = "https://api.unsplash.com";
const PICSUM = "https://picsum.photos";

export const CATEGORIES = ["Travel", "Architecture", "Nature", "Portrait", "Street", "Minimal"];

const TITLE_WORDS = {
  lead: ["Quiet", "Golden", "Distant", "Soft", "Hidden", "Wild", "Silver", "Endless", "Fading", "Still"],
  noun: ["Horizons", "Hours", "Shorelines", "Corners", "Echoes", "Light", "Paths", "Mornings", "Shadows", "Rooms"],
};

const hash = (str) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
};

const capitalise = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const fakeDate = (seed) => {
  const d = new Date(2026, 10, 1);
  d.setDate(d.getDate() - (seed % 320));
  return d.toISOString();
};

const paragraphs = (title, author) => [
  `There is a particular kind of stillness that settles over a frame like "${title}". ${author} found it not by chasing the scene, but by waiting for it — letting the light move until the composition clicked into place.`,
  `Every photograph is an argument about what matters. Here, negative space does as much work as the subject itself, guiding the eye along lines that feel inevitable once you notice them.`,
  `Look closer and the small details start to speak: texture in the shadows, a shift in colour temperature at the edges, the faint grain that reminds you this was a real moment, not a render.`,
  `We keep coming back to images like this because they slow us down. In a feed built for speed, a single well-made photograph is an invitation to stay a little longer.`,
];

const fromUnsplash = (p) => {
  const seed = hash(p.id);
  const title = capitalise(p.alt_description || p.description || "Untitled frame");
  const author = p.user?.name ?? "Unknown";
  return {
    id: `u_${p.id}`,
    title,
    excerpt: p.description ? capitalise(p.description) : `A frame by ${author}, captured with patience and an eye for light.`,
    category: CATEGORIES[seed % CATEGORIES.length],
    image: { thumb: p.urls.small, regular: p.urls.regular, full: p.urls.full },
    width: p.width,
    height: p.height,
    color: p.color || "#222",
    author,
    avatar: p.user?.profile_image?.medium,
    likes: p.likes ?? 0,
    date: p.created_at || fakeDate(seed),
    readTime: 3 + (seed % 6),
    body: paragraphs(title, author),
    source: p.links?.html,
  };
};

const fromPicsum = (p) => {
  const seed = hash(String(p.id));
  const title = `${TITLE_WORDS.lead[seed % 10]} ${TITLE_WORDS.noun[(seed >> 4) % 10]}`;
  const ratio = p.height / p.width;
  const url = (w) => `${PICSUM}/id/${p.id}/${w}/${Math.round(w * ratio)}`;
  return {
    id: `p_${p.id}`,
    title,
    excerpt: `A frame by ${p.author}, captured with patience and an eye for light.`,
    category: CATEGORIES[seed % CATEGORIES.length],
    image: { thumb: url(600), regular: url(1400), full: url(2400) },
    width: p.width,
    height: p.height,
    color: "#1d1d22",
    author: p.author,
    avatar: null,
    likes: 40 + (seed % 900),
    date: fakeDate(seed),
    readTime: 3 + (seed % 6),
    body: paragraphs(title, p.author),
    source: p.url,
  };
};

const getJSON = async (url, headers) => {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
};

const unsplashHeaders = () => ({ Authorization: `Client-ID ${UNSPLASH_KEY}` });

const cache = { list: null, byId: new Map() };

export async function fetchPosts() {
  if (cache.list) return cache.list;
  let posts;
  try {
    if (!UNSPLASH_KEY) throw new Error("No Unsplash key");
    const data = await getJSON(`${UNSPLASH}/photos?per_page=30&order_by=popular`, unsplashHeaders());
    posts = data.map(fromUnsplash);
  } catch {
    const data = await getJSON(`${PICSUM}/v2/list?page=3&limit=30`);
    posts = data.map(fromPicsum);
  }
  posts.forEach((p) => cache.byId.set(p.id, p));
  cache.list = posts;
  return posts;
}

export async function fetchPost(id) {
  if (cache.byId.has(id)) return cache.byId.get(id);
  const [src, rawId] = [id.slice(0, 1), id.slice(2)];
  const post =
    src === "u"
      ? fromUnsplash(await getJSON(`${UNSPLASH}/photos/${rawId}`, unsplashHeaders()))
      : fromPicsum(await getJSON(`${PICSUM}/id/${rawId}/info`));
  cache.byId.set(id, post);
  return post;
}
