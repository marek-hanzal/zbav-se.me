import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/buyer/listing/server/fx/listingCollectionFx";
import { listingCountFx } from "~/buyer/listing/server/fx/listingCountFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import {
	createRestrictedCategoryFx,
	createUserRestrictionFx,
} from "~/test/listing/fx/listingSearchFixturesFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("buyer listing discovery flow", () => {
	it("filters listings by active buyer restriction regardless of category input", async () => {
		const database = await testabase("buyer-listing-active-restriction-scope");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});
			const noneCategory = yield* createRestrictedCategoryFx(database, {
				slug: "buyer-listing-restriction-none",
				restriction: "none",
			});
			const adultCategory = yield* createRestrictedCategoryFx(database, {
				slug: "buyer-listing-restriction-adult",
				restriction: "adult",
			});
			const restrictedCategory = yield* createRestrictedCategoryFx(database, {
				slug: "buyer-listing-restriction-restricted",
				restriction: "restricted",
			});
			const title = "Buyer listing restriction visibility marker";

			const noneListing = yield* createListingFx(users.seller.id, {
				title,
				categoryId: noneCategory.id,
			});
			const adultCategoryListing = yield* createListingFx(users.seller.id, {
				title,
				categoryId: adultCategory.id,
			});
			const restrictedCategoryListing = yield* createListingFx(users.seller.id, {
				title,
				categoryId: restrictedCategory.id,
			});
			const adultListingRestriction = yield* createListingFx(users.seller.id, {
				title,
				categoryId: noneCategory.id,
				restriction: "adult",
			});
			const restrictedListingRestriction = yield* createListingFx(users.seller.id, {
				title,
				categoryId: noneCategory.id,
				restriction: "restricted",
			});
			const categoryIdIn = [
				noneCategory.id,
				adultCategory.id,
				restrictedCategory.id,
			];

			const defaultCollection = yield* listingCollectionFx({
				userId: users.buyer.id,
				scope: {},
				where: {
					title,
					categoryIdIn,
				},
			});

			expect(defaultCollection.map((item) => item.id).sort()).toEqual(
				[
					noneListing.id,
				].sort(),
			);

			yield* createUserRestrictionFx(database, {
				userId: users.buyer.id,
				restriction: "adult",
			});

			const adultCollection = yield* listingCollectionFx({
				userId: users.buyer.id,
				scope: {},
				where: {
					title,
					categoryIdIn,
				},
			});
			const adultCount = yield* listingCountFx({
				userId: users.buyer.id,
				scope: {},
				where: {
					title,
					categoryIdIn,
				},
			});
			const adultIds = adultCollection.map((item) => item.id).sort();
			const explicitRestrictedCollection = yield* listingCollectionFx({
				userId: users.buyer.id,
				scope: {},
				where: {
					title,
					categoryId: restrictedCategory.id,
				},
			});

			expect(adultIds).toEqual(
				[
					noneListing.id,
					adultCategoryListing.id,
					adultListingRestriction.id,
				].sort(),
			);
			expect(adultCount).toBe(adultCollection.length);
			expect(adultIds).not.toContain(restrictedCategoryListing.id);
			expect(adultIds).not.toContain(restrictedListingRestriction.id);
			expect(explicitRestrictedCollection).toEqual([]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
