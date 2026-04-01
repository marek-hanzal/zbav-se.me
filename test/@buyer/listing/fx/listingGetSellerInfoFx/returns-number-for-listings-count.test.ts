import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingGetSellerInfoFx } from "~/buyer/listing/server/fx/listingGetSellerInfoFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createListingFx } from "~/test/utils/createListingFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("listingGetSellerInfoFx", () => {
	it("returns seller listings count as a number", async () => {
		const database = await testabase("listingGetSellerInfoFx-listings-number");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const signUp = (email: string, name: string) =>
				Effect.promise(() =>
					api.signUpEmail({
						body: {
							email,
							name,
							password: "12345678",
						},
					}),
				);

			const { user: seller } = yield* signUp(
				"seller-info-seller@test.cz",
				"Seller Info Seller",
			);

			yield* signUp("seller-info-buyer@test.cz", "Seller Info Buyer");

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
