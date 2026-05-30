import { describe, expect, it } from "vitest";
import { computeSellerExpired } from "~/buyer/user-event/server/fx/userEventSellerInfoFx";
import { createSellerTerminalRatioSource } from "./terminalRatioFixture";

describe("userEventSellerInfoFx terminal ratio", () => {
	it("computes seller expired ratio from grouped events", () => {
		expect(computeSellerExpired(createSellerTerminalRatioSource())).toMatchObject({
			total: 6,
			expired: 0,
			percent: 0,
		});
	});
});
