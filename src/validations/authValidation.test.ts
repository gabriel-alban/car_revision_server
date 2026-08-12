import { registerSchema } from "./authValidation.js";

describe("registerSchema", () => {
  it("accepts a valid payload", () => {
    const result = registerSchema.safeParse({
      body: {
        username: "alban123",
        email: "user@example.com",
        password: "StrongPass1!"
      }
    });

    expect(result.success).toBe(true);
  });

  it("rejects weak password", () => {
    const result = registerSchema.safeParse({
      body: {
        username: "alban123",
        email: "user@example.com",
        password: "weak"
      }
    });

    expect(result.success).toBe(false);
  });
});