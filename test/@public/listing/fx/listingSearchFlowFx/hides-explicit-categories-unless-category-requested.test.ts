import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/public/listing/server/fx/listingCollectionFx";
import { listingCountFx } from "~/public/listing/server/fx/listingCountFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import {
	categoryIdBySlugFx,
	patchCategoryDiscoveryFx,
} from "~/test/listing/fx/listingSearchFixturesFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("public listing search flow", () => {
	it("hides explicit categories unless the query asks for a category", async () => {
		const database = await testabase("public-listing-category-discovery-flow");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const implicitCategory = yield* categoryIdBySlugFx(
				database,
				"pocitace-a-kancelar--uloziste-ssd-hdd",
			);
			const explicitCategory = yield* categoryIdBySlugFx(
				database,
				"pocitace-a-kancelar--monitor",
			);

			yield* patchCategoryDiscoveryFx(database, {
				id: explicitCategory.id,
				discovery: "explicit",
			});

			const title = "Category discovery visibility marker";
			const implicitListing = yield* createListingFx(seller.id, {
				title,
				categoryId: implicitCategory.id,
			});
			const explicitListing = yield* createListingFx(seller.id, {
				title,
				categoryId: explicitCategory.id,
			});

			const defaultCollection = yield* listingCollectionFx({
				scope: {},
				where: {
					// title,
				},
			});
			const emptyCategoryCollection = yield* listingCollectionFx({
				scope: {},
				where: {
					// title,
					categoryIdIn: [],
				},
			});
			const defaultCount = yield* listingCountFx({
				scope: {},
				where: {
					// title,
				},
			});
			const explicitByCategory = yield* listingCollectionFx({
				scope: {},
				where: {
					// title,
					categoryId: explicitCategory.id,
				},
			});
			const explicitByCategoryIn = yield* listingCollectionFx({
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
			expect(emptyCategoryCollection.map((item) => item.id)).toEqual([
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
