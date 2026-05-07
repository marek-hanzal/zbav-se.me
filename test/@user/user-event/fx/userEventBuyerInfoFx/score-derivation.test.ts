import { describe, expect, it } from "vitest";
import { computeBuyerScore } from "~/seller/user-event/server/fx/userEventBuyerInfoFx";

describe("userEventBuyerInfoFx score derivation", () => {
	it("scores stronger buyer inputs above mixed-quality inputs", () => {
		const mixed = computeBuyerScore({
			reaction: {
				total: 6,
				reactions: 4,
				terminal: 1,
				percent: 83.33,
				medianMs: 20 * 60 * 1000,
				p90Ms: 60 * 60 * 1000,
			},
			closer: {
				total: 6,
				closed: 1,
				percent: 16.67,
				medianMs: 35 * 60 * 1000,
				p90Ms: 35 * 60 * 1000,
			},
			decision: {
				total: 6,
				decisions: 4,
				terminal: 1,
				percent: 83.33,
			},
			expired: {
				total: 6,
				expired: 1,
				percent: 16.67,
			},
			activity: {
				bucket: "high",
			},
			load: {
				bucket: "low",
			},
		});

		const improved = computeBuyerScore({
			reaction: {
				total: 5,
				reactions: 5,
				terminal: 0,
				percent: 100,
				medianMs: 10 * 60 * 1000,
				p90Ms: 30 * 60 * 1000,
			},
			closer: {
				total: 5,
				closed: 0,
				percent: 0,
				medianMs: 0,
				p90Ms: 0,
			},
			decision: {
				total: 5,
				decisions: 5,
				terminal: 0,
				percent: 100,
			},
			expired: {
				total: 5,
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
