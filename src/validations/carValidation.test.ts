import { carIdParamSchema, createCarSchema, updateCarSchema } from "./carValidation.js";

const validObjectId = "507f1f77bcf86cd799439011";

const validCreatePayload = () => ({
  body: {
    brand: "Toyota",
    model: "Corolla",
    km_range: 120000
  }
});

const validUpdatePayload = () => ({
  params: { id: validObjectId },
  body: {
    brand: "Honda",
    model: "Civic",
    km_range: 98000
  }
});

describe("createCarSchema", () => {
  it("accepts a valid payload", () => {
    const result = createCarSchema.safeParse(validCreatePayload());
    expect(result.success).toBe(true);
  });

  it("trims brand and model", () => {
    const result = createCarSchema.safeParse({
      body: {
        brand: "  Toyota  ",
        model: "  Corolla  ",
        km_range: 120000
      }
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.body.brand).toBe("Toyota");
      expect(result.data.body.model).toBe("Corolla");
    }
  });

  it("rejects empty brand", () => {
    const result = createCarSchema.safeParse({
      body: {
        brand: "   ",
        model: "Corolla",
        km_range: 120000
      }
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message === "Brand is required")).toBe(true);
    }
  });

  it("rejects empty model", () => {
    const result = createCarSchema.safeParse({
      body: {
        brand: "Toyota",
        model: "   ",
        km_range: 120000
      }
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message === "Model is required")).toBe(true);
    }
  });

  it("rejects negative km_range", () => {
    const result = createCarSchema.safeParse({
      body: {
        brand: "Toyota",
        model: "Corolla",
        km_range: -1
      }
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message === "km_range must be 0 or greater")).toBe(true);
    }
  });

  it("rejects non-number km_range", () => {
    const result = createCarSchema.safeParse({
      body: {
        brand: "Toyota",
        model: "Corolla",
        km_range: "120000"
      }
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message === "km_range must be a number")).toBe(true);
    }
  });

  it("accepts missing params and query", () => {
    const result = createCarSchema.safeParse(validCreatePayload());
    expect(result.success).toBe(true);
  });

  it("accepts explicit empty params and query", () => {
    const result = createCarSchema.safeParse({
      ...validCreatePayload(),
      params: {},
      query: {}
    });

    expect(result.success).toBe(true);
  });
});

describe("carIdParamSchema", () => {
  it("accepts a valid object id", () => {
    const result = carIdParamSchema.safeParse({
      params: { id: validObjectId }
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid object id", () => {
    const result = carIdParamSchema.safeParse({
      params: { id: "123" }
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message === "Invalid car id")).toBe(true);
    }
  });

  it("rejects missing id", () => {
    const result = carIdParamSchema.safeParse({
      params: {}
    });

    expect(result.success).toBe(false);
  });

  it("accepts optional empty body and query", () => {
    const result = carIdParamSchema.safeParse({
      params: { id: validObjectId },
      body: {},
      query: {}
    });

    expect(result.success).toBe(true);
  });
});

describe("updateCarSchema", () => {
  it("accepts a valid payload", () => {
    const result = updateCarSchema.safeParse(validUpdatePayload());
    expect(result.success).toBe(true);
  });

  it("trims brand and model", () => {
    const result = updateCarSchema.safeParse({
      params: { id: validObjectId },
      body: {
        brand: "  Honda  ",
        model: "  Civic  ",
        km_range: 98000
      }
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.body.brand).toBe("Honda");
      expect(result.data.body.model).toBe("Civic");
    }
  });

  it("rejects invalid id", () => {
    const result = updateCarSchema.safeParse({
      params: { id: "bad-id" },
      body: {
        brand: "Honda",
        model: "Civic",
        km_range: 98000
      }
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message === "Invalid car id")).toBe(true);
    }
  });

  it("rejects empty brand", () => {
    const result = updateCarSchema.safeParse({
      params: { id: validObjectId },
      body: {
        brand: "   ",
        model: "Civic",
        km_range: 98000
      }
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message === "Brand is required")).toBe(true);
    }
  });

  it("rejects empty model", () => {
    const result = updateCarSchema.safeParse({
      params: { id: validObjectId },
      body: {
        brand: "Honda",
        model: "   ",
        km_range: 98000
      }
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message === "Model is required")).toBe(true);
    }
  });

  it("rejects negative km_range", () => {
    const result = updateCarSchema.safeParse({
      params: { id: validObjectId },
      body: {
        brand: "Honda",
        model: "Civic",
        km_range: -10
      }
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message === "km_range must be 0 or greater")).toBe(true);
    }
  });

  it("rejects non-number km_range", () => {
    const result = updateCarSchema.safeParse({
      params: { id: validObjectId },
      body: {
        brand: "Honda",
        model: "Civic",
        km_range: "98000"
      }
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message === "km_range must be a number")).toBe(true);
    }
  });

  it("accepts optional empty query", () => {
    const result = updateCarSchema.safeParse({
      ...validUpdatePayload(),
      query: {}
    });

    expect(result.success).toBe(true);
  });
});