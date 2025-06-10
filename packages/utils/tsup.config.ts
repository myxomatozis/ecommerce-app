import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    database: "types/database.types.ts",
    supabase: "src/lib/supabase.ts",
    stripe: "src/lib/stripe.ts",
    admin: "src/lib/admin.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["@supabase/supabase-js", "@stripe/stripe-js"],
});
