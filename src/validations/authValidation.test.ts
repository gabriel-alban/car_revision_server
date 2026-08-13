import { loginSchema, registerSchema } from "./authValidation.js";

const validRegisterPayload = () => ({
  body: {
    username: "alban123",
    email: "user@example.com",
    password: "StrongPass1!"
  }
});

const validLoginPayload = () => ({
  body: {
    email: "user@example.com",
    password: "StrongPass1!"
  }
});

describe("registerSchema", () => {
  it("accepts a valid payload", () => {
    const result = registerSchema.safeParse(validRegisterPayload());
    expect(result.success).toBe(true);
  });

  it("trims username and normalizes email to lowercase", () => {
    const result = registerSchema.safeParse({
      body: {
        username: "  AlbanUser  ",
        email: "  USER@EXAMPLE.COM  ",
        password: "StrongPass1!"
      }
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.body.username).toBe("AlbanUser");
      expect(result.data.body.email).toBe("user@example.com");
    }
  });

  it("rejects username shorter than 3 characters", () => {
    const payload = validRegisterPayload();
    payload.body.username = "ab";

    const result = registerSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("rejects username longer than 50 characters", () => {
    const payload = validRegisterPayload();
    payload.body.username = "a".repeat(51);

    const result = registerSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("rejects invalid email format", () => {
    const payload = validRegisterPayload();
    payload.body.email = "not-an-email";

    const result = registerSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("rejects email longer than 255 characters", () => {
    const payload = validRegisterPayload();
    payload.body.email = `${"a".repeat(250)}@ex.com`;

    const result = registerSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("rejects password shorter than minimum length", () => {
    const payload = validRegisterPayload();
    payload.body.password = "Aa1!abcd";

    const result = registerSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("rejects password longer than 128 characters", () => {
    const payload = validRegisterPayload();
    payload.body.password = `Aa1!${"a".repeat(125)}`;

    const result = registerSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("rejects password without lowercase letter", () => {
    const payload = validRegisterPayload();
    payload.body.password = "STRONGPASS1!";

    const result = registerSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message.includes("lowercase"))).toBe(true);
    }
  });

  it("rejects password without uppercase letter", () => {
    const payload = validRegisterPayload();
    payload.body.password = "strongpass1!";

    const result = registerSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message.includes("uppercase"))).toBe(true);
    }
  });

  it("rejects password without number", () => {
    const payload = validRegisterPayload();
    payload.body.password = "StrongPass!!";

    const result = registerSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message.includes("number"))).toBe(true);
    }
  });

  it("rejects password without special character", () => {
    const payload = validRegisterPayload();
    payload.body.password = "StrongPass11";

    const result = registerSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message.includes("special"))).toBe(true);
    }
  });

  it("rejects password containing spaces", () => {
    const payload = validRegisterPayload();
    payload.body.password = "Strong Pass1!";

    const result = registerSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message.includes("must not contain spaces"))).toBe(true);
    }
  });

  it("rejects missing required fields", () => {
    const result = registerSchema.safeParse({ body: {} });
    expect(result.success).toBe(false);
  });

  it("accepts missing params and query because they are optional", () => {
    const result = registerSchema.safeParse(validRegisterPayload());
    expect(result.success).toBe(true);
  });

  it("accepts explicit empty params and query", () => {
    const payload = {
      ...validRegisterPayload(),
      params: {},
      query: {}
    };

    const result = registerSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });
});

describe("loginSchema", () => {
  it("accepts a valid payload", () => {
    const result = loginSchema.safeParse(validLoginPayload());
    expect(result.success).toBe(true);
  });

  it("trims and lowercases email", () => {
    const result = loginSchema.safeParse({
      body: {
        email: "  USER@EXAMPLE.COM  ",
        password: "StrongPass1!"
      }
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.body.email).toBe("user@example.com");
    }
  });

  it("rejects invalid email format", () => {
    const payload = validLoginPayload();
    payload.body.email = "bad-email";

    const result = loginSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("rejects email longer than 255 characters", () => {
    const payload = validLoginPayload();
    payload.body.email = `${"a".repeat(250)}@ex.com`;

    const result = loginSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("rejects empty password", () => {
    const payload = validLoginPayload();
    payload.body.password = "";

    const result = loginSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message.includes("Password is required"))).toBe(true);
    }
  });

  it("rejects password longer than 128 characters", () => {
    const payload = validLoginPayload();
    payload.body.password = "a".repeat(129);

    const result = loginSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("accepts missing params and query because they are optional", () => {
    const result = loginSchema.safeParse(validLoginPayload());
    expect(result.success).toBe(true);
  });

  it("accepts explicit empty params and query", () => {
    const payload = {
      ...validLoginPayload(),
      params: {},
      query: {}
    };

    const result = loginSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });
});