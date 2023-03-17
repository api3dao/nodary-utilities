const ethers = require("ethers");

const PROTOCOL_ID_AIRSEEKER = 5;

function deriveWalletPathFromSponsorAddress(
  sponsorAddress,
  protocolId = PROTOCOL_ID_AIRSEEKER
) {
  const sponsorAddressBN = BigInt(sponsorAddress);
  const paths = [];
  for (let i = 0; i < 6; i++) {
    const shiftedSponsorAddressBN = sponsorAddressBN >> BigInt(31 * i);
    paths.push((shiftedSponsorAddressBN & BigInt(0x7fffffff)).toString());
  }
  return `${protocolId}/${paths.join("/")}`;
}

function deriveWalletAddressFromSponsorAddress(xpub, sponsorAddress) {
  const airnodeHdNode = ethers.HDNodeWallet.fromExtendedKey(xpub);
  return airnodeHdNode.derivePath(
    deriveWalletPathFromSponsorAddress(sponsorAddress)
  ).address;
}

module.exports = { deriveWalletAddressFromSponsorAddress };
