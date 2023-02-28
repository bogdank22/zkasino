const { Contract, providers, utils } = require("ethers");
const { createServer } = require("http");
const next = require("next");
const bodyParser = require("body-parser");
const SaveLives = require("./api/saveLive");
const contracts = require("./const/abi.json");
const connectDB = require("./config/db");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 5000;

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

//connect DB
connectDB();

const provider = new providers.JsonRpcProvider(
  "https://data-seed-prebsc-1-s2.binance.org:8545"
);

const slotContract = new Contract(
  contracts.slotContract.address,
  contracts.slotContract.abi,
  provider
);

const slotListener = async (
  playerAddress,
  wager,
  payout,
  tokenAddress,
  slotIds,
  multipliers,
  payouts,
  numGames
) => {
  try {
    console.log("------------------------slotListener--------------");
    console.log("playerAddress", playerAddress);
    console.log("wager", utils.formatEther(wager));
    console.log("payout", utils.formatEther(payout));
    console.log("tokenAddress", tokenAddress);
    console.log("slotIdlength", slotIds.length);
    console.log("multipliersLength", multipliers.length);
    console.log("payoutsLength", payouts.length);
    console.log("numGames", numGames);

    SaveLives({
      playerAddress: playerAddress,
      wager: utils.formatEther(wager),
      numbets: slotIds.length,
      multiplier: utils.formatEther(payout) / (utils.formatEther(wager) * slotIds.length),
      profit: utils.formatEther(payout) - utils.formatEther(wager) * slotIds.length,
    });
  } catch (err) {
    console.log(err);
  }
};

const InitializeContract = async () => {
  console.log("------------------InitializeContract-------------------------");
  slotContract.on("Slots_Outcome_Event", slotListener);
};

InitializeContract();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
