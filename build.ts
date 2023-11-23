/* eslint-disable no-console */
import dts from "bun-plugin-dts";
import * as fs from "fs";

fs.rmSync("./dist", { recursive: true });

let result = await Bun.build({
  entrypoints: ["src/index.ts"],
  outdir: "./dist",
  target: "browser",
  plugins: [dts()],
  minify: true,
  sourcemap: "external",
});

if (!result.success) {
  console.error("Build failed");
  for (const message of result.logs) {
    // Bun will pretty print the message object
    console.error(message);
  }
}

result = await Bun.build({
  entrypoints: ["src/grpc/browser.ts"],
  outdir: "./dist",
  target: "browser",
  plugins: [dts()],
  minify: true,
  sourcemap: "external",
});

if (!result.success) {
  console.error("Build failed");
  for (const message of result.logs) {
    // Bun will pretty print the message object
    console.error(message);
  }
}

result = await Bun.build({
  entrypoints: ["src/grpc/node.ts"],
  outdir: "./dist",
  target: "node",
  plugins: [dts()],
  minify: true,
  sourcemap: "external",
});

if (!result.success) {
  console.error("Build failed");
  for (const message of result.logs) {
    // Bun will pretty print the message object
    console.error(message);
  }
}
