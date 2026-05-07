import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingGetSellerInfoFx } from "~/buyer/listing/server/fx/listingGetSellerInfoFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("listingGetSellerInfoFx", () => {
	it("returns seller listings count as a number", async () => {
		const database = await testabase("listingGetSellerInfoFx-listings-number");

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
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
