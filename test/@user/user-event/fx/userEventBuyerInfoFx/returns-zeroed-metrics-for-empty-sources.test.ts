import { describe, expect, it } from "vitest";
import {
	computeBuyerCloser,
	computeBuyerDecision,
	computeBuyerExpired,
	computeBuyerReaction,
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
});
