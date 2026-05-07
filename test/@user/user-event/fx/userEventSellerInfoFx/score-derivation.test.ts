import { describe, expect, it } from "vitest";
import { computeSellerScore } from "~/buyer/user-event/server/fx/userEventSellerInfoFx";

describe("userEventSellerInfoFx score derivation", () => {
	it("scores improved seller inputs above mixed-quality inputs", () => {
		const mixed = computeSellerScore({
			reaction: {
				total: 6,
				reactions: 5,
				terminal: 1,
				percent: 100,
				medianMs: 60 * 60 * 1000,
				p90Ms: 2 * 60 * 60 * 1000,
			},
			rejected: {
				total: 6,
				rejected: 2,
				percent: 33.33,
				medianMs: 24 * 60 * 60 * 1000,
				p90Ms: 2 * 24 * 60 * 60 * 1000,
			},
			resolved: {
				total: 6,
				resolved: 3,
				terminal: 3,
				percent: 50,
				medianMs: 2 * 24 * 60 * 60 * 1000,
				p90Ms: 3 * 24 * 60 * 60 * 1000,
			},
			expired: {
				total: 6,
				expired: 0,
				percent: 0,
			},
			activity: {
				bucket: "medium",
			},
			load: {
				bucket: "low",
			},
		});

		const improved = computeSellerScore({
			reaction: {
				total: 6,
				reactions: 5,
				terminal: 1,
				percent: 100,
				medianMs: 20 * 60 * 1000,
				p90Ms: 60 * 60 * 1000,
			},
			rejected: {
				total: 6,
				rejected: 1,
				percent: 16.67,
				medianMs: 24 * 60 * 60 * 1000,
				p90Ms: 24 * 60 * 60 * 1000,
			},
			resolved: {
				total: 6,
				resolved: 4,
				terminal: 2,
				percent: 66.67,
				medianMs: 24 * 60 * 60 * 1000,
				p90Ms: 2 * 24 * 60 * 60 * 1000,
			},
			expired: {
				total: 6,
				expired: 0,
				percent: 0,
			},
			activity: {
				bucket: "high",
			},
			load: {
				bucket: "low",
			},
		});

		expect(improved.score).toBeGreaterThan(mixed.score);
		expect(improved.rank).toBeGreaterThanOrEqual(5);
	});
});
