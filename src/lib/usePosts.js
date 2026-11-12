import { useEffect, useState } from "react";
import { fetchPost, fetchPosts } from "./api";

// Result is tagged with the key it was fetched for, so "loading" is derived
// (a stale result for a previous key counts as loading) instead of set in the effect.
const useAsync = (fn, key) => {
  const [result, setResult] = useState({ key: null, data: null, error: null });
  useEffect(() => {
    let alive = true;
    fn()
      .then((data) => alive && setResult({ key, data, error: null }))
      .catch((error) => alive && setResult({ key, data: null, error }));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const fresh = result.key === key;
  return { data: fresh ? result.data : null, error: fresh ? result.error : null, loading: !fresh };
};

export const usePosts = () => useAsync(fetchPosts, "all");
export const usePost = (id) => useAsync(() => fetchPost(id), id);
