const { ethers, network } = require("hardhat");
const { moveBlocks } = require("../utils/move-blocks");

const PRICE = ethers.utils.parseEther("0.1");

async function mint() {
  const basicNft = await ethers.getContract("BasicNft");

  console.log("Minting...");
  const mintTx = await basicNft.mintNft();
  const mintTxReceipt = await mintTx.wait(1);
  const tokenId = mintTxReceipt.events[0].args.tokenId;
  console.log(`NFT Address: ${basicNft.address}`);
  console.log(`Got TokenId: ${tokenId}`);

  if (network.config.chainId == "31337") {
    await moveBlocks(2, 1000);
  }
}

mint()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
