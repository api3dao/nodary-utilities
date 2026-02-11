const { getChains, dapis } = require("@api3/dapi-management");
const nodaryFeeds = require("../data/feeds.json");
const nodaryChainAliases = require("../data/chains.json");

const ACTIVE_STAGES = ["active", "deprecated"];

const feedErrors = [];
const feedWarnings = [];
const chainErrors = [];
const chainWarnings = [];

// --- Feed Validation ---

const activeDapiNames = dapis
  .filter((dapi) => ACTIVE_STAGES.includes(dapi.stage))
  .map((dapi) => dapi.name);
const feedNamesInRepo = nodaryFeeds.map((feed) => feed.name);

const feedsNotActive = feedNamesInRepo.filter(
  (name) => !activeDapiNames.includes(name)
);
for (const name of feedsNotActive) {
  feedWarnings.push(name);
}

const missingFeeds = activeDapiNames.filter(
  (name) => !feedNamesInRepo.includes(name)
);
for (const name of missingFeeds) {
  feedErrors.push(name);
}

// --- Chain Validation ---

const activeChainAliases = getChains()
  .filter((chain) => ACTIVE_STAGES.includes(chain.stage))
  .filter((chain) => !chain.alias.endsWith("-testnet"))
  .map((chain) => chain.alias);

const chainsNotActive = nodaryChainAliases.filter(
  (alias) => !activeChainAliases.includes(alias)
);
for (const alias of chainsNotActive) {
  chainWarnings.push(alias);
}

const missingChains = activeChainAliases.filter(
  (alias) => !nodaryChainAliases.includes(alias)
);
for (const alias of missingChains) {
  chainErrors.push(alias);
}

// --- Output ---

const hasErrors = feedErrors.length > 0 || chainErrors.length > 0;
const hasWarnings = feedWarnings.length > 0 || chainWarnings.length > 0;

if (feedWarnings.length > 0) {
  console.log(
    `\nFeed warnings (${feedWarnings.length}) - in data/feeds.json but not active in @api3/dapi-management:\n`
  );
  for (const name of feedWarnings) {
    console.log(`  - ${name}`);
  }
}

if (chainWarnings.length > 0) {
  console.log(
    `\nChain warnings (${chainWarnings.length}) - in data/chains.json but not active in @api3/dapi-management:\n`
  );
  for (const alias of chainWarnings) {
    console.log(`  - ${alias}`);
  }
}

if (feedErrors.length > 0) {
  console.error(
    `\nFeed errors (${feedErrors.length}) - active in @api3/dapi-management but missing from data/feeds.json:\n`
  );
  for (const name of feedErrors) {
    console.error(`  - ${name}`);
  }
}

if (chainErrors.length > 0) {
  console.error(
    `\nChain errors (${chainErrors.length}) - active in @api3/dapi-management but missing from data/chains.json:\n`
  );
  for (const alias of chainErrors) {
    console.error(`  - ${alias}`);
  }
}

if (hasErrors) {
  console.error("\nValidation failed.\n");
  process.exit(1);
} else if (hasWarnings) {
  console.log("\nValidation passed with warnings.\n");
} else {
  console.log("\nAll feeds and chains are covered.\n");
}
