import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/grpc/node/index.ts",
    "src/grpc/browser/index.ts",
  ],
  splitting: false,
  sourcemap: true,
  minify: true,
  clean: true,
});
