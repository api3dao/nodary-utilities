const ethers = require("ethers");
const airnodeAbi = require("@api3/airnode-abi");

const nodaryAirnodeAddress = "0xc52EeA00154B4fF1EbbF8Ba39FDe37F1AC3B9Fd4";

function computeEndpointId(endpointName) {
  const oisTitle = "Nodary";
  return ethers.keccak256(
    ethers.AbiCoder.defaultAbiCoder().encode(
      ["string", "string"],
      [oisTitle, endpointName]
    )
  );
}

function computeFeedId(feedName) {
  const endpointId = computeEndpointId("latestFeedValue");
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

module.exports = { nodaryAirnodeAddress, computeEndpointId, computeFeedId };
