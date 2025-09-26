// BRSE Training: Refactored to demonstrate common review fixes (Security, Stability, Logic)
const ccxt = require("ccxt");
const moment = require("moment");
const delay = require("delay");

// Security & Compliance: remove hardcoded credentials, use environment variables instead
// Set BINANCE_API_KEY and BINANCE_SECRET in your environment for real trading; sandbox doesn't require them
const binance = new ccxt.binance({
  apiKey: process.env.BINANCE_API_KEY,
  secret: process.env.BINANCE_SECRET,
});
binance.setSandboxMode(true);

// Logic & Algorithm: centralize configuration to avoid magic numbers
const CONFIG = {
  SYMBOL: "BTC/USDT",
  INTERVAL: "1m",
  CANDLE_LIMIT: 5,
  TRADE_SIZE_USD: 100,
  LOOP_DELAY_MS: 60 * 1000,
};

// Coding Style: consistent, structured logging
function logInfo(message, extra = {}) {
  // Keep console output simple for this training, but structured
  console.log(`${moment().format()} | INFO | ${message}`, extra);
}
function logError(message, extra = {}) {
  console.error(`${moment().format()} | ERROR | ${message}`, extra);
}

// Stability: null-checks and guarded computations
async function printBalance(lastBtcPrice) {
  try {
    const balance = await binance.fetchBalance();
    const total = balance && balance.total ? balance.total : {};
    const btc = typeof total.BTC === "number" ? total.BTC : 0;
    const usdt = typeof total.USDT === "number" ? total.USDT : 0;
    const price = typeof lastBtcPrice === "number" ? lastBtcPrice : 0;
    const totalUsd = btc * price + usdt; // fix: remove incorrect "- 1" from original
    logInfo(`Balance: BTC=${btc}, USDT=${usdt}. TotalUSD≈${totalUsd.toFixed(2)}`);
  } catch (error) {
    logError("Failed to fetch/print balance", { message: error.message });
  }
}

// Fetch latest candles and compute average/last prices
async function getMarketSnapshot() {
  try {
    const candles = await binance.fetchOHLCV(
      CONFIG.SYMBOL,
      CONFIG.INTERVAL,
      undefined,
      CONFIG.CANDLE_LIMIT
    );

    const mapped = candles.map((c) => ({
      timestamp: c[0],
      open: c[1],
      high: c[2],
      low: c[3],
      close: c[4],
      volume: c[5],
    }));

    const closes = mapped.map((c) => c.close).filter((n) => typeof n === "number");
    if (closes.length === 0) throw new Error("No close prices available");

    const averageClose = closes.reduce((acc, n) => acc + n, 0) / closes.length;
    const lastClose = closes[closes.length - 1];

    return { averageClose, lastClose };
  } catch (error) {
    logError("Failed to fetch market snapshot", { message: error.message });
    throw error;
  }
}

// Execute a market order with basic error handling
async function executeTrade(side, usdAmount, lastPrice) {
  const quantity = lastPrice > 0 ? usdAmount / lastPrice : 0;
  if (quantity <= 0) {
    logError("Invalid quantity computed", { side, usdAmount, lastPrice });
    return null;
  }

  try {
    const order = await binance.createMarketOrder(CONFIG.SYMBOL, side, quantity);
    logInfo(`Order executed: ${side} ${quantity} BTC at ~${lastPrice}`);
    return order;
  } catch (error) {
    // Stability: surface meaningful error for teaching
    logError("Trade failed", { side, quantity, message: error.message });
    return null;
  }
}

async function tick() {
  const { averageClose, lastClose } = await getMarketSnapshot();
  logInfo(`Avg=${averageClose} | Last=${lastClose}`);

  // Simple strategy for training: if price above average → sell, else buy
  const side = lastClose > averageClose ? "sell" : "buy";
  await executeTrade(side, CONFIG.TRADE_SIZE_USD, lastClose);
  await printBalance(lastClose);
}

let isRunning = true;
async function main() {
  // Stability: graceful shutdown for training demo
  process.on("SIGINT", () => {
    isRunning = false;
    logInfo("Shutting down...");
  });

  while (isRunning) {
    try {
      await tick();
    } catch (error) {
      // Keep loop alive to demonstrate resilience
      logError("Tick failed", { message: error.message });
    }
    await delay(CONFIG.LOOP_DELAY_MS);
  }
}

main();
