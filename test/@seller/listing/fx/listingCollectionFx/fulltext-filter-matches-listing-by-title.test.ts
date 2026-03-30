import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/seller/listing/server/fx/listingCollectionFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createListingFx } from "~/test/utils/createListingFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("listingCollectionFx (seller)", () => {
	it("fulltext filter matches listing by title", async () => {
		const database = await testabase("sellerListing-fulltext");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@seller-listing-ft.cz",
				name: "Seller",
				password: "12345678",
			},
		});

		// Two listings with different titles — fixture uses "Test listing"
		await createListingFx(seller.id).pipe(withRuntimeFx(database), Effect.runPromise);

		const collection = await Effect.gen(function* () {
			return yield* listingCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					fulltext: "Test listing",
				},
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		expect(collection.length).toBeGreaterThanOrEqual(1);
		expect(collection.every((l) => l.title.toLowerCase().includes("test"))).toBe(true);

		// Non-matching search returns empty
		const empty = await Effect.gen(function* () {
			return yield* listingCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					fulltext: "xyzzy-nonexistent-title",
				},
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		expect(empty).toHaveLength(0);
	});
});
