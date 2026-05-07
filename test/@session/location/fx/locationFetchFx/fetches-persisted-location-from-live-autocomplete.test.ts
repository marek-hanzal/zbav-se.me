import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { locationAutocompleteFx } from "~/session/location/server/fx/locationAutocompleteFx";
import { locationFetchFx } from "~/session/location/server/fx/locationFetchFx";
import { expectErrorFx } from "~/test/common/fx/expectErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";

describe("locationFetchFx", () => {
	it("fetches a location persisted by live autocomplete and rejects unknown ids", async () => {
		const database = await testabase("locationFetchFx-live-contract");

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

			const missing = yield* Effect.either(
				locationFetchFx({
					where: {
						id: "missing-location-id",
					},
				}),
			);

			expectErrorFx(missing);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
