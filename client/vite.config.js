import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  root: "./client",
  build: {
    outDir: "../dist/client",
    emptyOutDir: true,
  },
  server: {
    proxy: {
      // with options
      "/api": {
        target: "http://localhost:3000",
      },
    },
  },
});
