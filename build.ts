import dts from "bun-plugin-dts";
import * as fs from "fs";

fs.rmSync("./dist", { recursive: true });

Bun.build({
  format: "esm",
  target: "browser",
  outdir: "./dist",
  minify: true,
  entrypoints: ["./src/index.ts"],
  sourcemap: "external",
  plugins: [dts()],
});

fs.mkdirSync("./dist/grpc", { recursive: true });

Bun.build({
  format: "esm",
  target: "node",
  outdir: "./dist/grpc/node",
  minify: true,
  entrypoints: ["./src/grpc/node/index.ts"],
  sourcemap: "external",
  plugins: [dts()],
});

Bun.build({
  format: "esm",
  target: "browser",
  outdir: "./dist/grpc/browser",
  minify: true,
  entrypoints: ["./src/grpc/browser/index.ts"],
  sourcemap: "external",
  plugins: [dts()],
});
