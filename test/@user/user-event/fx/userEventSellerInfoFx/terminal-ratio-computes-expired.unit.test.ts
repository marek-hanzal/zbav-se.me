import { describe, expect, it } from "vitest";
import { computeSellerExpiredFn } from "~/buyer-user-event/fx/userEventSellerInfoFx";
import { createSellerTerminalRatioSourceFn } from "./terminalRatioFixture";

describe("userEventSellerInfoFx terminal ratio", () => {
	it("computes seller expired ratio from grouped events", () => {
		expect(computeSellerExpiredFn(createSellerTerminalRatioSourceFn())).toMatchObject({
			total: 6,
			expired: 0,
			percent: 0,
		});
	});
});
