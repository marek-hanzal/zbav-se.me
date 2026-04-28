import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/public/listing/server/fx/listingCollectionFx";
import { listingCountFx } from "~/public/listing/server/fx/listingCountFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import {
	categoryIdBySlugFx,
	patchListingSearchFixtureFx,
} from "~/test/listing/fx/listingSearchFixturesFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("public listing search flow", () => {
	it("allows only public-safe restrictions even with explicit category filters", async () => {
		const database = await testabase("public-listing-restriction-flow");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const openCategory = yield* categoryIdBySlugFx(
				database,
				"pocitace-a-kancelar--uloziste-ssd-hdd",
			);
			const adultRelaxedCategory = yield* categoryIdBySlugFx(
				database,
				"vape-elektronicke-cigarety--mody",
			);
			const adultCategory = yield* categoryIdBySlugFx(
				database,
				"tv-audio-a-foto--drony-s-kamerou",
			);
			const sensitiveCategory = yield* categoryIdBySlugFx(
				database,
				"airsoft--airsoftove-pistole",
			);

			const openListing = yield* createListingFx(seller.id, {
				title: "Public restriction marker open",
				categoryId: openCategory.id,
			});
			const adultRelaxedListing = yield* createListingFx(seller.id, {
				title: "Public restriction marker relaxed",
				categoryId: adultRelaxedCategory.id,
			});
			const adultCategoryListing = yield* createListingFx(seller.id, {
				title: "Public restriction marker adult category",
				categoryId: adultCategory.id,
			});
			const sensitiveCategoryListing = yield* createListingFx(seller.id, {
				title: "Public restriction marker sensitive category",
				categoryId: sensitiveCategory.id,
			});
			const adultListingRestriction = yield* createListingFx(seller.id, {
				title: "Public restriction marker listing adult",
				categoryId: openCategory.id,
			});
			const restrictedListingRestriction = yield* createListingFx(seller.id, {
				title: "Public restriction marker listing restricted",
				categoryId: openCategory.id,
			});

			yield* patchListingSearchFixtureFx(database, {
				id: adultListingRestriction.id,
				restriction: "adult",
			});
			yield* patchListingSearchFixtureFx(database, {
				id: restrictedListingRestriction.id,
				restriction: "restricted",
			});

			const categoryIdIn = [
				openCategory.id,
				adultRelaxedCategory.id,
				adultCategory.id,
				sensitiveCategory.id,
			];
			const collection = yield* listingCollectionFx({
				scope: {},
				where: {
					// title: "Public restriction marker",
					categoryIdIn,
				},
				sort: [
					{
						field: "createdAt",
						order: "asc",
					},
				],
			});
			const count = yield* listingCountFx({
				scope: {},
				where: {
					// title: "Public restriction marker",
					categoryIdIn,
				},
			});

			expect(collection.map((item) => item.id)).toEqual([
				openListing.id,
				adultRelaxedListing.id,
			]);
			expect(collection.map((item) => item.id)).not.toContain(adultCategoryListing.id);
			expect(collection.map((item) => item.id)).not.toContain(sensitiveCategoryListing.id);
			expect(collection.map((item) => item.id)).not.toContain(adultListingRestriction.id);
			expect(collection.map((item) => item.id)).not.toContain(
				restrictedListingRestriction.id,
			);
			expect(count).toBe(collection.length);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
