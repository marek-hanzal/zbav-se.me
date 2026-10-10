import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { locationAutocompleteFx } from "~/session-location/fx/locationAutocompleteFx";
import { withLocationListFx } from "~/session-location/fx/withLocationListFx";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";

describe("withLocationListFx", () => {
	it("returns mapped list data from persisted locations", async () => {
		const database = await testabaseFn("withLocationListFx-live-list");

		return Effect.gen(function* () {
			yield* locationAutocompleteFx({
				text: "Praha",
				lang: "cs",
				limit: 3,
			});

			const locations = yield* withLocationListFx({
				where: {
					query: "Praha",
					lang: "cs",
				},
				cursor: {
					page: 0,
					size: 2,
				},
				sort: [
					{
						field: "confidence",
						order: "desc",
					},
				],
				scope: {},
			});

			expect(locations.length).toBeGreaterThan(0);
			expect(locations.length).toBeLessThanOrEqual(2);
			expect(locations[0]?.id).toBeTruthy();
			expect(locations[0]?.query).toBe("Praha");
			expect(locations[0]?.lang).toBe("cs");
			expect(typeof locations[0]?.confidence).toBe("number");
			expect(locations[0]?.address).toContain("Praha");
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
