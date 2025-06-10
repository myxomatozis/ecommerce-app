import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3001,
    open: false, // Don't auto-open since we have main store on 3000
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    assetsDir: "assets",
  },
  define: {
    "process.env": process.env,
  },
});
