const ethers = require("ethers");
const airnodeAbi = require("@api3/airnode-abi");
const { api3Contracts } = require("@api3/dapi-management");
const { deriveWalletAddressFromSponsorAddress } = require("./airnode");
const { nodaryAirnodeAddress, nodaryXPub } = require("../data/metadata.json");
const nodaryEndpoints = require("../data/endpoints.json");
const nodaryFeeds = require("../data/feeds.json");
const nodaryChainAliases = require("../data/chains.json");

const ONE_DAY_IN_SECONDS = 24 * 60 * 60;

function nodaryChainIds() {
  return nodaryChainAliases
    .map((nodaryChainAlias) => {
      const chain = api3Contracts.CHAINS.find(
        (chain) => chain.alias === nodaryChainAlias
      );
      if (!chain) {
        throw new Error(`Chain ${nodaryChainAlias} does not exist`);
      }
      return chain.id;
    })
    .sort((a, b) => parseInt(a) - parseInt(b));
}

function convertPercentagesToAbsoluteValues(valueInPercentages) {
  return valueInPercentages * 1e6;
}

function computeEndpointId(endpointName) {
  const oisTitle = "Nodary";
  if (
    !nodaryEndpoints
      .map((nodaryEndpoint) => nodaryEndpoint.name)
      .includes(endpointName)
  ) {
    throw new Error(`Endpoint with name ${endpointName} does not exist`);
  }
  return ethers.keccak256(
    ethers.AbiCoder.defaultAbiCoder().encode(
      ["string", "string"],
      [oisTitle, endpointName]
    )
  );
}

function computeTemplateId(feedName) {
  const endpointId = computeEndpointId("feed");
  if (!nodaryFeeds.map((nodaryFeed) => nodaryFeed.name).includes(feedName)) {
    throw new Error(`Feed with name ${feedName} does not exist`);
  }
  const parameters = airnodeAbi.encode([
    {
      name: "name",
      type: "string32",
      value: feedName,
    },
  ]);
  return ethers.solidityPackedKeccak256(
    ["bytes32", "bytes"],
    [endpointId, parameters]
  );
}

function computeFeedId(feedName) {
  return ethers.solidityPackedKeccak256(
    ["address", "bytes32"],
    [nodaryAirnodeAddress, computeTemplateId(feedName)]
  );
}

function computeSponsorWalletAddress(
  feedName,
  deviationThreshold,
  deviationReference,
  heartbeatInterval
) {
  const feedId = computeFeedId(feedName);
  if (
    !nodaryFeeds
      .find((nodaryFeed) => nodaryFeed.name === feedName)
      .deviationThresholdsInPercentages.map((deviationThresholdInPercentages) =>
        convertPercentagesToAbsoluteValues(deviationThresholdInPercentages)
      )
      .includes(deviationThreshold)
  ) {
    throw new Error(
      `Feed with name ${feedName} does not support deviation threshold ${deviationThreshold}`
    );
  }
  if (deviationReference !== 0) {
    throw new Error(
      `Feed with name ${feedName} does not support deviation reference ${deviationReference}`
    );
  }
  if (heartbeatInterval !== ONE_DAY_IN_SECONDS) {
    throw new Error(
      `Feed with name ${feedName} does not support heartbeat interval ${heartbeatInterval}`
    );
  }
  const encodedConditionParameters = ethers.AbiCoder.defaultAbiCoder().encode(
    ["uint256", "int224", "uint256"],
    [deviationThreshold, deviationReference, heartbeatInterval]
  );
  const sponsorAddress = ethers
    .solidityPackedKeccak256(
      ["bytes32", "bytes"],
      [feedId, encodedConditionParameters]
    )
    .substring(0, 42);
  return deriveWalletAddressFromSponsorAddress(nodaryXPub, sponsorAddress);
}

module.exports = {
  nodaryAirnodeAddress,
  nodaryXPub,
  nodaryFeeds,
  nodaryChainIds,
  computeEndpointId,
  computeTemplateId,
  computeFeedId,
  computeSponsorWalletAddress,
};
