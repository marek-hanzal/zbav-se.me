import { describe, expect, it } from "vitest";
import { computeBuyerExpiredFn } from "~/seller-user-event/fx/userEventBuyerInfoFx";
import { createBuyerTerminalRatioSourceFn } from "./terminalRatioFixture";

describe("userEventBuyerInfoFx terminal ratio", () => {
	it("computes buyer expired ratio from grouped events", () => {
		expect(computeBuyerExpiredFn(createBuyerTerminalRatioSourceFn())).toMatchObject({
			total: 6,
			expired: 1,
			percent: 16.666666666666664,
		});
	});
});
