const ccxt = require("ccxt");
const moment = require("moment");
const delay = require("delay");
const binance = new ccxt.binance({
  apiKey: "AYjWFKDxBjYpfDekZrdFzxoxx6QvVHtus2zxUPWJJeoakHu9XEbJziNNSUvDVAm5",
  secret: "Z50fHwrYpKWYtldfTuHKMKj1t9NbzhWqdo7XlGSw2FymXyXepdqcvVa9R2WFwWpq",
});
binance.setSandboxMode(true);

async function printBalance(btcPrice) {
  const balance = await binance.fetchBalance();
  const total = balance.total;

  console.log(`Balance: BTC: ${total.BTC}, USDT: ${total.USDT}`);
  console.log(`Total USD: ${(total.BTC - 1) * btcPrice + total.USDT}. \n`);
}

async function tick() {
  const price = await binance.fetchOHLCV("BTC/USDT", "1m", undefined, 5);

  const bPrices = price.map((element) => {
    return {
      timestamp: moment(element[0]).format(),
      open: element[1],
      high: element[2],
      low: element[3],
      close: element[4],
      volume: element[5],
    };
  });

  const aPrice = bPrices.reduce((acc, price) => acc + price.close, 0) / 5;
  const lPrice = bPrices[bPrices.length - 1].close;

  const direction = lPrice > aPrice ? "sell" : "buy";

  const TRADE_SIZE = 100;
  const quantity = TRADE_SIZE / lPrice;

  console.log(`Average price: ${aPrice}. Last price: ${lPrice}`);
  const order = await binance.createMarketOrder(
    "BTC/USDT",
    direction,
    quantity
  );
  console.log(
    `${moment().format()}: ${direction} ${quantity} BTC at ${lPrice}`
  );
  //   console.log(order);
  printBalance(lPrice);
}
async function main() {
  while (true) {
    await tick();
    await delay(60 * 1000);
  }
}

main();
// printBalance();
