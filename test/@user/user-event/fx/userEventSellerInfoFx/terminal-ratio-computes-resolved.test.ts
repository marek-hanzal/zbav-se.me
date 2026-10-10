import { describe, expect, it } from "vitest";
import { computeSellerResolved } from "~/buyer-user-event/fx/userEventSellerInfoFx";
import { createSellerTerminalRatioSource } from "./terminalRatioFixture";

describe("userEventSellerInfoFx terminal ratio", () => {
	it("computes seller resolved ratio from grouped events", () => {
		expect(computeSellerResolved(createSellerTerminalRatioSource())).toMatchObject({
			total: 6,
			resolved: 3,
			terminal: 3,
			percent: 50,
		});
	});
});
