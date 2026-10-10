import { describe, expect, it } from "vitest";
import {
	computeBuyerCloserFn,
	computeBuyerDecisionFn,
	computeBuyerExpiredFn,
	computeBuyerReactionFn,
} from "~/seller-user-event/fx/userEventBuyerInfoFx";

describe("userEventBuyerInfoFx edge cases", () => {
	it("returns zeroed metrics for empty sources", () => {
		expect(computeBuyerReactionFn([])).toMatchObject({
			total: 0,
			reactions: 0,
			terminal: 0,
			percent: 0,
		});
		expect(computeBuyerCloserFn([])).toMatchObject({
			total: 0,
			closed: 0,
			percent: 0,
		});
		expect(computeBuyerDecisionFn([])).toMatchObject({
			total: 0,
			decisions: 0,
			terminal: 0,
			percent: 0,
		});
		expect(computeBuyerExpiredFn([])).toMatchObject({
			total: 0,
			expired: 0,
			percent: 0,
		});
	});
});
