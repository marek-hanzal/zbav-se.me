import { describe, expect, it } from "vitest";
import { computeBuyerExpired } from "~/seller/user-event/server/fx/userEventBuyerInfoFx";
import { createBuyerTerminalRatioSource } from "./terminalRatioFixture";

describe("userEventBuyerInfoFx terminal ratio", () => {
	it("computes buyer expired ratio from grouped events", () => {
		expect(computeBuyerExpired(createBuyerTerminalRatioSource())).toMatchObject({
			total: 6,
			expired: 1,
			percent: 16.666666666666664,
		});
	});
});
