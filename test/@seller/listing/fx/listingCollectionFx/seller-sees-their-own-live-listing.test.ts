import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/seller/listing/server/fx/listingCollectionFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createListingFx } from "~/test/utils/createListingFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("listingCollectionFx (seller)", () => {
	it("seller sees their own live listing", async () => {
		const database = await testabase("sellerListing-live");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "seller@seller-listing-live.cz",
						name: "Seller",
						password: "12345678",
					},
				}),
			);

			const listing = yield* createListingFx(seller.id);

			const collection = yield* listingCollectionFx({
				scope: {
					userId: seller.id,
				},
			});

			expect(collection.map((l) => l.id)).toContain(listing.id);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
