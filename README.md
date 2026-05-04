# @nodary/utilities

Utility helpers & metadata for interacting with the **Nodary** services.

## Install

```bash
npm i @nodary/utilities   # or `yarn add @nodary/utilities`
```

## Quick start

```js
const {
  api3Contracts,
  nodaryChainIds,
  computeFeedId,
  computeSponsorWalletAddress,
} = require("@nodary/utilities");

console.log(nodaryChainIds()); // → ["1", "56", "137", "42161", ...]
console.log(computeFeedId("BTC/USD")); // 0xd888b92f9d71afedd0a012622c0d1d5368fc0dc0ff1d30bb16266afcd49c2c17
console.log(computeSponsorWalletAddress("BTC/USD", 1000000, 0, 86400)); // 0x82D117e7AdEd3fC8A9266252899B21C843dDC4B2 for 1% deviation threshold, 0 deviation reference, 1 day heartbeat interval
console.log(api3Contracts.CHAINS.length);
```

## API surface

• Constants: `nodaryAirnodeAddress`, `nodaryXPub`, `nodaryFeeds`  
• `api3Contracts` – the [`@api3/contracts`](https://www.npmjs.com/package/@api3/contracts) module re-exported as-is. Use this to access `CHAINS`, `deploymentAddresses`, etc., and avoid pinning a separate `@api3/contracts` version in your project.  
• `nodaryChainIds()` – list of EVM chain IDs served by Nodary.  
• `computeEndpointId(endpointName)`  
• `computeTemplateId(feedName)`  
• `computeFeedId(feedName)`  
• `computeSponsorWalletAddress(feedName, deviationThreshold, deviationReference, heartbeatInterval)`

TypeScript declarations are shipped alongside the JavaScript source (`src/index.d.ts`), so consumers get full type information for both the local helpers and the re-exported `api3Contracts` namespace.
