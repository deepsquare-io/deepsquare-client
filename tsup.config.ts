import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/grpc/node/index.ts",
    "src/grpc/browser/index.ts",
  ],
  dts: true, // Generate .d.ts files
  minify: true, // Minify output
  sourcemap: true, // Generate sourcemaps
  treeshake: true, // Remove unused code
  splitting: true, // Split output into chunks
  clean: true, // Clean output directory before building
  platform: "browser",
  outDir: "dist", // Output directory
  format: ["esm"], // Output format(s)
});
