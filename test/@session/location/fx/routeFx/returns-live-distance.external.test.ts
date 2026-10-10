import { getLogger } from "@logtape/logtape";
import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import { routeFx } from "~/session-location/fx/routeFx";
import { withTestGeoapifyFn } from "~/test/common/fn/withTestGeoapifyFn";

const source = {
	lat: 50.075539,
	lon: 14.4378,
};

const target = {
	lat: 49.195061,
	lon: 16.606837,
};

describe("routeFx", () => {
	it("returns matrix distance from the live routing provider", async () => {
		return Effect.gen(function* () {
			const distance = yield* routeFx({
				source,
				target,
				mode: "drive",
			});

			expect(distance).toBeGreaterThan(100_000);
			expect(distance).toBeLessThan(300_000);
		}).pipe(withTestGeoapifyFn(), withLoggerFn(getLogger("zbav-se.me")), Effect.runPromise);
	});
});
