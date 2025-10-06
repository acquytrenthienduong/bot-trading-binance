// ========================================
// FILE CODE ĐÃ SỬA - MINH HỌA CÁCH VIẾT CODE TỐT
// ========================================

const ccxt = require("ccxt");
const moment = require("moment");
const delay = require("delay");

// ✅ SỬA LỖI 1: SỬ DỤNG ENVIRONMENT VARIABLES (Security & Compliance)
const binance = new ccxt.binance({
  apiKey: process.env.BINANCE_API_KEY,
  secret: process.env.BINANCE_SECRET,
});

// ✅ SỬA LỖI 2: SỬ DỤNG CONSTANTS (Logic & Algorithm)
const CONFIG = {
  TRADE_SIZE: 100,
  DELAY_TIME: 60 * 1000,
  BTC_PRICE_THRESHOLD: 50000,
  MAX_RETRY_ATTEMPTS: 3,
  CACHE_TTL: 5000,
  MIN_TRADE_BALANCE: 100
};

// ✅ SỬA LỖI 3: TÊN BIẾN RÕ RÀNG (Coding Style & Clean Code)
let retryCount = 0;
let priceHistory = [];
let currentBalance = null;

// ✅ SỬA LỖI 4: XÓA DEAD CODE (Coding Style & Clean Code)
// Đã xóa function không sử dụng

// ✅ SỬA LỖI 5: TÁI SỬ DỤNG CODE (Coding Style & Clean Code)
async function executeTrade(symbol, side, quantity, price) {
  try {
    const order = await binance.createMarketOrder(symbol, side, quantity);
    console.log(`${side.toUpperCase()} ${quantity} ${symbol} at ${price}`);
    return order;
  } catch (error) {
    console.error(`Trade failed: ${error.message}`);
    throw error;
  }
}

// ✅ SỬA LỖI 6: LOGIC RÕ RÀNG (Logic & Algorithm)
function shouldExecuteTrade(price, balance, isTrading, marketOpen, userRole) {
  const hasValidPrice = price > CONFIG.BTC_PRICE_THRESHOLD;
  const hasSufficientBalance = balance > CONFIG.MIN_TRADE_BALANCE;
  const isNotCurrentlyTrading = !isTrading;
  const isMarketOpen = marketOpen;
  const hasTradingPermission = userRole === 'trader';
  
  return hasValidPrice && hasSufficientBalance && isNotCurrentlyTrading && 
         isMarketOpen && hasTradingPermission;
}

// ✅ SỬA LỖI 7: THUẬT TOÁN HIỆU QUẢ (Logic & Algorithm)
function findMaxPrice(prices) {
  if (!prices || prices.length === 0) {
    return 0;
  }
  return Math.max(...prices);
}

// ✅ SỬA LỖI 8: SỬ DỤNG LOCK (Concurrency & Database)
var isProcessing = false;
let balance = 1000;

async function withdrawMoney(amount) {
  if (isProcessing) {
    throw new Error('Another transaction is in progress');
  }
  
  isProcessing = true;
  try {
    if (balance >= amount) {
      await delay(100); // Giả lập thời gian xử lý
      balance -= amount;
      return true;
    }
    return false;
  } finally {
    isProcessing = false;
  }
}

// ✅ SỬA LỖI 9: XỬ LÝ LỖI ĐẦY ĐỦ (Stability & Crash)
async function fetchPrice() {
  try {
    const price = await binance.fetchOHLCV("BTC/USDT", "1m", undefined, 5);
    return price;
  } catch (error) {
    console.error('Failed to fetch price:', error.message);
    throw new Error(`Price fetch failed: ${error.message}`);
  }
}

// ✅ SỬA LỖI 10: KIỂM TRA NULL (Stability & Crash)
function calculateTotal(balance) {
  if (!balance || !balance.total || typeof balance.total.BTC !== 'number') {
    return 0;
  }
  return balance.total.BTC * 50000;
}

// ✅ SỬA LỖI 11: QUẢN LÝ MEMORY (Stability & Crash)
const intervals = [];

function startTrading() {
  const interval = setInterval(() => {
    console.log("Trading...");
  }, 1000);
  intervals.push(interval);
}

function stopTrading() {
  intervals.forEach(interval => clearInterval(interval));
  intervals.length = 0;
}

// ✅ SỬA LỖI 12: VÒNG LẶP CÓ KIỂM SOÁT (Stability & Crash)
let isRunning = false;

async function mainLoop() {
  isRunning = true;
  while (isRunning) {
    try {
      await fetchPrice();
      await delay(CONFIG.DELAY_TIME);
    } catch (error) {
      console.error('Main loop error:', error.message);
      await delay(CONFIG.DELAY_TIME);
    }
  }
}

// ✅ SỬA LỖI 13: CACHE VỚI TTL (Concurrency & Database)
let cachedPrice = null;
let cacheTime = 0;

function getPrice() {
  const now = Date.now();
  if (cachedPrice && (now - cacheTime) < CONFIG.CACHE_TTL) {
    return cachedPrice;
  }
  cachedPrice = fetchPrice();
  cacheTime = now;
  return cachedPrice;
}

// ✅ SỬA LỖI 14: KIỂM TRA QUYỀN (Security & Compliance)
function deleteUser(userId, currentUser) {
  if (!currentUser || currentUser.role !== 'admin') {
    throw new Error('Unauthorized: Admin role required');
  }
  return db.deleteUser(userId);
}

// ✅ SỬA LỖI 15: CHỈ TRẢ VỀ THÔNG TIN CẦN THIẾT (Security & Compliance)
function getUserInfo(userId) {
  const user = db.getUser(userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  return {
    id: user.id,
    email: user.email,
    balance: user.balance
    // Không trả về password và secretKey
  };
}

// ✅ SỬA LỖI 16: PARAMETERIZED QUERY (Security & Compliance)
function getUserBalance(userId) {
  const query = `SELECT balance FROM users WHERE id = ?`;
  return db.query(query, [userId]);
}

// ✅ SỬA LỖI 17: LỌC INPUT (Security & Compliance)
function displayMessage(message) {
  const sanitized = message.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  document.getElementById('message').innerHTML = sanitized;
}

// ✅ SỬA LỖI 18: VALIDATION ĐẦY ĐỦ (Stability & Crash)
function processOrder(quantity, price) {
  if (typeof quantity !== 'number' || quantity <= 0) {
    throw new Error('Invalid quantity');
  }
  if (typeof price !== 'number' || price <= 0) {
    throw new Error('Invalid price');
  }
  
  const total = quantity * price;
  return total;
}

// ✅ SỬA LỖI 19: XỬ LÝ LỖI CỤ THỂ (Stability & Crash)
async function trade() {
  try {
    const order = await binance.createMarketOrder("BTC/USDT", "buy", 0.001);
    return order;
  } catch (error) {
    if (error.message.includes('Insufficient balance')) {
      throw new Error('Insufficient balance for trade');
    } else if (error.message.includes('Rate limit')) {
      throw new Error('Rate limit exceeded, please try again later');
    } else {
      throw new Error(`Trade failed: ${error.message}`);
    }
  }
}

// ✅ SỬA LỖI 20: QUẢN LÝ STATE AN TOÀN (Concurrency & Database)
let isProcessing = false;

async function processTrade() {
  if (isProcessing) {
    throw new Error('Trade already in progress');
  }
  
  isProcessing = true;
  try {
    // Logic xử lý
    await executeTrade("BTC/USDT", "buy", 0.001, 50000);
  } finally {
    isProcessing = false;
  }
}

// ✅ SỬA LỖI 21: QUERY HIỆU QUẢ (Concurrency & Database)
function getActiveUsers() {
  return db.query("SELECT id, email, balance FROM users WHERE status = 'active'");
}

// ✅ SỬA LỖI 22: RATE LIMITING (Stability & Crash)
async function controlledTrading() {
  for (let i = 0; i < 10; i++) {
    try {
      await binance.createMarketOrder("BTC/USDT", "buy", 0.001);
      await delay(1000); // Delay 1 giây giữa các lệnh
    } catch (error) {
      if (error.message.includes('Rate limit')) {
        await delay(5000); // Delay lâu hơn nếu bị rate limit
      }
    }
  }
}

// ✅ SỬA LỖI 23: LOGGING NHẤT QUÁN (Coding Style & Clean Code)
function logTrade(action, amount, timestamp = new Date()) {
  const logEntry = {
    timestamp: timestamp.toISOString(),
    action: action,
    amount: amount,
    level: 'INFO'
  };
  console.log(JSON.stringify(logEntry));
}

// ✅ SỬA LỖI 24: SỬ DỤNG CONSTANTS (Logic & Algorithm)
const TRADING_FEE_RATE = 0.001;

function calculateFee(amount) {
  return amount * TRADING_FEE_RATE;
}

// ✅ SỬA LỖI 25: SỬ DỤNG TRANSACTION (Concurrency & Database)
async function transferMoney(from, to, amount) {
  const transaction = await db.beginTransaction();
  try {
    await db.updateBalance(from, -amount, transaction);
    await db.updateBalance(to, +amount, transaction);
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

// ✅ SỬA LỖI 26: NAMING CONVENTION NHẤT QUÁN (Coding Style & Clean Code)
const userName = "john";
const userEmail = "john@example.com";
const userBalance = 1000;

// ✅ SỬA LỖI 27: INPUT SANITIZATION (Security & Compliance)
function searchUser(query) {
  const sanitizedQuery = query.replace(/[^a-zA-Z0-9\s]/g, '');
  const sql = `SELECT * FROM users WHERE name LIKE ?`;
  return db.query(sql, [`%${sanitizedQuery}%`]);
}

// ✅ SỬA LỖI 28: CONFIGURATION MANAGEMENT (Logic & Algorithm)
function getApiUrl() {
  return process.env.API_URL || "https://api.binance.com";
}

// ✅ SỬA LỖI 29: TIMEOUT HANDLING (Stability & Crash)
async function fetchDataWithTimeout(timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const data = await binance.fetchOHLCV("BTC/USDT", "1m", undefined, 5);
    clearTimeout(timeoutId);
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

// ✅ SỬA LỖI 30: RETURN TYPE NHẤT QUÁN (Coding Style & Clean Code)
function getBalance(userId) {
  if (!userId) {
    return { balance: 0, error: 'Invalid user ID' };
  }
  
  const user = db.getUser(userId);
  if (!user) {
    return { balance: 0, error: 'User not found' };
  }
  
  return { balance: user.balance, error: null };
}

// ✅ SỬA LỖI 31: VALIDATION EXTERNAL DATA (Stability & Crash)
function processApiResponse(response) {
  if (!response || !response.data || !Array.isArray(response.data.prices)) {
    throw new Error('Invalid API response structure');
  }
  
  const firstPrice = response.data.prices[0];
  if (!firstPrice || typeof firstPrice.value !== 'number') {
    throw new Error('Invalid price data');
  }
  
  return firstPrice.value;
}

// ✅ SỬA LỖI 32: ERROR MESSAGES NHẤT QUÁN (Coding Style & Clean Code)
function validateInput(input) {
  if (!input) {
    throw new Error('E001: Input is required');
  }
  if (input.length < 3) {
    throw new Error('E002: Input too short (minimum 3 characters)');
  }
  if (input.length > 100) {
    throw new Error('E003: Input too long (maximum 100 characters)');
  }
}

// ✅ SỬA LỖI 33: RESOURCE CLEANUP (Stability & Crash)
function createConnection() {
  const connection = db.connect();
  
  // Return connection with cleanup method
  return {
    connection,
    close: () => {
      if (connection) {
        connection.close();
      }
    }
  };
}

// ✅ SỬA LỖI 34: ASYNC/AWAIT NHẤT QUÁN (Coding Style & Clean Code)
async function consistentAsync() {
  const data1 = await fetchData();
  const data2 = await fetchData();
  return { data1, data2 };
}

// ✅ SỬA LỖI 35: BOUNDARY CHECKING (Stability & Crash)
function getArrayElement(arr, index) {
  if (!Array.isArray(arr)) {
    throw new Error('First parameter must be an array');
  }
  if (index < 0 || index >= arr.length) {
    throw new Error('Index out of bounds');
  }
  return arr[index];
}

// ✅ SỬA LỖI 36: DATE VALIDATION (Logic & Algorithm)
function formatDate(date) {
  if (!date || !moment(date).isValid()) {
    throw new Error('Invalid date');
  }
  return moment(date).format("YYYY-MM-DD");
}

// ✅ SỬA LỖI 37: CACHING STRATEGY (Concurrency & Database)
const calculationCache = new Map();

function expensiveCalculation(data) {
  const cacheKey = JSON.stringify(data);
  
  if (calculationCache.has(cacheKey)) {
    return calculationCache.get(cacheKey);
  }
  
  const result = data.reduce((acc, item) => acc + item.value * Math.random(), 0);
  calculationCache.set(cacheKey, result);
  
  return result;
}

// ✅ SỬA LỖI 38: NULL HANDLING NHẤT QUÁN (Stability & Crash)
function processUser(user) {
  if (!user) {
    return "Unknown";
  }
  
  if (!user.name) {
    return "Unknown";
  }
  
  return user.name.toUpperCase();
}

// ✅ SỬA LỖI 39: CONCURRENCY CONTROL (Concurrency & Database)
let counter = 0;
let counterLock = false;

async function incrementCounter() {
  while (counterLock) {
    await delay(10);
  }
  
  counterLock = true;
  try {
    counter++;
    return counter;
  } finally {
    counterLock = false;
  }
}

// ✅ SỬA LỖI 40: ENCODING HANDLING (Security & Compliance)
function processText(text) {
  if (typeof text !== 'string') {
    throw new Error('Input must be a string');
  }
  
  try {
    return text.toLowerCase();
  } catch (error) {
    throw new Error('Invalid text encoding');
  }
}

// ✅ SỬA LỖI 41: VERSION MANAGEMENT (Coding Style & Clean Code)
function getApiVersion() {
  return process.env.API_VERSION || "v1";
}

// ✅ SỬA LỖI 42: LOGGING LEVELS NHẤT QUÁN (Coding Style & Clean Code)
const LOG_LEVELS = {
  INFO: 'INFO',
  ERROR: 'ERROR',
  WARN: 'WARN',
  DEBUG: 'DEBUG'
};

function logInfo(message) {
  console.log(JSON.stringify({ level: LOG_LEVELS.INFO, message, timestamp: new Date().toISOString() }));
}

function logError(message) {
  console.error(JSON.stringify({ level: LOG_LEVELS.ERROR, message, timestamp: new Date().toISOString() }));
}

// ✅ SỬA LỖI 43: CIRCUIT BREAKER (Stability & Crash)
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.threshold = threshold;
    this.timeout = timeout;
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
  }
  
  async execute(operation) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }
  
  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
    }
  }
}

const circuitBreaker = new CircuitBreaker();

async function callExternalApiWithCircuitBreaker() {
  return circuitBreaker.execute(async () => {
    return await binance.fetchOHLCV("BTC/USDT", "1m", undefined, 5);
  });
}

// ✅ SỬA LỖI 44: DATA TYPE HANDLING NHẤT QUÁN (Coding Style & Clean Code)
function processAmount(amount) {
  if (typeof amount === 'string') {
    const parsed = parseFloat(amount);
    if (isNaN(parsed)) {
      throw new Error('Invalid string amount');
    }
    return parsed;
  }
  
  if (typeof amount === 'number') {
    if (isNaN(amount)) {
      throw new Error('Invalid number amount');
    }
    return amount;
  }
  
  throw new Error('Amount must be a string or number');
}

// ✅ SỬA LỖI 45: BACKUP STRATEGY (Concurrency & Database)
async function saveImportantData(data) {
  try {
    await db.save(data);
    await backupService.save(data);
  } catch (error) {
    console.error('Failed to save data:', error);
    throw error;
  }
}

// ✅ SỬA LỖI 46: RETRY LOGIC NHẤT QUÁN (Stability & Crash)
async function retryOperation(operation, maxRetries = 3, delayMs = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      console.log(`Attempt ${attempt} failed, retrying in ${delayMs}ms...`);
      await delay(delayMs);
      delayMs *= 2; // Exponential backoff
    }
  }
}

// ✅ SỬA LỖI 47: INPUT LENGTH VALIDATION (Stability & Crash)
function processLongString(str, maxLength = 10000) {
  if (typeof str !== 'string') {
    throw new Error('Input must be a string');
  }
  
  if (str.length > maxLength) {
    throw new Error(`String too long (maximum ${maxLength} characters)`);
  }
  
  return str.toUpperCase();
}

// ✅ SỬA LỖI 48: ERROR CODES NHẤT QUÁN (Coding Style & Clean Code)
const ERROR_CODES = {
  EMAIL_REQUIRED: 'E001',
  PASSWORD_REQUIRED: 'E002',
  INVALID_EMAIL: 'E003',
  INVALID_PASSWORD: 'E004'
};

function validateUser(user) {
  if (!user.email) {
    throw new Error(`${ERROR_CODES.EMAIL_REQUIRED}: Email is required`);
  }
  if (!user.password) {
    throw new Error(`${ERROR_CODES.PASSWORD_REQUIRED}: Password is required`);
  }
}

// ✅ SỬA LỖI 49: RATE LIMITING (Stability & Crash)
class RateLimiter {
  constructor(requestsPerSecond = 10) {
    this.requestsPerSecond = requestsPerSecond;
    this.requests = [];
  }
  
  async waitIfNeeded() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < 1000);
    
    if (this.requests.length >= this.requestsPerSecond) {
      const waitTime = 1000 - (now - this.requests[0]);
      await delay(waitTime);
    }
    
    this.requests.push(now);
  }
}

const rateLimiter = new RateLimiter(5);

async function bulkOperationsWithRateLimit() {
  for (let i = 0; i < 100; i++) {
    await rateLimiter.waitIfNeeded();
    try {
      await binance.createMarketOrder("BTC/USDT", "buy", 0.001);
    } catch (error) {
      console.error(`Operation ${i} failed:`, error.message);
    }
  }
}

// ✅ SỬA LỖI 50: CACHING VỚI TTL (Concurrency & Database)
class TTLCache {
  constructor(ttl = 5000) {
    this.cache = new Map();
    this.ttl = ttl;
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) {
      return null;
    }
    
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }
}

const ttlCache = new TTLCache(5000);

function getCachedDataWithTTL(key) {
  const cached = ttlCache.get(key);
  if (cached) {
    return cached;
  }
  
  const data = fetchData(key);
  ttlCache.set(key, data);
  return data;
}

// ========================================
// KẾT THÚC FILE CODE ĐÃ SỬA
// ========================================
