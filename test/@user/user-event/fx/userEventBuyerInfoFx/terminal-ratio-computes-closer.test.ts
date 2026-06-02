import { describe, expect, it } from "vitest";
import { computeBuyerCloser } from "~/seller/user-event/server/fx/userEventBuyerInfoFx";
import { createBuyerTerminalRatioSource } from "./terminalRatioFixture";

describe("userEventBuyerInfoFx terminal ratio", () => {
	it("computes buyer closer ratio from grouped events", () => {
		expect(computeBuyerCloser(createBuyerTerminalRatioSource())).toMatchObject({
			total: 6,
			closed: 1,
			percent: 16.666666666666664,
		});
	});
});
