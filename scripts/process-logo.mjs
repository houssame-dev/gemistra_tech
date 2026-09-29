import sharp from "sharp";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const INPUT = path.join(root, "public/logos/gemistra-logo-raw.png");
const OUTPUT = path.join(root, "public/logos/gemistra-logo.png");
const THRESHOLD = 30;

async function process() {
  const image = sharp(INPUT);
  const { width, height, channels } = await image.metadata();

  const raw = await image.raw().toBuffer();
  const out = Buffer.alloc(raw.length);

  for (let i = 0; i < raw.length; i += channels) {
    const r = raw[i];
    const g = raw[i + 1];
    const b = raw[i + 2];

    if (channels === 4) {
      const a = raw[i + 3];

      if (r < THRESHOLD && g < THRESHOLD && b < THRESHOLD) {
        out[i] = 0;
        out[i + 1] = 0;
        out[i + 2] = 0;
        out[i + 3] = 0;
      } else if (r < THRESHOLD * 2 && g < THRESHOLD * 2 && b < THRESHOLD * 2) {
        const factor = Math.max(r, g, b) / (THRESHOLD * 2);
        out[i] = r;
        out[i + 1] = g;
        out[i + 2] = b;
        out[i + 3] = Math.round(a * factor);
      } else {
        out[i] = r;
        out[i + 1] = g;
        out[i + 2] = b;
        out[i + 3] = a;
      }
    } else {
      if (r < THRESHOLD && g < THRESHOLD && b < THRESHOLD) {
        out[i] = 0;
        out[i + 1] = 0;
        out[i + 2] = 0;
        if (channels > 3) out[i + 3] = 0;
      } else if (r < THRESHOLD * 2 && g < THRESHOLD * 2 && b < THRESHOLD * 2) {
        const factor = Math.max(r, g, b) / (THRESHOLD * 2);
        out[i] = r;
        out[i + 1] = g;
        out[i + 2] = b;
        if (channels > 3) out[i + 3] = Math.round(out[i + 3] * factor);
      } else {
        out[i] = r;
        out[i + 1] = g;
        out[i + 2] = b;
      }
    }
  }

  await sharp(out, { raw: { width, height, channels } })
    .png()
    .toFile(OUTPUT);

  console.log(`Processed: ${width}x${height}, ${channels} channels`);
  console.log(`Output: ${OUTPUT}`);
}

process().catch((err) => {
  console.error(err);
  process.exit(1);
});
