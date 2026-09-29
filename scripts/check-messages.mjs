import { readFile } from "node:fs/promises";
import process from "node:process";

const locales = ["en", "fr", "ar"];

function flatten(value, path = "", result = new Set()) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => flatten(item, `${path}[${index}]`, result));
  } else if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      flatten(item, path ? `${path}.${key}` : key, result);
    }
  } else {
    result.add(path);
  }

  return result;
}

const entries = await Promise.all(
  locales.map(async (locale) => {
    const source = await readFile(new URL(`../messages/${locale}.json`, import.meta.url), "utf8");
    return [locale, flatten(JSON.parse(source))];
  })
);

const keySets = Object.fromEntries(entries);
const allKeys = new Set(entries.flatMap(([, keys]) => [...keys]));
let failed = false;

for (const locale of locales) {
  const missing = [...allKeys].filter((key) => !keySets[locale].has(key)).sort();
  const extra = [...keySets[locale]].filter((key) =>
    locales.some((other) => other !== locale && !keySets[other].has(key))
  ).sort();

  if (missing.length || extra.length) {
    failed = true;
    console.error(`${locale}:`);
    missing.forEach((key) => console.error(`  missing ${key}`));
    extra.forEach((key) => console.error(`  extra ${key}`));
  }
}

if (failed) process.exit(1);
console.log(`Message parity passed: ${allKeys.size} leaf keys across ${locales.join(", ")}.`);
