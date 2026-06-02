import { describe, expect, it } from "vitest";
import { computeSellerRejected } from "~/buyer/user-event/server/fx/userEventSellerInfoFx";
import { createSellerTerminalRatioSource } from "./terminalRatioFixture";

describe("userEventSellerInfoFx terminal ratio", () => {
	it("computes seller rejected ratio from grouped events", () => {
		expect(computeSellerRejected(createSellerTerminalRatioSource())).toMatchObject({
			total: 6,
			rejected: 2,
			percent: 33.33333333333333,
		});
	});
});
