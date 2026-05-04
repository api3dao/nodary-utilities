const { CHAINS } = require("@api3/contracts");
const nodaryChainAliases = require("../data/chains.json");

const knownAliases = new Set(CHAINS.map((chain) => chain.alias));

const unknownChainErrors = nodaryChainAliases.filter(
  (alias) => !knownAliases.has(alias)
);

if (unknownChainErrors.length > 0) {
  console.error(
    `\nChain errors (${unknownChainErrors.length}) - in data/chains.json but not present in @api3/contracts CHAINS:\n`
  );
  for (const alias of unknownChainErrors) {
    console.error(`  - ${alias}`);
  }
  console.error("\nValidation failed.\n");
  process.exit(1);
} else {
  console.log(
    "\nAll chains in data/chains.json are present in @api3/contracts.\n"
  );
}
