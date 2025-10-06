# Tài Liệu Huấn Luyện Code Review cho BRSE

## Mục Lục
1. [Coding Style & Clean Code](#1-coding-style--clean-code)
2. [Logic & Algorithm](#2-logic--algorithm)
3. [Concurrency & Database](#3-concurrency--database)
4. [Stability & Crash](#4-stability--crash)
5. [Security & Compliance](#5-security--compliance)

---

## 1. Coding Style & Clean Code

### 🎯 Mục đích
Đảm bảo code dễ đọc, dễ hiểu và dễ bảo trì.

### 📝 Các lỗi thường gặp:

#### 1.1 Đặt tên biến/hàm không rõ ràng
**Tiếng Anh:** Poor naming, unclear variable names, bad naming convention  
**Tiếng Việt:** Đặt tên không rõ ràng, tên biến khó hiểu, quy tắc đặt tên sai

**Ví dụ lỗi:**
```javascript
// ❌ Tên biến không rõ ràng
const a = 100;
const b = price;
const c = balance.total;

// ✅ Tên biến rõ ràng
const TRADE_SIZE = 100;
const currentPrice = price;
const totalBalance = balance.total;
```

#### 1.2 Code thừa (Dead Code)
**Tiếng Anh:** Dead code, unused code, redundant code  
**Tiếng Việt:** Code thừa, code không dùng, code dư thừa

**Ví dụ lỗi:**
```javascript
// ❌ Code thừa
function calculateProfit() {
  const profit = 0; // Không bao giờ được sử dụng
  return balance;
}

// ✅ Code sạch
function calculateProfit() {
  return balance;
}
```

#### 1.3 Code lặp lại (Code Duplication)
**Tiếng Anh:** Code duplication, repeated code, DRY violation  
**Tiếng Việt:** Code lặp lại, vi phạm nguyên tắc DRY

**Ví dụ lỗi:**
```javascript
// ❌ Code lặp lại
function buyBTC() {
  const order = await binance.createMarketOrder("BTC/USDT", "buy", quantity);
  console.log(`Buy ${quantity} BTC at ${price}`);
}

function sellBTC() {
  const order = await binance.createMarketOrder("BTC/USDT", "sell", quantity);
  console.log(`Sell ${quantity} BTC at ${price}`);
}

// ✅ Code tái sử dụng
async function executeTrade(symbol, side, quantity, price) {
  const order = await binance.createMarketOrder(symbol, side, quantity);
  console.log(`${side} ${quantity} BTC at ${price}`);
  return order;
}
```

### 🔑 Keywords để nhớ:
- **Naming**: đặt tên, naming convention
- **Dead Code**: code thừa, unused
- **DRY**: Don't Repeat Yourself, code lặp
- **Clean Code**: code sạch, readable

---

## 2. Logic & Algorithm

### 🎯 Mục đích
Đảm bảo logic xử lý đúng và hiệu quả.

### 📝 Các lỗi thường gặp:

#### 2.1 Hardcode giá trị
**Tiếng Anh:** Hardcoded values, magic numbers, hardcoded strings  
**Tiếng Việt:** Giá trị cứng, số ma thuật, chuỗi cứng

**Ví dụ lỗi:**
```javascript
// ❌ Hardcode
if (price > 50000) {
  // logic
}
const delay = 60 * 1000; // 60 giây

// ✅ Sử dụng constants
const BTC_PRICE_THRESHOLD = 50000;
const TRADING_INTERVAL_MS = 60 * 1000;

if (price > BTC_PRICE_THRESHOLD) {
  // logic
}
```

#### 2.2 Logic điều kiện phức tạp
**Tiếng Anh:** Complex conditionals, nested if, boolean logic  
**Tiếng Việt:** Điều kiện phức tạp, if lồng nhau, logic boolean

**Ví dụ lỗi:**
```javascript
// ❌ Logic phức tạp
if (price > average && balance > 100 && !isTrading && marketOpen) {
  // trade logic
}

// ✅ Logic rõ ràng
const shouldTrade = price > average && 
                   balance > MIN_TRADE_BALANCE && 
                   !isTrading && 
                   marketOpen;

if (shouldTrade) {
  // trade logic
}
```

#### 2.3 Thuật toán không hiệu quả
**Tiếng Anh:** Inefficient algorithm, performance issues, O(n²) complexity  
**Tiếng Việt:** Thuật toán không hiệu quả, vấn đề hiệu suất, độ phức tạp cao

**Ví dụ lỗi:**
```javascript
// ❌ Thuật toán chậm
function findBestPrice(prices) {
  let best = prices[0];
  for (let i = 0; i < prices.length; i++) {
    for (let j = i + 1; j < prices.length; j++) {
      if (prices[j] > best) {
        best = prices[j];
      }
    }
  }
  return best;
}

// ✅ Thuật toán hiệu quả
function findBestPrice(prices) {
  return Math.max(...prices);
}
```

### 🔑 Keywords để nhớ:
- **Hardcode**: giá trị cứng, magic number
- **Complex Logic**: logic phức tạp, nested if
- **Performance**: hiệu suất, algorithm efficiency
- **Refactor**: tái cấu trúc code

---

## 3. Concurrency & Database

### 🎯 Mục đích
Đảm bảo xử lý đồng thời và database an toàn.

### 📝 Các lỗi thường gặp:

#### 3.1 Race Condition
**Tiếng Anh:** Race condition, concurrent access, timing issues  
**Tiếng Việt:** Điều kiện đua, truy cập đồng thời, vấn đề thời gian

**Ví dụ lỗi:**
```javascript
// ❌ Race condition
let balance = 1000;

async function buyBTC() {
  if (balance > 100) {
    await delay(100); // Giả lập thời gian xử lý
    balance -= 100;
    // Có thể bị trừ 2 lần nếu gọi đồng thời
  }
}

// ✅ Sử dụng lock
let balance = 1000;
let isProcessing = false;

async function buyBTC() {
  if (isProcessing) return;
  
  isProcessing = true;
  if (balance > 100) {
    await delay(100);
    balance -= 100;
  }
  isProcessing = false;
}
```

#### 3.2 Database Transaction không đúng
**Tiếng Anh:** Database transaction, ACID properties, rollback  
**Tiếng Việt:** Giao dịch database, thuộc tính ACID, rollback

**Ví dụ lỗi:**
```javascript
// ❌ Không có transaction
async function transferMoney(from, to, amount) {
  await updateBalance(from, -amount);
  await updateBalance(to, +amount);
  // Nếu lỗi ở bước 2, tiền sẽ mất
}

// ✅ Có transaction
async function transferMoney(from, to, amount) {
  const transaction = await db.beginTransaction();
  try {
    await updateBalance(from, -amount, transaction);
    await updateBalance(to, +amount, transaction);
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
```

#### 3.3 Data Inconsistency
**Tiếng Anh:** Data inconsistency, stale data, cache invalidation  
**Tiếng Việt:** Dữ liệu không nhất quán, dữ liệu cũ, cache không hợp lệ

**Ví dụ lỗi:**
```javascript
// ❌ Dữ liệu không nhất quán
let cachedPrice = null;

async function getPrice() {
  if (cachedPrice) {
    return cachedPrice; // Có thể là dữ liệu cũ
  }
  cachedPrice = await fetchPrice();
  return cachedPrice;
}

// ✅ Cache với TTL
let cachedPrice = null;
let cacheTime = 0;
const CACHE_TTL = 5000; // 5 giây

async function getPrice() {
  const now = Date.now();
  if (cachedPrice && (now - cacheTime) < CACHE_TTL) {
    return cachedPrice;
  }
  cachedPrice = await fetchPrice();
  cacheTime = now;
  return cachedPrice;
}
```

### 🔑 Keywords để nhớ:
- **Race Condition**: điều kiện đua, concurrent
- **Transaction**: giao dịch, ACID
- **Data Consistency**: nhất quán dữ liệu
- **Lock**: khóa, mutex

---

## 4. Stability & Crash

### 🎯 Mục đích
Đảm bảo ứng dụng ổn định, không bị crash.

### 📝 Các lỗi thường gặp:

#### 4.1 Null Pointer Exception
**Tiếng Anh:** Null pointer exception, undefined access, null reference  
**Tiếng Việt:** Lỗi con trỏ null, truy cập undefined, tham chiếu null

**Ví dụ lỗi:**
```javascript
// ❌ Không kiểm tra null
function calculateTotal(balance) {
  return balance.total.BTC * price; // Có thể crash nếu balance.total là null
}

// ✅ Kiểm tra null
function calculateTotal(balance) {
  if (!balance || !balance.total || !balance.total.BTC) {
    return 0;
  }
  return balance.total.BTC * price;
}
```

#### 4.2 Unhandled Exception
**Tiếng Anh:** Unhandled exception, try-catch missing, error handling  
**Tiếng Việt:** Ngoại lệ không xử lý, thiếu try-catch, xử lý lỗi

**Ví dụ lỗi:**
```javascript
// ❌ Không xử lý lỗi
async function trade() {
  const order = await binance.createMarketOrder("BTC/USDT", "buy", 0.001);
  console.log("Order created:", order);
}

// ✅ Xử lý lỗi
async function trade() {
  try {
    const order = await binance.createMarketOrder("BTC/USDT", "buy", 0.001);
    console.log("Order created:", order);
  } catch (error) {
    console.error("Trade failed:", error.message);
    // Xử lý lỗi phù hợp
  }
}
```

#### 4.3 Memory Leak
**Tiếng Anh:** Memory leak, resource leak, garbage collection  
**Tiếng Việt:** Rò rỉ bộ nhớ, rò rỉ tài nguyên, thu gom rác

**Ví dụ lỗi:**
```javascript
// ❌ Memory leak
const intervals = [];

function startTrading() {
  const interval = setInterval(() => {
    // Logic trading
  }, 1000);
  intervals.push(interval); // Không bao giờ clear
}

// ✅ Quản lý memory
const intervals = [];

function startTrading() {
  const interval = setInterval(() => {
    // Logic trading
  }, 1000);
  intervals.push(interval);
}

function stopTrading() {
  intervals.forEach(interval => clearInterval(interval));
  intervals.length = 0;
}
```

#### 4.4 Infinite Loop
**Tiếng Anh:** Infinite loop, endless loop, stack overflow  
**Tiếng Việt:** Vòng lặp vô hạn, lặp không dừng, tràn stack

**Ví dụ lỗi:**
```javascript
// ❌ Vòng lặp vô hạn
while (true) {
  await tick();
  // Không có delay, có thể gây crash
}

// ✅ Vòng lặp có kiểm soát
while (isRunning) {
  await tick();
  await delay(60000); // Delay 1 phút
}
```

### 🔑 Keywords để nhớ:
- **Null Pointer**: null reference, undefined
- **Exception**: ngoại lệ, error handling
- **Memory Leak**: rò rỉ bộ nhớ, resource leak
- **Infinite Loop**: vòng lặp vô hạn

---

## 5. Security & Compliance

### 🎯 Mục đích
Đảm bảo bảo mật và tuân thủ quy định.

### 📝 Các lỗi thường gặp:

#### 5.1 Hardcoded Credentials
**Tiếng Anh:** Hardcoded credentials, exposed secrets, API key in code  
**Tiếng Việt:** Thông tin đăng nhập cứng, lộ secret, API key trong code

**Ví dụ lỗi:**
```javascript
// ❌ Hardcoded credentials
const binance = new ccxt.binance({
  apiKey: "AYjWFKDxBjYpfDekZrdFzxoxx6QvVHtus2zxUPWJJeoakHu9XEbJziNNSUvDVAm5",
  secret: "Z50fHwrYpKWYtldfTuHKMKj1t9NbzhWqdo7XlGSw2FymXyXepdqcvVa9R2WFwWpq",
});

// ✅ Sử dụng environment variables
const binance = new ccxt.binance({
  apiKey: process.env.BINANCE_API_KEY,
  secret: process.env.BINANCE_SECRET,
});
```

#### 5.2 SQL Injection
**Tiếng Anh:** SQL injection, parameterized query, prepared statement  
**Tiếng Việt:** Tấn công SQL injection, truy vấn tham số hóa

**Ví dụ lỗi:**
```javascript
// ❌ SQL Injection
function getUserBalance(userId) {
  const query = `SELECT balance FROM users WHERE id = ${userId}`;
  return db.query(query);
}

// ✅ Parameterized query
function getUserBalance(userId) {
  const query = `SELECT balance FROM users WHERE id = ?`;
  return db.query(query, [userId]);
}
```

#### 5.3 XSS (Cross-Site Scripting)
**Tiếng Anh:** XSS, cross-site scripting, input sanitization  
**Tiếng Việt:** Tấn công XSS, lọc dữ liệu đầu vào

**Ví dụ lỗi:**
```javascript
// ❌ Không lọc input
function displayMessage(message) {
  document.getElementById('message').innerHTML = message;
  // Có thể chạy script độc hại
}

// ✅ Lọc input
function displayMessage(message) {
  const sanitized = message.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  document.getElementById('message').innerHTML = sanitized;
}
```

#### 5.4 Authorization Issues
**Tiếng Anh:** Authorization, access control, permission check  
**Tiếng Việt:** Phân quyền, kiểm soát truy cập, kiểm tra quyền

**Ví dụ lỗi:**
```javascript
// ❌ Không kiểm tra quyền
function deleteUser(userId) {
  return db.deleteUser(userId); // Ai cũng có thể xóa
}

// ✅ Kiểm tra quyền
function deleteUser(userId, currentUser) {
  if (currentUser.role !== 'admin') {
    throw new Error('Unauthorized');
  }
  return db.deleteUser(userId);
}
```

#### 5.5 Data Exposure
**Tiếng Anh:** Data exposure, sensitive data, information disclosure  
**Tiếng Việt:** Lộ dữ liệu, dữ liệu nhạy cảm, tiết lộ thông tin

**Ví dụ lỗi:**
```javascript
// ❌ Lộ thông tin nhạy cảm
function getUserInfo(userId) {
  return {
    id: userId,
    email: user.email,
    password: user.password, // Không nên trả về password
    balance: user.balance
  };
}

// ✅ Chỉ trả về thông tin cần thiết
function getUserInfo(userId) {
  return {
    id: userId,
    email: user.email,
    balance: user.balance
    // Không trả về password
  };
}
```

### 🔑 Keywords để nhớ:
- **Hardcoded Credentials**: thông tin đăng nhập cứng
- **SQL Injection**: tấn công SQL
- **XSS**: cross-site scripting
- **Authorization**: phân quyền, access control
- **Data Exposure**: lộ dữ liệu, sensitive data

---

## 📋 Checklist Code Review cho BRSE

### Khi nghe dev nói về:
- **"Naming"** → Thuộc mảng **Coding Style**
- **"Hardcode"** → Thuộc mảng **Logic & Algorithm** hoặc **Security**
- **"Race condition"** → Thuộc mảng **Concurrency & Database**
- **"Null pointer"** → Thuộc mảng **Stability & Crash**
- **"SQL injection"** → Thuộc mảng **Security & Compliance**

### Câu hỏi để hỏi dev:
1. **Coding Style**: "Code này có dễ đọc không? Tên biến có rõ ràng không?"
2. **Logic**: "Logic này có phức tạp quá không? Có hardcode gì không?"
3. **Concurrency**: "Có vấn đề gì về đồng thời không? Database có an toàn không?"
4. **Stability**: "Code này có thể crash không? Có xử lý lỗi đầy đủ không?"
5. **Security**: "Có thông tin nhạy cảm nào bị lộ không? Có kiểm tra quyền không?"

---

## 🎯 Tóm tắt 5 mảng chính:

1. **Coding Style & Clean Code** - Code sạch, dễ đọc
2. **Logic & Algorithm** - Logic đúng, hiệu quả
3. **Concurrency & Database** - Xử lý đồng thời, database an toàn
4. **Stability & Crash** - Ứng dụng ổn định, không crash
5. **Security & Compliance** - Bảo mật, tuân thủ quy định
