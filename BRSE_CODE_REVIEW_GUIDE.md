# Hướng Dẫn Code Review cho BRSE

## 🎯 Mục đích
Tài liệu này giúp BRSE (Business Requirements & System Engineer) hiểu và tham gia hiệu quả vào quá trình code review, ngay cả khi không có nhiều kinh nghiệm lập trình.

---

## 📋 Checklist Code Review cho BRSE

### 1. Coding Style & Clean Code

#### ✅ Câu hỏi để hỏi dev:
- "Code này có dễ đọc không?"
- "Tên biến/hàm có rõ ràng không?"
- "Có code thừa nào không?"
- "Có code lặp lại không?"

#### 🔍 Dấu hiệu cần chú ý:
- Tên biến như `a`, `b`, `c`, `temp`, `data`
- Code giống nhau xuất hiện nhiều lần
- Comment code bị bỏ lại
- Function không được sử dụng

#### 📝 Ví dụ thực tế:
```javascript
// ❌ Khó hiểu
const a = 100;
const b = price;

// ✅ Dễ hiểu
const TRADE_SIZE = 100;
const currentPrice = price;
```

---

### 2. Logic & Algorithm

#### ✅ Câu hỏi để hỏi dev:
- "Logic này có phức tạp quá không?"
- "Có hardcode giá trị nào không?"
- "Thuật toán có hiệu quả không?"
- "Có thể tối ưu hơn không?"

#### 🔍 Dấu hiệu cần chú ý:
- Số cứng như `50000`, `100`, `0.001`
- If-else lồng nhau quá sâu
- Vòng lặp trong vòng lặp
- Logic phức tạp khó hiểu

#### 📝 Ví dụ thực tế:
```javascript
// ❌ Hardcode
if (price > 50000) {
  // logic
}

// ✅ Sử dụng constant
const BTC_PRICE_THRESHOLD = 50000;
if (price > BTC_PRICE_THRESHOLD) {
  // logic
}
```

---

### 3. Concurrency & Database

#### ✅ Câu hỏi để hỏi dev:
- "Có vấn đề gì về đồng thời không?"
- "Database có an toàn không?"
- "Có race condition không?"
- "Transaction có đúng không?"

#### 🔍 Dấu hiệu cần chú ý:
- Biến global được sửa từ nhiều nơi
- Không có lock/transaction
- Cache không có thời gian hết hạn
- Query database không an toàn

#### 📝 Ví dụ thực tế:
```javascript
// ❌ Race condition
let balance = 1000;
async function withdraw(amount) {
  if (balance > amount) {
    balance -= amount; // Có thể bị trừ nhiều lần
  }
}

// ✅ Có lock
let isProcessing = false;
async function withdraw(amount) {
  if (isProcessing) return;
  isProcessing = true;
  // logic
  isProcessing = false;
}
```

---

### 4. Stability & Crash

#### ✅ Câu hỏi để hỏi dev:
- "Code này có thể crash không?"
- "Có xử lý lỗi đầy đủ không?"
- "Có kiểm tra null không?"
- "Có vòng lặp vô hạn không?"

#### 🔍 Dấu hiệu cần chú ý:
- Không có try-catch
- Truy cập thuộc tính mà không kiểm tra null
- Vòng lặp while(true) không có break
- Không có timeout cho API call

#### 📝 Ví dụ thực tế:
```javascript
// ❌ Có thể crash
function getBalance(user) {
  return user.balance.total; // Crash nếu user.balance là null
}

// ✅ An toàn
function getBalance(user) {
  if (!user || !user.balance) {
    return 0;
  }
  return user.balance.total;
}
```

---

### 5. Security & Compliance

#### ✅ Câu hỏi để hỏi dev:
- "Có thông tin nhạy cảm nào bị lộ không?"
- "Có kiểm tra quyền không?"
- "Input có được validate không?"
- "Có nguy cơ bảo mật nào không?"

#### 🔍 Dấu hiệu cần chú ý:
- API key, password trong code
- Không kiểm tra quyền user
- Input không được lọc
- Trả về quá nhiều thông tin

#### 📝 Ví dụ thực tế:
```javascript
// ❌ Lộ thông tin
const apiKey = "sk-1234567890abcdef";

// ✅ Sử dụng environment
const apiKey = process.env.API_KEY;
```

---

## 🗣️ Cách Giao Tiếp với Dev

### Khi dev nói về:

#### **"Naming"** → Thuộc mảng **Coding Style**
- "Tên biến này có rõ ràng không?"
- "Có thể đặt tên dễ hiểu hơn không?"

#### **"Hardcode"** → Thuộc mảng **Logic & Algorithm** hoặc **Security**
- "Giá trị này có nên để config không?"
- "Có thể thay đổi được không?"

#### **"Race condition"** → Thuộc mảng **Concurrency & Database**
- "Có thể xảy ra xung đột không?"
- "Có cần lock không?"

#### **"Null pointer"** → Thuộc mảng **Stability & Crash**
- "Có thể bị crash không?"
- "Có kiểm tra null không?"

#### **"SQL injection"** → Thuộc mảng **Security & Compliance**
- "Có an toàn không?"
- "Có thể bị tấn công không?"

---

## 📊 Template Code Review Comment

### Cho mỗi lỗi, sử dụng template:

```
**Mảng:** [Coding Style/Logic/Security/Stability/Concurrency]
**Mức độ:** [Low/Medium/High/Critical]
**Mô tả:** [Mô tả ngắn gọn vấn đề]
**Tác động:** [Tác động đến hệ thống]
**Đề xuất:** [Cách sửa]
```

### Ví dụ:
```
**Mảng:** Security & Compliance
**Mức độ:** Critical
**Mô tả:** API key được hardcode trong code
**Tác động:** Lộ thông tin nhạy cảm, nguy cơ bảo mật cao
**Đề xuất:** Sử dụng environment variables
```

---

## 🎯 Quy Trình Code Review cho BRSE

### 1. Trước khi review:
- Đọc requirement/design document
- Hiểu business logic
- Xem test cases

### 2. Trong khi review:
- Kiểm tra logic business
- Xem xét edge cases
- Đánh giá performance impact
- Kiểm tra security concerns

### 3. Sau khi review:
- Tóm tắt các vấn đề chính
- Ưu tiên theo mức độ nghiêm trọng
- Đề xuất timeline sửa

---

## 🔑 Keywords Quan Trọng

### Coding Style:
- **Naming**: đặt tên, naming convention
- **Dead Code**: code thừa, unused
- **DRY**: Don't Repeat Yourself, code lặp
- **Clean Code**: code sạch, readable

### Logic & Algorithm:
- **Hardcode**: giá trị cứng, magic number
- **Complex Logic**: logic phức tạp, nested if
- **Performance**: hiệu suất, algorithm efficiency
- **Refactor**: tái cấu trúc code

### Concurrency & Database:
- **Race Condition**: điều kiện đua, concurrent
- **Transaction**: giao dịch, ACID
- **Data Consistency**: nhất quán dữ liệu
- **Lock**: khóa, mutex

### Stability & Crash:
- **Null Pointer**: null reference, undefined
- **Exception**: ngoại lệ, error handling
- **Memory Leak**: rò rỉ bộ nhớ, resource leak
- **Infinite Loop**: vòng lặp vô hạn

### Security & Compliance:
- **Hardcoded Credentials**: thông tin đăng nhập cứng
- **SQL Injection**: tấn công SQL
- **XSS**: cross-site scripting
- **Authorization**: phân quyền, access control
- **Data Exposure**: lộ dữ liệu, sensitive data

---

## 📝 Checklist Tổng Quan

### ✅ Trước khi approve code:
- [ ] Logic business đúng
- [ ] Không có hardcode
- [ ] Xử lý lỗi đầy đủ
- [ ] Không có security issues
- [ ] Performance acceptable
- [ ] Code dễ đọc
- [ ] Test cases đầy đủ
- [ ] Documentation cập nhật

### ❌ Các trường hợp cần reject:
- [ ] Security vulnerabilities
- [ ] Logic business sai
- [ ] Performance issues nghiêm trọng
- [ ] Code không thể maintain
- [ ] Thiếu error handling
- [ ] Hardcoded sensitive data

---

## 🎓 Tips cho BRSE

### 1. Đừng ngại hỏi:
- "Tôi không hiểu đoạn code này, bạn có thể giải thích không?"
- "Logic này có đúng với requirement không?"
- "Có trường hợp nào có thể gây lỗi không?"

### 2. Tập trung vào business logic:
- Code có implement đúng requirement không?
- Có handle được các edge cases không?
- Performance có đáp ứng được không?

### 3. Sử dụng tools:
- Linter để check coding style
- Security scanner để check vulnerabilities
- Performance profiler để check performance

### 4. Học từ dev:
- Hỏi dev giải thích các concept mới
- Đọc documentation của framework/library
- Tham gia training sessions

---

## 📚 Tài Liệu Tham Khảo

1. **CODE_REVIEW_TRAINING_GUIDE.md** - Tài liệu chi tiết về 5 mảng lỗi
2. **bad_examples.js** - Ví dụ code có lỗi
3. **good_examples.js** - Ví dụ code đã sửa
4. **index.js** - Code gốc của project

---

## 🎯 Kết Luận

Code review không chỉ là việc của developer. BRSE có thể đóng góp giá trị bằng cách:
- Kiểm tra logic business
- Đánh giá tác động đến user
- Đảm bảo requirement được implement đúng
- Phát hiện các vấn đề security và performance

**Nhớ:** Mục tiêu không phải là tìm lỗi, mà là đảm bảo chất lượng code và hệ thống hoạt động tốt nhất có thể.
