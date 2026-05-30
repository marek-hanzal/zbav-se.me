import { describe, expect, it } from "vitest";
import { computeBuyerReaction } from "~/seller/user-event/server/fx/userEventBuyerInfoFx";
import { createBuyerTerminalRatioSource } from "./terminalRatioFixture";

describe("userEventBuyerInfoFx terminal ratio", () => {
	it("computes buyer reaction ratio from grouped events", () => {
		expect(computeBuyerReaction(createBuyerTerminalRatioSource())).toMatchObject({
			total: 6,
			reactions: 4,
			terminal: 1,
			percent: 83.33333333333334,
		});
	});
});
