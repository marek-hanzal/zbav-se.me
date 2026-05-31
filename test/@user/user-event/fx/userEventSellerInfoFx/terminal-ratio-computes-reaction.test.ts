import { describe, expect, it } from "vitest";
import { computeSellerReaction } from "~/buyer/user-event/server/fx/userEventSellerInfoFx";
import { createSellerTerminalRatioSource } from "./terminalRatioFixture";

describe("userEventSellerInfoFx terminal ratio", () => {
	it("computes seller reaction ratio from grouped events", () => {
		expect(computeSellerReaction(createSellerTerminalRatioSource())).toMatchObject({
			total: 6,
			reactions: 5,
			terminal: 1,
			percent: 100,
		});
	});
});
