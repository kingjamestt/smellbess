// Render brand/svg/*.svg to PNG with sharp (from the website's packages).
//   node brand/render.mjs
// Writes brand/png/*.png and the site's link preview, web/src/app/opengraph-image.png.
import { createRequire } from "node:module";
import { mkdirSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const sharp = createRequire(join(root, "../web/package.json"))("sharp");

// Long edge in px. Logos are transparent; avatar and the link card have their own background.
const WIDTH = { wordmark: 2400, lockup: 2400, monogram: 1024, seal: 2048, avatar: 1080 };

mkdirSync(join(root, "png"), { recursive: true });
for (const file of readdirSync(join(root, "svg")).filter((f) => f.endsWith(".svg"))) {
  const svg = readFileSync(join(root, "svg", file));
  const name = file.replace(/\.svg$/, "");
  if (name === "opengraph-image") {
    const out = join(root, "../web/src/app/opengraph-image.png");
    await sharp(svg, { density: 72 }).resize(1200, 630).png().toFile(out);
    console.log("wrote web/src/app/opengraph-image.png");
    continue;
  }
  const width = WIDTH[name.split("-")[0]];
  // Render the vector at the target size (density scales it), not a blurry upscale.
  const { width: w } = await sharp(svg).metadata();
  await sharp(svg, { density: Math.ceil((72 * width) / w) }).resize({ width }).png().toFile(join(root, "png", `${name}.png`));
  console.log(`wrote brand/png/${name}.png`);
}
