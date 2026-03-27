import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/client/@seller/listing/server/fx/listingCollectionFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createListingFx } from "~/test/utils/createListingFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("listingCollectionFx (seller)", () => {
	it("seller sees their own live listing", async () => {
		const database = await testabase("sellerListing-live");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@seller-listing-live.cz",
				name: "Seller",
				password: "12345678",
			},
		});

		const listing = await createListingFx(seller.id).pipe(
			withRuntimeFx(database),
			Effect.runPromise,
		);

		const collection = await Effect.gen(function* () {
			return yield* listingCollectionFx({
				scope: {
					userId: seller.id,
				},
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		expect(collection.map((l) => l.id)).toContain(listing.id);
	});
});
