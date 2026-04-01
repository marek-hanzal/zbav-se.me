import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/public/listing/server/fx/listingCollectionFx";
import { listingCountFx } from "~/public/listing/server/fx/listingCountFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createListingFx } from "~/test/utils/createListingFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("public listing visibility", () => {
	it("hides sold listings from collection and count", async () => {
		const database = await testabase("publicListing-hide-sold");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "public-listing-seller@test.cz",
						name: "Public Seller",
						password: "12345678",
					},
				}),
			);

			const liveListing = yield* createListingFx(seller.id);
			const soldListing = yield* createListingFx(seller.id);

			yield* Effect.promise(() =>
				database.kysely
					.updateTable("listing")
					.set({
						status: "sold",
						title: "Already sold",
					})
					.where("id", "=", soldListing.id)
					.executeTakeFirstOrThrow(),
			);

			const collection = yield* listingCollectionFx({
				scope: {},
			});

			expect(collection.map((item) => item.id)).toEqual([
				liveListing.id,
			]);

			const count = yield* listingCountFx({
				scope: {},
			});

			expect(count.where).toBe(1);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
