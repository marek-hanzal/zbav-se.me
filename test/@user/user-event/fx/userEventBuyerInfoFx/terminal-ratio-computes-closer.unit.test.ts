import { describe, expect, it } from "vitest";
import { computeBuyerCloserFn } from "~/seller-user-event/fx/userEventBuyerInfoFx";
import { createBuyerTerminalRatioSourceFn } from "./terminalRatioFixture";

describe("userEventBuyerInfoFx terminal ratio", () => {
	it("computes buyer closer ratio from grouped events", () => {
		expect(computeBuyerCloserFn(createBuyerTerminalRatioSourceFn())).toMatchObject({
			total: 6,
			closed: 1,
			percent: 16.666666666666664,
		});
	});
});
