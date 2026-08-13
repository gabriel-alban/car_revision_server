import { createRevisionSchema, revisionParamSchema } from './revisionValidation.js';

const validPayload = () => ({
    body: {
        revision_title: 'Oil change',
        revision_description: 'Replace engine oil and oil filter',
        current_km_number: 45000,
        next_km_number: 55000,
        revision_type: 'consumable',
        date: '2026-08-13',
        sendAlert: true,
        car: '507f1f77bcf86cd799439011' 
    }
});

describe("create revisionSchema", () => {
    it("should accept a valid payload", () => {
        const result = createRevisionSchema.safeParse(validPayload());
        expect(result.success).toBe(true);
    });

    it("trims the revision title and description", () => {
        const result = createRevisionSchema.safeParse({
            body: {
                ...validPayload().body,
                revision_title: '  Oil change  ',
                revision_description: '  Replace engine oil and oil filter  '
            }
        });

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.body.revision_title).toBe('Oil change');
            expect(result.data.body.revision_description).toBe('Replace engine oil and oil filter');
        }
    });

    it("coerces date strings and defaults sendAlert to true", () => {
       const { sendAlert, ...body } = validPayload().body;

        const result = createRevisionSchema.safeParse({ body });

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.body.date).toBeInstanceOf(Date);
            expect(result.data.body.sendAlert).toBe(true);
        }
    });

    it("accepts a payload with optional fields omitted", () => {
        const { revision_description, next_km_number, revision_type, date, ...body } = validPayload().body;

        const result = createRevisionSchema.safeParse({ body });

        expect(result.success).toBe(true);
    });

    it("accepts zero for current and next kilometre numbers", () => {
        const result = createRevisionSchema.safeParse({
            body: {
                ...validPayload().body,
                current_km_number: 0,
                next_km_number: 0
            }
        });

        expect(result.success).toBe(true);
    });

    it("rejects a title shorter than four characters", () => {
        const result = createRevisionSchema.safeParse({
            body: { ...validPayload().body, revision_title: 'Oil' }
        });

        expect(result.success).toBe(false);
    });

    it("rejects a description shorter than ten characters", () => {
        const result = createRevisionSchema.safeParse({
            body: { ...validPayload().body, revision_description: 'Too short' }
        });

        expect(result.success).toBe(false);
    });

    it("rejects negative kilometre numbers", () => {
        const result = createRevisionSchema.safeParse({
            body: { ...validPayload().body, current_km_number: -1 }
        });

        expect(result.success).toBe(false);
    });

    it("rejects non-number kilometre values", () => {
        const result = createRevisionSchema.safeParse({
            body: { ...validPayload().body, current_km_number: '45000' }
        });

        expect(result.success).toBe(false);
    });

    it("rejects an invalid revision type", () => {
        const result = createRevisionSchema.safeParse({
            body: { ...validPayload().body, revision_type: 'inspection' }
        });

        expect(result.success).toBe(false);
    });

    it("rejects an invalid car id", () => {
        const result = createRevisionSchema.safeParse({
            body: { ...validPayload().body, car: 'not-an-object-id' }
        });

        expect(result.success).toBe(false);
    });

    it("rejects missing required fields", () => {
        const result = createRevisionSchema.safeParse({ body: {} });

        expect(result.success).toBe(false);
    });

    it("accepts explicit empty params and query", () => {
        const result = createRevisionSchema.safeParse({
            ...validPayload(),
            params: {},
            query: {}
        });

        expect(result.success).toBe(true);
    });
});

describe("revisionParamSchema", () => {
    it("accepts valid car and revision ids", () => {
        const result = revisionParamSchema.safeParse({
            params: {
                carId: '507f1f77bcf86cd799439011',
                id: '507f1f77bcf86cd799439012'
            }
        });

        expect(result.success).toBe(true);
    });

    it("rejects invalid car or revision ids", () => {
        const result = revisionParamSchema.safeParse({
            params: {
                carId: 'invalid-car-id',
                id: 'invalid-revision-id'
            }
        });

        expect(result.success).toBe(false);
    });

    it("accepts optional empty body and query", () => {
        const result = revisionParamSchema.safeParse({
            params: {
                carId: '507f1f77bcf86cd799439011',
                id: '507f1f77bcf86cd799439012'
            },
            body: {},
            query: {}
        });

        expect(result.success).toBe(true);
    });
});