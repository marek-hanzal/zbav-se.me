import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/seller/listing/server/fx/listingCollectionFx";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";

describe("listingCollectionFx (seller)", () => {
	it("seller does not see other sellers' listings", async () => {
		const database = await testabase("sellerListing-isolation");

		return Effect.gen(function* () {
			const { api } = auth(() => database.dialect);

			const { user: seller1 } = yield* Effect.promise(async () => {
				return api.signUpEmail({
					body: {
						email: "seller1@seller-listing-iso.cz",
						name: "Seller1",
						password: "12345678",
					},
				});
			});
			const { user: seller2 } = yield* Effect.promise(async () => {
				return api.signUpEmail({
					body: {
						email: "seller2@seller-listing-iso.cz",
						name: "Seller2",
						password: "12345678",
					},
				});
			});

			const listing1 = yield* createListingFx(seller1.id);
			const listing2 = yield* createListingFx(seller2.id);

			const collection = yield* listingCollectionFx({
				scope: {
					userId: seller1.id,
				},
			});

			const ids = collection.map((l) => l.id);
			expect(ids).toContain(listing1.id);
			expect(ids).not.toContain(listing2.id);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
