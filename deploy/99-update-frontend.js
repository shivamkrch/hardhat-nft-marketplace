const { ethers, network } = require("hardhat");
const fs = require("fs");

const frontEndContractsFile =
  "../nft-marketplace-moralis/constants/networkMapping.json";
const frontEndAbiLocation = "../nft-marketplace-moralis/constants/";

module.exports = async function () {
  if (process.env.UPDATE_FRONTEND) {
    console.log("updating frontend...");
    await updateContractAddresses();
    await updateAbi();
  }
};

async function updateAbi() {
  const nftMarketplace = await ethers.getContract("NFTMarketplace");
  fs.writeFileSync(
    `${frontEndAbiLocation}NFTMarketplace.json`,
    nftMarketplace.interface.format(ethers.utils.FormatTypes.json)
  );

  const basicNft = await ethers.getContract("BasicNft");
  fs.writeFileSync(
    `${frontEndAbiLocation}BasicNft.json`,
    basicNft.interface.format(ethers.utils.FormatTypes.json)
  );
}

async function updateContractAddresses() {
  const nftMarketplace = await ethers.getContract("NFTMarketplace");
  const chainId = network.config.chainId.toString();
  const contractAddresses = JSON.parse(
    fs.readFileSync(frontEndContractsFile, "utf8")
  );
  if (chainId in contractAddresses) {
    if (
      !contractAddresses[chainId]["NFTMarketplace"].includes(
        nftMarketplace.address
      )
    ) {
      contractAddresses[chainId]["NFTMarketplace"].push(nftMarketplace.address);
    }
  } else {
    contractAddresses[chainId] = { NFTMarketplace: [nftMarketplace.address] };
  }
  fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses));
}

module.exports.tags = ["all", "frontend"];
