import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/seller-listing/fx/listingCollectionFx";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabaseFn } from "~/test/testabaseFn";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("listingCollectionFx (seller)", () => {
	it("seller sees their own live listing", async () => {
		const database = await testabaseFn("sellerListing-live");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});

			const listing = yield* createListingFx(seller.id);

			const collection = yield* listingCollectionFx({
				userId: seller.id,
				scope: {
					userId: seller.id,
				},
			});

			expect(collection.map((l) => l.id)).toContain(listing.id);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
