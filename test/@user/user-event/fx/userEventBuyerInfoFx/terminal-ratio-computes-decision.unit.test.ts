import { describe, expect, it } from "vitest";
import { computeBuyerDecisionFn } from "~/seller-user-event/fx/userEventBuyerInfoFx";
import { createBuyerTerminalRatioSourceFn } from "./terminalRatioFixture";

describe("userEventBuyerInfoFx terminal ratio", () => {
	it("computes buyer decision ratio from grouped events", () => {
		expect(computeBuyerDecisionFn(createBuyerTerminalRatioSourceFn())).toMatchObject({
			total: 6,
			decisions: 4,
			terminal: 1,
			percent: 83.33333333333334,
		});
	});
});
