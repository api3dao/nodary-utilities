const fs = require("fs");
const path = require("path");
const prettier = require("prettier");

const FEEDS_PATH = path.join(__dirname, "..", "data", "feeds.json");
const CHAINS_PATH = path.join(__dirname, "..", "data", "chains.json");

const isWrite = process.argv.includes("--write");

const compare = (a, b) =>
  a.localeCompare(b, "en", { sensitivity: "base" }) ||
  (a < b ? -1 : a > b ? 1 : 0);

const findDuplicates = (keys) => {
  const seen = new Set();
  const duplicates = [];
  for (const key of keys) {
    if (seen.has(key)) duplicates.push(key);
    seen.add(key);
  }
  return duplicates;
};

const validateFile = (filePath, getKey, label) => {
  const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const keys = parsed.map(getKey);
  const sorted = [...parsed].sort((a, b) => compare(getKey(a), getKey(b)));
  const isSorted = keys.every((key, i) => key === getKey(sorted[i]));
  const duplicates = findDuplicates(keys);

  let ok = true;

  if (duplicates.length > 0) {
    console.error(`\n${label} contains duplicate entries:\n`);
    for (const key of duplicates) console.error(`  - ${key}`);
    ok = false;
  }

  if (!isSorted) {
    if (isWrite) {
      const formatted = prettier.format(JSON.stringify(sorted, null, 2), {
        filepath: filePath,
      });
      fs.writeFileSync(filePath, formatted);
      console.log(`Sorted ${label}.`);
    } else {
      console.error(
        `\n${label} is not sorted alphabetically. Run \`pnpm validate:data:fix\` to fix.\n`
      );
      ok = false;
    }
  }

  return ok;
};

const feedsOk = validateFile(
  FEEDS_PATH,
  (feed) => feed.name,
  "data/feeds.json"
);
const chainsOk = validateFile(
  CHAINS_PATH,
  (alias) => alias,
  "data/chains.json"
);

if (feedsOk && chainsOk) {
  console.log("\nData files are sorted and unique.\n");
} else {
  console.error("\nValidation failed.\n");
  process.exit(1);
}
