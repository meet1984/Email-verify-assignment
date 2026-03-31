const { verifyEmail, getMXRecords } = require("../src/verifyEmail");

// Mock SMTP + DNS
jest.mock("../src/smtpCheck", () => ({
  checkSMTP: jest.fn()
}));

jest.mock("dns", () => ({
  promises: {
    resolveMx: jest.fn()
  }
}));

const { checkSMTP } = require("../src/smtpCheck");
const dns = require("dns").promises;

describe("🔥 Deep Email Verification Tests", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =========================
  // 🌐 DNS EDGE CASES
  // =========================

  test("DNS returns empty array → fallback valid (known domain)", async () => {
    dns.resolveMx.mockResolvedValue([]);

    const res = await verifyEmail("test@gmail.com", { deepCheck: true });
    expect(res.result).toBe("valid");
  });

  test("DNS returns empty → fallback invalid (unknown domain)", async () => {
    dns.resolveMx.mockResolvedValue([]);

    const res = await verifyEmail("user@fake123domain.com", { deepCheck: true });
    expect(res.result).toBe("invalid");
  });

  test("DNS throws error → fallback handled", async () => {
    dns.resolveMx.mockRejectedValue(new Error("DNS fail"));

    const res = await verifyEmail("test@gmail.com", { deepCheck: true });
    expect(["valid", "unknown"]).toContain(res.result);
  });

  test("DNS returns malformed data", async () => {
    dns.resolveMx.mockResolvedValue(null);

    const res = await verifyEmail("test@gmail.com", { deepCheck: true });
    expect(res).toBeDefined();
  });

  // =========================
  // 📡 SMTP EDGE CASES
  // =========================

  test("SMTP success with valid MX", async () => {
    dns.resolveMx.mockResolvedValue([{ exchange: "mx.gmail.com" }]);
    checkSMTP.mockResolvedValue({ success: true });

    const res = await verifyEmail("test@gmail.com", { deepCheck: true });
    expect(res.result).toBe("valid");
  });

  test("SMTP returns failure code 550", async () => {
    dns.resolveMx.mockResolvedValue([{ exchange: "mx.gmail.com" }]);
    checkSMTP.mockResolvedValue({ success: false, error: "550 User not found" });

    const res = await verifyEmail("test@gmail.com", { deepCheck: true });
    expect(res.result).toBe("unknown");
  });

  test("SMTP throws timeout", async () => {
    dns.resolveMx.mockResolvedValue([{ exchange: "mx.gmail.com" }]);
    checkSMTP.mockRejectedValue(new Error("Timeout"));

    const res = await verifyEmail("test@gmail.com", { deepCheck: true });
    expect(res.result).toBe("unknown");
  });

  test("SMTP returns unexpected structure", async () => {
    dns.resolveMx.mockResolvedValue([{ exchange: "mx.gmail.com" }]);
    checkSMTP.mockResolvedValue({});

    const res = await verifyEmail("test@gmail.com", { deepCheck: true });
    expect(res.result).toBe("unknown");
  });

  // =========================
  // 🧠 TYPO + DOMAIN LOGIC
  // =========================

  test("Typo suggestion preserved even when valid", async () => {
    const res = await verifyEmail("user@gmial.com", { deepCheck: false });
    expect(res.didyoumean).toBe("user@gmail.com");
  });

  test("No typo suggestion for correct email", async () => {
    const res = await verifyEmail("user@gmail.com", { deepCheck: false });
    expect(res.didyoumean).toBeUndefined();
  });

  // =========================
  // 🧪 INPUT EDGE CASES
  // =========================

  test("Email with uppercase + spaces trimmed", async () => {
    const res = await verifyEmail(" TEST@GMAIL.COM ", { deepCheck: false });
    expect(res.result).toBe("invalid"); // validator fails due to spaces
  });

  test("Email with subdomain", async () => {
    const res = await verifyEmail("user@mail.gmail.com", { deepCheck: false });
    expect(res).toBeDefined();
  });

  test("Email with plus alias", async () => {
    const res = await verifyEmail("user+test@gmail.com", { deepCheck: false });
    expect(res.result).toBe("valid");
  });

  test("Email with numbers", async () => {
    const res = await verifyEmail("user123@gmail.com", { deepCheck: false });
    expect(res.result).toBe("valid");
  });

  test("Email with dash in domain", async () => {
    const res = await verifyEmail("user@mail-domain.com", { deepCheck: false });
    expect(res).toBeDefined();
  });

  // =========================
  // 🔒 SECURITY EDGE CASES
  // =========================

  test("SQL injection-like email", async () => {
    const res = await verifyEmail("test'; DROP TABLE users;--@gmail.com");
    expect(res.result).toBe("invalid");
  });

  test("Script injection attempt", async () => {
    const res = await verifyEmail("<script>@gmail.com");
    expect(res.result).toBe("invalid");
  });

  // =========================
  // ⚡ PERFORMANCE TESTS
  // =========================

  test("Execution time under 1 second (fast mode)", async () => {
    const start = Date.now();

    await verifyEmail("test@gmail.com", { deepCheck: false });

    const duration = Date.now() - start;
    expect(duration).toBeLessThan(1000);
  });

  test("Execution time recorded correctly", async () => {
    const res = await verifyEmail("test@gmail.com", { deepCheck: false });
    expect(res.executiontime).toBeGreaterThanOrEqual(0);
  });

  // =========================
  // 📦 STRUCTURE TESTS
  // =========================

  test("Response always contains required fields", async () => {
    const res = await verifyEmail("test@gmail.com", { deepCheck: false });

    expect(res).toHaveProperty("email");
    expect(res).toHaveProperty("result");
    expect(res).toHaveProperty("resultcode");
    expect(res).toHaveProperty("executiontime");
    expect(res).toHaveProperty("timestamp");
  });

});