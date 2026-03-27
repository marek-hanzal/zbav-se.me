import { describe, expect, it } from "vitest";
import { InboxWhereSchema } from "~/server/@user/inbox/schema/InboxWhereSchema";

describe("inbox family", () => {
	it("accepts only known family values in where schema", () => {
		expect(
			InboxWhereSchema.parse({
				family: "transaction",
			}).family,
		).toBe("transaction");

		expect(() =>
			InboxWhereSchema.parse({
				family: "whatever",
			}),
		).toThrow();
	});
});
