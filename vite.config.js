import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // The Three.js hero is lazy-loaded into its own chunk; the default 500 kB warning is noise here.
    chunkSizeWarningLimit: 1000,
  },
});
