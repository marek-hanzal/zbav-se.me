import { describe, expect, it } from "vitest";
import { computeSellerRejectedFn } from "~/buyer-user-event/fx/userEventSellerInfoFx";
import { createSellerTerminalRatioSourceFn } from "./terminalRatioFixture";

describe("userEventSellerInfoFx terminal ratio", () => {
	it("computes seller rejected ratio from grouped events", () => {
		expect(computeSellerRejectedFn(createSellerTerminalRatioSourceFn())).toMatchObject({
			total: 6,
			rejected: 2,
			percent: 33.33333333333333,
		});
	});
});
