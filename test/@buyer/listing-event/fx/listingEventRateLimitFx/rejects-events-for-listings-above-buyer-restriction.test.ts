import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingEventCreateFx } from "~/buyer/listing-event/server/fx/listingEventCreateFx";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("listingEventRateLimitFx", () => {
	it("rejects events for listings above buyer restriction", async () => {
		const database = await testabase("listingEventCreateFx-restricted-listing");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});
			const listing = yield* createListingFx(seller.id, {
				title: "Restricted listing event marker",
				restriction: "adult",
			});

			const result = yield* Effect.either(
				listingEventCreateFx({
					userId: buyer.id,
					listingId: listing.id,
					event: "impression",
				}),
			);
			const events = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("listing_event")
					.select("id")
					.where("listingId", "=", listing.id)
					.execute(),
			);

			expectTaggedErrorFx(result, {
				tag: "NotFoundErrorFx",
			});
			expect(events).toHaveLength(0);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
