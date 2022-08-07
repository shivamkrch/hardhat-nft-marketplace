const { network } = require("hardhat");

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function moveBlocks(amount, sleepAmount = 0) {
  console.log("Moving blocks...");
  for (let i = 0; i < amount; i++) {
    await network.provider.request({ method: "evm_mine", params: [] });
    if (sleepAmount > 0) {
      console.log(`Sleeping for ${sleepAmount}`);
      await sleep(sleepAmount);
    }
  }
}

module.exports = {
  moveBlocks,
  sleep,
};
