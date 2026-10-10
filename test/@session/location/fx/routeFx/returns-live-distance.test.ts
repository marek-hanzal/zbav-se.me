import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { routeFx } from "~/session-location/fx/routeFx";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";

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
		const database = await testabaseFn("routeFx-live-distance");

		return Effect.gen(function* () {
			const distance = yield* routeFx({
				source,
				target,
				mode: "drive",
			});

			expect(distance).toBeGreaterThan(100_000);
			expect(distance).toBeLessThan(300_000);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
