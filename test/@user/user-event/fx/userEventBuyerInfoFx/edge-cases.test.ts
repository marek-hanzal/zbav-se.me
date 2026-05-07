import { describe, expect, it } from "vitest";
import {
	computeBuyerCloser,
	computeBuyerDecision,
	computeBuyerExpired,
	computeBuyerReaction,
	computeBuyerScore,
} from "~/seller/user-event/server/fx/userEventBuyerInfoFx";

describe("userEventBuyerInfoFx edge cases", () => {
	it("returns zeroed metrics for empty sources", () => {
		expect(computeBuyerReaction([])).toMatchObject({
			total: 0,
			reactions: 0,
			terminal: 0,
			percent: 0,
		});
		expect(computeBuyerCloser([])).toMatchObject({
			total: 0,
			closed: 0,
			percent: 0,
		});
		expect(computeBuyerDecision([])).toMatchObject({
			total: 0,
			decisions: 0,
			terminal: 0,
			percent: 0,
		});
		expect(computeBuyerExpired([])).toMatchObject({
			total: 0,
			expired: 0,
			percent: 0,
		});
	});

	it("returns the lowest score for an empty metric set", () => {
		const result = computeBuyerScore({
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

		expect(result.score).toBe(0);
		expect(result.rank).toBe(1);
	});
});
