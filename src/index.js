const ethers = require("ethers");
const airnodeAbi = require("@api3/airnode-abi");
const { deriveWalletAddressFromSponsorAddress } = require("./airnode");
const { nodaryAirnodeAddress, nodaryXPub } = require("../data/metadata.json");
const nodaryEndpoints = require("../data/endpoints.json");
const nodaryFeeds = require("../data/feeds.json");

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

function computeFeedId(feedName) {
  const endpointId = computeEndpointId("feed");
  const parameters = airnodeAbi.encode([
    {
      name: "name",
      type: "string32",
      value: feedName,
    },
  ]);
  const templateId = ethers.solidityPackedKeccak256(
    ["bytes32", "bytes"],
    [endpointId, parameters]
  );
  return ethers.solidityPackedKeccak256(
    ["address", "bytes32"],
    [nodaryAirnodeAddress, templateId]
  );
}

function computeSponsorWalletAddress(
  feedName,
  deviationThreshold,
  deviationReference,
  heartbeatInterval
) {
  const feedId = computeFeedId(feedName);
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
  computeEndpointId,
  computeFeedId,
  computeSponsorWalletAddress,
};
