import { describe, expect, it } from "vitest";
import { computeSellerReactionFn } from "~/buyer-user-event/fx/userEventSellerInfoFx";
import { createSellerTerminalRatioSourceFn } from "./terminalRatioFixture";

describe("userEventSellerInfoFx terminal ratio", () => {
	it("computes seller reaction ratio from grouped events", () => {
		expect(computeSellerReactionFn(createSellerTerminalRatioSourceFn())).toMatchObject({
			total: 6,
			reactions: 5,
			terminal: 1,
			percent: 100,
		});
	});
});
