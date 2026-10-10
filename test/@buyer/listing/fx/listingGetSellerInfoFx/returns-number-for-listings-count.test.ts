import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingGetSellerInfoFx } from "~/buyer-listing/fx/listingGetSellerInfoFx";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabaseFn } from "~/test/testabaseFn";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("listingGetSellerInfoFx", () => {
	it("returns seller listings count as a number", async () => {
		const database = await testabaseFn("listingGetSellerInfoFx-listings-number");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});

			yield* leaseTestUserFx({});

			const firstListing = yield* createListingFx(seller.id);
			yield* createListingFx(seller.id);

			const sellerInfo = yield* listingGetSellerInfoFx({
				listingId: firstListing.id,
			});

			expect(typeof sellerInfo.listings).toBe("number");
			expect(sellerInfo.listings).toBe(2);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
