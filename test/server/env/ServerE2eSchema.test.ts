import { describe, expect, it } from "vitest";
import { ServerE2eSchema } from "~/server/env/ServerE2eSchema";

describe("ServerE2eSchema", () => {
	it("accepts the e2e gate", () => {
		expect(
			ServerE2eSchema.parse({
				SERVER_E2E: "e2e",
			}).SERVER_E2E,
		).toBe("e2e");
	});

	it("silently drops any other value", () => {
		expect(
			ServerE2eSchema.parse({
				SERVER_E2E: "prod",
			}).SERVER_E2E,
		).toBeUndefined();
	});

	it("silently drops when missing", () => {
		expect(ServerE2eSchema.parse({}).SERVER_E2E).toBeUndefined();
	});
});
