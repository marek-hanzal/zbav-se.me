import { describe, expect, it } from "vitest";
import {
	computeSellerExpiredFn,
	computeSellerReactionFn,
	computeSellerRejectedFn,
	computeSellerResolvedFn,
} from "~/buyer-user-event/fx/userEventSellerInfoFx";

describe("userEventSellerInfoFx edge cases", () => {
	it("returns zeroed metrics for empty sources", () => {
		expect(computeSellerReactionFn([])).toMatchObject({
			total: 0,
			reactions: 0,
			terminal: 0,
			percent: 0,
		});
		expect(computeSellerRejectedFn([])).toMatchObject({
			total: 0,
			rejected: 0,
			percent: 0,
		});
		expect(computeSellerResolvedFn([])).toMatchObject({
			total: 0,
			resolved: 0,
			terminal: 0,
			percent: 0,
		});
		expect(computeSellerExpiredFn([])).toMatchObject({
			total: 0,
			expired: 0,
			percent: 0,
		});
	});
});
