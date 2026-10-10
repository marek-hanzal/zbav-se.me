import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingEventCreateFx } from "~/buyer-listing-event/fx/listingEventCreateFx";
import { expectTaggedErrorFn } from "~/test/common/fx/expectTaggedErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabaseFn } from "~/test/testabaseFn";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("listingEventRateLimitFx", () => {
	it("rejects events for listings above buyer restriction", async () => {
		const database = await testabaseFn("listingEventCreateFx-restricted-listing");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});
			const listing = yield* createListingFx(seller.id, {
				title: "Restricted listing event marker",
				restriction: "adult",
			});

			const result = yield* Effect.result(
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

			expectTaggedErrorFn(result, {
				tag: "NotFoundErrorFx",
			});
			expect(events).toHaveLength(0);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
