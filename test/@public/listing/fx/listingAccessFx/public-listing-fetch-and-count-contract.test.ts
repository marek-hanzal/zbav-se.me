import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/public/listing/server/fx/listingCollectionFx";
import { listingCountFx } from "~/public/listing/server/fx/listingCountFx";
import { listingFetchFx } from "~/public/listing/server/fx/listingFetchFx";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { patchCategoryDiscoveryFx } from "~/test/listing/fx/listingSearchFixturesFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { categoryFetchFx } from "~/user/category/server/fx/categoryFetchFx";

describe("public listing fetch/count contract", () => {
	it("keeps fetch and count aligned with public visibility rules", async () => {
		const database = await testabase("public-listing-fetch-count-contract");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});
			const implicitCategory = yield* categoryFetchFx({
				userId: users.seller.id,
				where: {
					slug: "pocitace-a-kancelar--uloziste-ssd-hdd",
				},
				scope: {},
			});
			const explicitCategory = yield* categoryFetchFx({
				userId: users.seller.id,
				where: {
					slug: "pocitace-a-kancelar--monitor",
				},
				scope: {},
			});

			yield* patchCategoryDiscoveryFx(database, {
				id: explicitCategory.id,
				discovery: "explicit",
			});

			const implicitListing = yield* createListingFx(users.seller.id, {
				categoryId: implicitCategory.id,
				title: "qxpublicfetchcount-implicit",
			});
			const explicitListing = yield* createListingFx(users.seller.id, {
				categoryId: explicitCategory.id,
				title: "qxpublicfetchcount-explicit",
			});
			const blockedListing = yield* createListingFx(users.seller.id, {
				categoryId: implicitCategory.id,
				title: "qxpublicfetchcount-blocked",
				restriction: "restricted",
			});

			const visibleFetch = yield* listingFetchFx({
				scope: {},
				where: {
					id: implicitListing.id,
				},
			});
			const explicitHiddenFetch = yield* Effect.either(
				listingFetchFx({
					scope: {},
					where: {
						id: explicitListing.id,
					},
				}),
			);
			const explicitVisibleFetch = yield* listingFetchFx({
				scope: {},
				where: {
					id: explicitListing.id,
					categoryId: explicitCategory.id,
				},
			});
			const blockedFetch = yield* Effect.either(
				listingFetchFx({
					scope: {},
					where: {
						id: blockedListing.id,
					},
				}),
			);
			const defaultCollection = yield* listingCollectionFx({
				scope: {},
			});
			const defaultCount = yield* listingCountFx({
				scope: {},
			});
			const explicitCollection = yield* listingCollectionFx({
				scope: {},
				where: {
					categoryIdIn: [
						explicitCategory.id,
					],
				},
			});
			const explicitCount = yield* listingCountFx({
				scope: {},
				where: {
					categoryIdIn: [
						explicitCategory.id,
					],
				},
			});

			expect(visibleFetch.id).toBe(implicitListing.id);
			expect(visibleFetch.withRestriction).toBe("none");
			expectTaggedErrorFx(explicitHiddenFetch, {
				tag: "NotFoundErrorFx",
			});
			expect(explicitVisibleFetch.id).toBe(explicitListing.id);
			expectTaggedErrorFx(blockedFetch, {
				tag: "NotFoundErrorFx",
			});
			expect(defaultCollection.map((item) => item.id)).toContain(implicitListing.id);
			expect(defaultCollection.map((item) => item.id)).not.toContain(explicitListing.id);
			expect(defaultCollection.map((item) => item.id)).not.toContain(blockedListing.id);
			expect(defaultCount).toBe(defaultCollection.length);
			expect(explicitCollection.map((item) => item.id)).toEqual([
				explicitListing.id,
			]);
			expect(explicitCount).toBe(explicitCollection.length);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
