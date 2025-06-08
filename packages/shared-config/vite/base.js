import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

/**
 * Base Vite configuration for The Folk projects
 */
export function createBaseViteConfig(options = {}) {
  const {
    // App-specific options
    isLibrary = false,
    libraryName = "",
    entry = "src/index.ts",

    // Build options
    outDir = "dist",
    sourcemap = true,

    // Dev server options
    port = 3000,
    open = true,

    // Path aliases
    aliases = {},

    // External dependencies for libraries
    external = [],

    // Additional plugins
    plugins = [],
  } = options;

  const baseConfig = {
    plugins: [react(), tailwindcss(), ...plugins],

    resolve: {
      alias: {
        "@": resolve(process.cwd(), "./src"),
        ...aliases,
      },
    },

    server: {
      port,
      open,
    },

    build: {
      outDir,
      sourcemap,
    },

    define: {
      "process.env": process.env,
    },
  };

  // Library-specific configuration
  if (isLibrary) {
    baseConfig.build.lib = {
      entry: resolve(process.cwd(), entry),
      name: libraryName,
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "mjs" : "js"}`,
    };

    baseConfig.build.rollupOptions = {
      external: ["react", "react-dom", ...external],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    };
  }

  return defineConfig(baseConfig);
}

/**
 * App-specific Vite configuration
 */
export function createAppViteConfig(options = {}) {
  return createBaseViteConfig({
    port: 3000,
    open: true,
    ...options,
  });
}

/**
 * Library-specific Vite configuration
 */
export function createLibraryViteConfig(options = {}) {
  const { name, ...rest } = options;

  return createBaseViteConfig({
    isLibrary: true,
    libraryName: name,
    entry: "src/index.ts",
    ...rest,
  });
}

export default createBaseViteConfig;
