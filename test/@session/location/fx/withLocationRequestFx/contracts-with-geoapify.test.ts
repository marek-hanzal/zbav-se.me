import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withLocationRequestFx } from "~/session-location/fx/withLocationRequestFx";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";

describe("withLocationRequestFx", () => {
	it("returns parsed Geoapify features and respects observable request contract", async () => {
		const database = await testabaseFn("withLocationRequestFx-geoapify");

		return Effect.gen(function* () {
			const features = yield* withLocationRequestFx({
				text: "Praha",
				lang: "cs",
				limit: 1,
			});

			expect(features.length).toBeGreaterThan(0);
			expect(features.length).toBeLessThanOrEqual(1);

			const feature = features[0];

			if (!feature) {
				throw new Error("Expected Geoapify to return at least one feature for Praha");
			}

			expect(feature.properties.place_id).toBeTruthy();
			expect(feature.properties.formatted).toContain("Praha");
			expect(feature.properties.country_code.toLowerCase()).toBe("cz");
			expect(typeof feature.properties.lat).toBe("number");
			expect(typeof feature.properties.lon).toBe("number");
			expect(feature.properties.rank.confidence).toBeGreaterThan(0);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
