import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/buyer/listing/server/fx/listingCollectionFx";
import { listingCountFx } from "~/buyer/listing/server/fx/listingCountFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { patchCategoryDiscoveryFx } from "~/test/listing/fx/listingSearchFixturesFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { categoryFetchFx } from "~/user/category/server/fx/categoryFetchFx";

describe("buyer listing discovery flow", () => {
	it("hides explicit categories unless the buyer query asks for a category", async () => {
		const database = await testabase("buyer-listing-category-discovery-flow");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});
			const implicitCategory = yield* categoryFetchFx({
				userId: users.buyer.id,
				where: {
					slug: "pocitace-a-kancelar--uloziste-ssd-hdd",
				},
				scope: {},
			});
			const explicitCategory = yield* categoryFetchFx({
				userId: users.buyer.id,
				where: {
					slug: "pocitace-a-kancelar--monitor",
				},
				scope: {},
			});

			yield* patchCategoryDiscoveryFx(database, {
				id: explicitCategory.id,
				discovery: "explicit",
			});

			const title = "Buyer category discovery visibility marker";
			const implicitListing = yield* createListingFx(users.seller.id, {
				title,
				categoryId: implicitCategory.id,
			});
			const explicitListing = yield* createListingFx(users.seller.id, {
				title,
				categoryId: explicitCategory.id,
			});

			const defaultCollection = yield* listingCollectionFx({
				userId: users.buyer.id,
				scope: {},
				where: {
					// title,
				},
			});
			const defaultCount = yield* listingCountFx({
				userId: users.buyer.id,
				scope: {},
				where: {
					// title,
				},
			});
			const explicitByCategory = yield* listingCollectionFx({
				userId: users.buyer.id,
				scope: {},
				where: {
					// title,
					categoryId: explicitCategory.id,
				},
			});
			const explicitByCategoryIn = yield* listingCollectionFx({
				userId: users.buyer.id,
				scope: {},
				where: {
					// title,
					categoryIdIn: [
						explicitCategory.id,
					],
				},
			});

			expect(defaultCollection.map((item) => item.id)).toEqual([
				implicitListing.id,
			]);
			expect(defaultCount).toBe(defaultCollection.length);
			expect(explicitByCategory.map((item) => item.id)).toEqual([
				explicitListing.id,
			]);
			expect(explicitByCategoryIn.map((item) => item.id)).toEqual([
				explicitListing.id,
			]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
