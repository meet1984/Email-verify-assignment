# 📧 Email Verifier (Node.js)

A robust and extensible **email verification utility** built with Node.js.
It validates email syntax, detects domain issues, performs DNS (MX) lookup, and optionally checks SMTP servers.

---

## 🚀 Features

* ✅ Email **syntax validation**
* 🌐 Domain extraction & validation
* 📡 MX record (DNS) lookup
* 📬 SMTP verification (optional)
* 🧠 Typo detection (`gmial → gmail`)
* ⚡ Fast mode (no network calls)
* 🔒 Safe handling of invalid / malicious inputs
* 🧪 Comprehensive Jest test coverage (20+ tests)

---

## 📂 Project Structure

```
email-verifier/
│
├── src/
│   ├── verifyEmail.js     # Main logic
│   ├── smtpCheck.js       # SMTP verification
│   └── didYouMean.js      # Typo detection
│
├── tests/
│   ├── verifyEmail.test.js
│   └── verifyEmail.deep.test.js
│
├── package.json
└── README.md
```

---

## 📦 Installation

```bash
git clone https://github.com/your-username/email-verifier.git
cd email-verifier
npm install
```

---

## ▶️ Usage

```js
const { verifyEmail } = require("./src/verifyEmail");

(async () => {
  const result = await verifyEmail("test@gmail.com", {
    deepCheck: true
  });

  console.log(result);
})();
```

---

## 🧾 Example Output

```json
{
  "email": "test@gmail.com",
  "result": "valid",
  "resultcode": 0,
  "subresult": "ok",
  "domain": "gmail.com",
  "mxRecords": ["gmail-smtp-in.l.google.com"],
  "executiontime": 120,
  "timestamp": "2026-04-01T10:00:00.000Z"
}
```

---

## ⚙️ Options

| Option    | Type | Default | Description                    |
| --------- | ---- | ------- | ------------------------------ |
| deepCheck | bool | true    | Enable DNS + SMTP verification |

---

## 🧪 Running Tests

```bash
npm test
```

or

```bash
npx jest --detectOpenHandles
```

---

## ✅ Test Coverage

Includes:

* ✔ Syntax validation
* ✔ Domain validation
* ✔ Typo detection
* ✔ DNS (MX) lookup
* ✔ SMTP success/failure cases
* ✔ Edge cases (null, empty, invalid inputs)
* ✔ Security tests (injection attempts)
* ✔ Performance tests

---

## ⚠️ Notes

* SMTP verification may be **slow or unreliable** in real-world environments.
* DNS lookups can fail depending on network conditions.
* Use `deepCheck: false` for fast validation without network calls.

---

## 🛠️ Tech Stack

* Node.js
* Jest (Testing)
* Validator.js
* DNS Promises API

---

## 📌 Future Improvements

* 🌍 REST API (Express)
* ⚡ Caching for DNS lookups
* 🔐 Rate limiting
* 📊 Logging & monitoring
* ☁️ Deployment (Railway / Render)

---

## 🤝 Contributing

Pull requests are welcome!
Feel free to open issues for suggestions or bugs.

---

## 📄 License

MIT License

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!
