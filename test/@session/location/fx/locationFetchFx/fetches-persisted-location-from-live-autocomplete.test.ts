import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { locationAutocompleteFx } from "~/session-location/fx/locationAutocompleteFx";
import { locationFetchFx } from "~/session-location/fx/locationFetchFx";
import { expectErrorFn } from "~/test/common/fx/expectErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";

describe("locationFetchFx", () => {
	it("fetches a location persisted by live autocomplete and rejects unknown ids", async () => {
		const database = await testabaseFn("locationFetchFx-live-contract");

		return Effect.gen(function* () {
			const [location] = yield* locationAutocompleteFx({
				text: "Praha",
				lang: "cs",
				limit: 1,
			});

			if (!location) {
				throw new Error("Expected live autocomplete to return at least one Praha location");
			}

			const fetched = yield* locationFetchFx({
				where: {
					id: location.id,
				},
			});

			expect(fetched.id).toBe(location.id);
			expect(fetched.query).toBe("Praha");
			expect(fetched.lang).toBe("cs");
			expect(fetched.address).toBeTruthy();

			const missing = yield* Effect.result(
				locationFetchFx({
					where: {
						id: "missing-location-id",
					},
				}),
			);

			expectErrorFn(missing);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
