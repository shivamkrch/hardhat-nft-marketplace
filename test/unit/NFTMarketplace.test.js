const { assert } = require("chai");
const { network, deployments, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("NFT Marketplace Tests", function () {
      let nftMarketplace, basicNft, deployer, user;
      const PRICE = ethers.utils.parseEther("0.1");
      const TOKEN_ID = 0;

      beforeEach(async function () {
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        user = accounts[1];
        await deployments.fixture(["all"]);
        nftMarketplace = await ethers.getContract("NFTMarketplace");
        basicNft = await ethers.getContract("BasicNft");

        await basicNft.mintNft();
        await basicNft.approve(nftMarketplace.address, TOKEN_ID);
      });

      it("lists and can be bought", async function () {
        await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
        const nftMarketplaceUser = nftMarketplace.connect(user);
        await nftMarketplaceUser.buyItem(basicNft.address, TOKEN_ID, {
          value: PRICE,
        });
        const newOwner = await basicNft.ownerOf(TOKEN_ID);
        const deployerProceeds = await nftMarketplace.getProceeds(
          deployer.address
        );
        assert(newOwner.toString() == user.address);
        assert(deployerProceeds.toString() == PRICE.toString());
      });
    });
