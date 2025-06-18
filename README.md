# @nodary/utilities

Utility helpers & metadata for interacting with the **Nodary** services.

## Install

```bash
npm i @nodary/utilities   # or `yarn add @nodary/utilities`
```

## Quick start

```js
const {
  nodaryChainIds,
  computeFeedId,
  computeSponsorWalletAddress,
} = require("@nodary/utilities");

console.log(nodaryChainIds()); // → [1, 56, 137, 42161, ...]
console.log(computeFeedId("BTC/USD")); // 0xd888b92f9d71afedd0a012622c0d1d5368fc0dc0ff1d30bb16266afcd49c2c17
console.log(computeSponsorWalletAddress("BTC/USD", 1000000, 0, 86400)); // 0x82D117e7AdEd3fC8A9266252899B21C843dDC4B2 for 1% deviation threshold, 0 deviation reference, 1 day heartbeat interval
```

## API surface

• Constants: `nodaryAirnodeAddress`, `nodaryXPub`, `nodaryFeeds`  
• `nodaryChainIds()` – list of EVM chain IDs served by Nodary.  
• `computeEndpointId(endpointName)`  
• `computeTemplateId(feedName)`  
• `computeFeedId(feedName)`  
• `computeSponsorWalletAddress(feedName, deviationThreshold, deviationReference, heartbeatInterval)`
