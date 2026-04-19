import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { routeFx } from "~/session/location/server/fx/routeFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";

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
		const database = await testabase("routeFx-live-distance");

		return Effect.gen(function* () {
			const distance = yield* routeFx({
				source,
				target,
				mode: "drive",
			});

			expect(distance).toBeGreaterThan(100_000);
			expect(distance).toBeLessThan(300_000);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
