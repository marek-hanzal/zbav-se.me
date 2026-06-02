import { describe, expect, it } from "vitest";
import { computeBuyerDecision } from "~/seller/user-event/server/fx/userEventBuyerInfoFx";
import { createBuyerTerminalRatioSource } from "./terminalRatioFixture";

describe("userEventBuyerInfoFx terminal ratio", () => {
	it("computes buyer decision ratio from grouped events", () => {
		expect(computeBuyerDecision(createBuyerTerminalRatioSource())).toMatchObject({
			total: 6,
			decisions: 4,
			terminal: 1,
			percent: 83.33333333333334,
		});
	});
});
