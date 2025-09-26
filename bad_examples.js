// ========================================
// FILE CODE VỚI CÁC LỖI PHỔ BIẾN - DÙNG ĐỂ MINH HỌA CODE REVIEW
// ========================================

const ccxt = require("ccxt");
const moment = require("moment");
const delay = require("delay");

// ❌ LỖI 1: HARDCODED CREDENTIALS (Security & Compliance)
const binance = new ccxt.binance({
  apiKey: "AYjWFKDxBjYpfDekZrdFzxoxx6QvVHtus2zxUPWJJeoakHu9XEbJziNNSUvDVAm5",
  secret: "Z50fHwrYpKWYtldfTuHKMKj1t9NbzhWqdo7XlGSw2FymXyXepdqcvVa9R2WFwWpq",
});

// ❌ LỖI 2: HARDCODED VALUES (Logic & Algorithm)
const TRADE_SIZE = 100;
const DELAY_TIME = 60 * 1000;
const BTC_THRESHOLD = 50000;

// ❌ LỖI 3: POOR NAMING (Coding Style & Clean Code)
let a = 0; // Không rõ ràng
let b = []; // Không rõ ràng
let c = null; // Không rõ ràng

// ❌ LỖI 4: DEAD CODE (Coding Style & Clean Code)
function unusedFunction() {
  const unused = "This function is never called";
  return unused;
}

// ❌ LỖI 5: CODE DUPLICATION (Coding Style & Clean Code)
function buyBTC() {
  const order = binance.createMarketOrder("BTC/USDT", "buy", 0.001);
  console.log("Buy 0.001 BTC");
  return order;
}

function sellBTC() {
  const order = binance.createMarketOrder("BTC/USDT", "sell", 0.001);
  console.log("Sell 0.001 BTC");
  return order;
}

// ❌ LỖI 6: COMPLEX CONDITIONALS (Logic & Algorithm)
function shouldTrade(price, balance, isTrading, marketOpen, userRole) {
  if (price > 50000 && balance > 100 && !isTrading && marketOpen && userRole === 'trader') {
    return true;
  }
  return false;
}

// ❌ LỖI 7: INEFFICIENT ALGORITHM (Logic & Algorithm)
function findMaxPrice(prices) {
  let max = prices[0];
  for (let i = 0; i < prices.length; i++) {
    for (let j = i + 1; j < prices.length; j++) {
      if (prices[j] > max) {
        max = prices[j];
      }
    }
  }
  return max;
}

// ❌ LỖI 8: RACE CONDITION (Concurrency & Database)
let globalBalance = 1000;

async function withdrawMoney(amount) {
  if (globalBalance > amount) {
    await delay(100); // Giả lập thời gian xử lý
    globalBalance -= amount; // Có thể bị trừ nhiều lần nếu gọi đồng thời
    return true;
  }
  return false;
}

// ❌ LỖI 9: NO ERROR HANDLING (Stability & Crash)
async function fetchPrice() {
  const price = await binance.fetchOHLCV("BTC/USDT", "1m", undefined, 5);
  return price; // Có thể crash nếu API lỗi
}

// ❌ LỖI 10: NULL POINTER EXCEPTION (Stability & Crash)
function calculateTotal(balance) {
  return balance.total.BTC * 50000; // Có thể crash nếu balance.total là null
}

// ❌ LỖI 11: MEMORY LEAK (Stability & Crash)
const intervals = [];

function startTrading() {
  const interval = setInterval(() => {
    console.log("Trading...");
  }, 1000);
  intervals.push(interval); // Không bao giờ clear
}

// ❌ LỖI 12: INFINITE LOOP (Stability & Crash)
async function mainLoop() {
  while (true) {
    await fetchPrice();
    // Không có delay, có thể gây crash
  }
}

// ❌ LỖI 13: DATA INCONSISTENCY (Concurrency & Database)
let cachedPrice = null;

function getPrice() {
  if (cachedPrice) {
    return cachedPrice; // Có thể là dữ liệu cũ
  }
  cachedPrice = fetchPrice();
  return cachedPrice;
}

// ❌ LỖI 14: NO AUTHORIZATION CHECK (Security & Compliance)
function deleteUser(userId) {
  // Ai cũng có thể xóa user
  return db.deleteUser(userId);
}

// ❌ LỖI 15: DATA EXPOSURE (Security & Compliance)
function getUserInfo(userId) {
  const user = db.getUser(userId);
  return {
    id: user.id,
    email: user.email,
    password: user.password, // Lộ password
    balance: user.balance,
    secretKey: user.secretKey // Lộ secret key
  };
}

// ❌ LỖI 16: SQL INJECTION (Security & Compliance)
function getUserBalance(userId) {
  const query = `SELECT balance FROM users WHERE id = ${userId}`;
  return db.query(query); // Có thể bị SQL injection
}

// ❌ LỖI 17: XSS VULNERABILITY (Security & Compliance)
function displayMessage(message) {
  document.getElementById('message').innerHTML = message;
  // Có thể chạy script độc hại
}

// ❌ LỖI 18: NO INPUT VALIDATION (Stability & Crash)
function processOrder(quantity, price) {
  const total = quantity * price;
  return total; // Không kiểm tra quantity và price có hợp lệ không
}

// ❌ LỖI 19: INCONSISTENT ERROR HANDLING (Stability & Crash)
async function trade() {
  try {
    const order = await binance.createMarketOrder("BTC/USDT", "buy", 0.001);
    return order;
  } catch (error) {
    // Không xử lý lỗi cụ thể
    throw error;
  }
}

// ❌ LỖI 20: GLOBAL STATE MUTATION (Concurrency & Database)
let isProcessing = false;

async function processTrade() {
  isProcessing = true;
  // Logic xử lý
  // Quên set isProcessing = false nếu có lỗi
}

// ❌ LỖI 21: INEFFICIENT DATABASE QUERY (Concurrency & Database)
function getAllUsers() {
  // Lấy tất cả user thay vì chỉ lấy cần thiết
  return db.query("SELECT * FROM users");
}

// ❌ LỖI 22: NO RATE LIMITING (Stability & Crash)
async function aggressiveTrading() {
  for (let i = 0; i < 1000; i++) {
    await binance.createMarketOrder("BTC/USDT", "buy", 0.001);
    // Không có delay, có thể bị rate limit
  }
}

// ❌ LỖI 23: INCONSISTENT LOGGING (Coding Style & Clean Code)
function logTrade(action, amount) {
  console.log("Trade:", action, amount); // Không có timestamp, format không nhất quán
}

// ❌ LỖI 24: MAGIC NUMBERS (Logic & Algorithm)
function calculateFee(amount) {
  return amount * 0.001; // Magic number 0.001
}

// ❌ LỖI 25: NO TRANSACTION (Concurrency & Database)
async function transferMoney(from, to, amount) {
  await db.updateBalance(from, -amount);
  await db.updateBalance(to, +amount);
  // Nếu lỗi ở bước 2, tiền sẽ mất
}

// ❌ LỖI 26: INCONSISTENT NAMING CONVENTION (Coding Style & Clean Code)
const user_name = "john"; // snake_case
const userEmail = "john@example.com"; // camelCase
const user_balance = 1000; // snake_case

// ❌ LỖI 27: NO INPUT SANITIZATION (Security & Compliance)
function searchUser(query) {
  const sql = `SELECT * FROM users WHERE name LIKE '%${query}%'`;
  return db.query(sql); // Có thể bị SQL injection
}

// ❌ LỖI 28: HARDCODED CONFIGURATION (Logic & Algorithm)
function getApiUrl() {
  return "https://api.binance.com"; // Hardcoded URL
}

// ❌ LỖI 29: NO TIMEOUT HANDLING (Stability & Crash)
async function fetchData() {
  const data = await binance.fetchOHLCV("BTC/USDT", "1m", undefined, 5);
  return data; // Không có timeout, có thể hang
}

// ❌ LỖI 30: INCONSISTENT RETURN TYPES (Coding Style & Clean Code)
function getBalance(userId) {
  if (userId === null) {
    return null; // Trả về null
  }
  if (userId === undefined) {
    return undefined; // Trả về undefined
  }
  return { balance: 1000 }; // Trả về object
}

// ❌ LỖI 31: NO VALIDATION OF EXTERNAL DATA (Stability & Crash)
function processApiResponse(response) {
  return response.data.prices[0].value; // Có thể crash nếu structure không đúng
}

// ❌ LỖI 32: INCONSISTENT ERROR MESSAGES (Coding Style & Clean Code)
function validateInput(input) {
  if (!input) {
    throw new Error("Input is required");
  }
  if (input.length < 3) {
    throw new Error("Input too short");
  }
  if (input.length > 100) {
    throw new Error("ERROR: INPUT TOO LONG"); // Format khác
  }
}

// ❌ LỖI 33: NO CLEANUP OF RESOURCES (Stability & Crash)
function createConnection() {
  const connection = db.connect();
  // Không có cleanup, connection sẽ leak
  return connection;
}

// ❌ LỖI 34: INCONSISTENT ASYNC/AWAIT (Coding Style & Clean Code)
async function mixedAsync() {
  const data1 = await fetchData();
  const data2 = fetchData(); // Quên await
  return { data1, data2 };
}

// ❌ LỖI 35: NO BOUNDARY CHECKING (Stability & Crash)
function getArrayElement(arr, index) {
  return arr[index]; // Có thể crash nếu index out of bounds
}

// ❌ LỖI 36: INCONSISTENT DATE HANDLING (Logic & Algorithm)
function formatDate(date) {
  return moment(date).format("YYYY-MM-DD"); // Không kiểm tra date có hợp lệ không
}

// ❌ LỖI 37: NO CACHING STRATEGY (Concurrency & Database)
function expensiveCalculation(data) {
  // Tính toán phức tạp mỗi lần gọi
  return data.reduce((acc, item) => acc + item.value * Math.random(), 0);
}

// ❌ LỖI 38: INCONSISTENT NULL HANDLING (Stability & Crash)
function processUser(user) {
  if (user) {
    return user.name.toUpperCase();
  }
  return "Unknown"; // Không xử lý trường hợp user.name là null
}

// ❌ LỖI 39: NO CONCURRENCY CONTROL (Concurrency & Database)
let counter = 0;

async function incrementCounter() {
  counter++; // Race condition
  return counter;
}

// ❌ LỖI 40: INCONSISTENT ENCODING (Security & Compliance)
function processText(text) {
  return text.toLowerCase(); // Không xử lý encoding, có thể gây lỗi với Unicode
}

// ❌ LỖI 41: NO VERSION CONTROL (Coding Style & Clean Code)
function getApiVersion() {
  return "v1"; // Hardcoded version
}

// ❌ LỖI 42: INCONSISTENT LOGGING LEVELS (Coding Style & Clean Code)
function logInfo(message) {
  console.log(message); // Không có level
}

function logError(message) {
  console.error(message); // Không có level
}

// ❌ LỖI 43: NO CIRCUIT BREAKER (Stability & Crash)
async function callExternalApi() {
  try {
    return await binance.fetchOHLCV("BTC/USDT", "1m", undefined, 5);
  } catch (error) {
    // Không có circuit breaker, sẽ retry liên tục
    throw error;
  }
}

// ❌ LỖI 44: INCONSISTENT DATA TYPES (Coding Style & Clean Code)
function processAmount(amount) {
  if (typeof amount === 'string') {
    return parseFloat(amount);
  }
  if (typeof amount === 'number') {
    return amount;
  }
  return 0; // Không xử lý các type khác
}

// ❌ LỖI 45: NO BACKUP STRATEGY (Concurrency & Database)
function saveImportantData(data) {
  db.save(data); // Không có backup, mất data là mất luôn
}

// ❌ LỖI 46: INCONSISTENT RETRY LOGIC (Stability & Crash)
async function retryOperation() {
  try {
    return await binance.createMarketOrder("BTC/USDT", "buy", 0.001);
  } catch (error) {
    // Retry ngay lập tức, có thể gây thêm lỗi
    return await binance.createMarketOrder("BTC/USDT", "buy", 0.001);
  }
}

// ❌ LỖI 47: NO INPUT LENGTH VALIDATION (Stability & Crash)
function processLongString(str) {
  return str.toUpperCase(); // Có thể crash với string quá dài
}

// ❌ LỖI 48: INCONSISTENT ERROR CODES (Coding Style & Clean Code)
function validateUser(user) {
  if (!user.email) {
    throw new Error("E001: Email required");
  }
  if (!user.password) {
    throw new Error("Password is required"); // Format khác
  }
}

// ❌ LỖI 49: NO RATE LIMITING (Stability & Crash)
async function bulkOperations() {
  for (let i = 0; i < 100; i++) {
    await binance.createMarketOrder("BTC/USDT", "buy", 0.001);
    // Không có delay, có thể bị rate limit
  }
}

// ❌ LỖI 50: INCONSISTENT CACHING (Concurrency & Database)
let cache = {};

function getCachedData(key) {
  if (cache[key]) {
    return cache[key]; // Không có TTL, cache vĩnh viễn
  }
  const data = fetchData(key);
  cache[key] = data;
  return data;
}

// ========================================
// KẾT THÚC FILE CODE VỚI CÁC LỖI PHỔ BIẾN
// ========================================
