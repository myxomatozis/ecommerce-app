import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import fs from "fs";
import react from "@vitejs/plugin-react";
import path from "path";

const fontPlugin = () => ({
  name: "serve-shared-fonts",
  configureServer(server) {
    server.middlewares.use("/fonts", (req, res, next) => {
      const fontPath = resolve(
        __dirname,
        "../../packages/config/fonts",
        req.url.slice(1)
      );

      if (fs.existsSync(fontPath)) {
        res.setHeader("Content-Type", "font/woff2");
        res.setHeader("Cache-Control", "max-age=31536000");
        fs.createReadStream(fontPath).pipe(res);
      } else {
        next();
      }
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), fontPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    open: true,
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
