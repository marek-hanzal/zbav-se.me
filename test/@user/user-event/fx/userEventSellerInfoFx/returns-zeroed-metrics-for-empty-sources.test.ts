import { describe, expect, it } from "vitest";
import {
	computeSellerExpired,
	computeSellerReaction,
	computeSellerRejected,
	computeSellerResolved,
} from "~/buyer/user-event/server/fx/userEventSellerInfoFx";

describe("userEventSellerInfoFx edge cases", () => {
	it("returns zeroed metrics for empty sources", () => {
		expect(computeSellerReaction([])).toMatchObject({
			total: 0,
			reactions: 0,
			terminal: 0,
			percent: 0,
		});
		expect(computeSellerRejected([])).toMatchObject({
			total: 0,
			rejected: 0,
			percent: 0,
		});
		expect(computeSellerResolved([])).toMatchObject({
			total: 0,
			resolved: 0,
			terminal: 0,
			percent: 0,
		});
		expect(computeSellerExpired([])).toMatchObject({
			total: 0,
			expired: 0,
			percent: 0,
		});
	});
});
