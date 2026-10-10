import { describe, expect, it } from "vitest";
import { computeBuyerReactionFn } from "~/seller-user-event/fx/userEventBuyerInfoFx";
import { createBuyerTerminalRatioSourceFn } from "./terminalRatioFixture";

describe("userEventBuyerInfoFx terminal ratio", () => {
	it("computes buyer reaction ratio from grouped events", () => {
		expect(computeBuyerReactionFn(createBuyerTerminalRatioSourceFn())).toMatchObject({
			total: 6,
			reactions: 4,
			terminal: 1,
			percent: 83.33333333333334,
		});
	});
});
