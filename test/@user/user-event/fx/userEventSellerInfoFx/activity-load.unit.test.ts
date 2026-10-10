import { describe, expect, it } from "vitest";
import { computeSellerScoreFn } from "~/buyer-user-event/fx/userEventSellerInfoFx";

describe("userEventSellerInfoFx activity/load", () => {
	it("adds activity and load bonuses to the seller score", () => {
		const weak = computeSellerScoreFn({
			reaction: {
				total: 0,
				reactions: 0,
				terminal: 0,
				percent: 0,
				medianMs: 0,
				p90Ms: 0,
			},
			rejected: {
				total: 0,
				rejected: 0,
				percent: 0,
				medianMs: 0,
				p90Ms: 0,
			},
			resolved: {
				total: 0,
				resolved: 0,
				terminal: 0,
				percent: 0,
				medianMs: 0,
				p90Ms: 0,
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
		const strong = computeSellerScoreFn({
			reaction: {
				total: 0,
				reactions: 0,
				terminal: 0,
				percent: 0,
				medianMs: 0,
				p90Ms: 0,
			},
			rejected: {
				total: 0,
				rejected: 0,
				percent: 0,
				medianMs: 0,
				p90Ms: 0,
			},
			resolved: {
				total: 0,
				resolved: 0,
				terminal: 0,
				percent: 0,
				medianMs: 0,
				p90Ms: 0,
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
