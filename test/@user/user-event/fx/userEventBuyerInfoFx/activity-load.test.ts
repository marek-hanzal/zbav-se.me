import { describe, expect, it } from "vitest";
import { computeBuyerScoreFn } from "~/seller-user-event/fx/userEventBuyerInfoFx";

describe("userEventBuyerInfoFx activity/load", () => {
	it("adds activity and load bonuses to the buyer score", () => {
		const weak = computeBuyerScoreFn({
			reaction: {
				total: 0,
				reactions: 0,
				terminal: 0,
				percent: 0,
				medianMs: 0,
				p90Ms: 0,
			},
			closer: {
				total: 0,
				closed: 0,
				percent: 0,
				medianMs: 0,
				p90Ms: 0,
			},
			decision: {
				total: 0,
				decisions: 0,
				terminal: 0,
				percent: 0,
			},
			expired: {
				total: 0,
				expired: 0,
				percent: 0,
			},
			activity: {
				bucket: "low",
			},
			load: {
				bucket: "high",
			},
		});
		const strong = computeBuyerScoreFn({
			reaction: {
				total: 0,
				reactions: 0,
				terminal: 0,
				percent: 0,
				medianMs: 0,
				p90Ms: 0,
			},
			closer: {
				total: 0,
				closed: 0,
				percent: 0,
				medianMs: 0,
				p90Ms: 0,
			},
			decision: {
				total: 0,
				decisions: 0,
				terminal: 0,
				percent: 0,
			},
			expired: {
				total: 0,
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

		expect(strong.score).toBeGreaterThan(weak.score);
	});
});
