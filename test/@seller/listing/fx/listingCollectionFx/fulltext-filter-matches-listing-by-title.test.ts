import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/seller/listing/server/fx/listingCollectionFx";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";

describe("listingCollectionFx (seller)", () => {
	it("fulltext filter matches listing by title", async () => {
		const database = await testabase("sellerListing-fulltext");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "seller@seller-listing-ft.cz",
						name: "Seller",
						password: "12345678",
					},
				}),
			);

			yield* createListingFx(seller.id);

			const collection = yield* listingCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					fulltext: "Test listing",
				},
			});

			expect(collection.length).toBeGreaterThanOrEqual(1);
			expect(collection.every((l) => l.title.toLowerCase().includes("test"))).toBe(true);

			const empty = yield* listingCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					fulltext: "xyzzy-nonexistent-title",
				},
			});

			expect(empty).toHaveLength(0);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
