import dts from "bun-plugin-dts";
import * as fs from "fs";

fs.rmSync("./lib", { recursive: true });

Bun.build({
  format: "esm",
  target: "node",
  outdir: "./lib",
  minify: true,
  entrypoints: ["./src/index.ts"],
  sourcemap: "external",
  plugins: [dts()],
});

Bun.build({
  format: "esm",
  target: "node",
  outdir: "./lib",
  minify: true,
  entrypoints: ["./src/grpc/client.ts"],
  sourcemap: "external",
  plugins: [dts()],
});

Bun.build({
  format: "esm",
  target: "browser",
  outdir: "./lib",
  minify: true,
  entrypoints: ["./src/grpc/client-browser.ts"],
  sourcemap: "external",
  plugins: [dts()],
});
