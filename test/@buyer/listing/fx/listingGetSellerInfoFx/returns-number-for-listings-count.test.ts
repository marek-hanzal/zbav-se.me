import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingGetSellerInfoFx } from "~/buyer/listing/server/fx/listingGetSellerInfoFx";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";

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
