import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withListingPingFx } from "~/public/listing/server/fx/withListingPingFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("withListingPingFx", () => {
	it("returns false for missing listings and true for existing listings", async () => {
		const database = await testabase("withListingPingFx-exists");

		return Effect.gen(function* () {
			const { seller } = yield* createUsersFx({});
			const listing = yield* createListingFx(seller.id, {
				title: "Ping visible listing",
			});

			const existing = yield* withListingPingFx({
				id: listing.id,
			});
			const missing = yield* withListingPingFx({
				id: "missing-listing-id",
			});

			expect(existing).toBe(true);
			expect(missing).toBe(false);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
