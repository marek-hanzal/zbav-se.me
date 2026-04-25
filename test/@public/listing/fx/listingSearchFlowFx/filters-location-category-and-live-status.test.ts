import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/public/listing/server/fx/listingCollectionFx";
import { listingCountFx } from "~/public/listing/server/fx/listingCountFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { getDefaultListingCreateFx } from "~/test/listing/fx/getDefaultListingCreateFx";
import {
	patchListingSearchFixtureFx,
	personalDelivery,
	postDelivery,
	seedLocationFixtureFx,
} from "~/test/listing/fx/listingSearchFixturesFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("public listing search flow", () => {
	it("applies high-level filters and excludes every non-live listing", async () => {
		const database = await testabase("public-listing-search-flow");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const listingDefaults = yield* getDefaultListingCreateFx;

			yield* seedLocationFixtureFx(database, {
				id: "loc_public_listing_search_ostrava",
				query: "Ostrava",
				county: "Ostrava-mesto",
				municipality: "Ostrava",
				state: "Moravskoslezsky kraj",
				address: "Ostrava, Cesko",
				city: "Ostrava",
				zip: "702 00",
				hash: "test:public-listing-search:ostrava:cs",
				lat: 49.820923,
				lon: 18.262524,
			});

			const matching = yield* createListingFx(seller.id, {
				title: "Travel laptop with warranty",
				...listingDefaults,
			});
			const tooFar = yield* createListingFx(seller.id, {
				title: "Travel laptop from Ostrava",
				categoryId: listingDefaults.categoryId,
				locationId: "loc_public_listing_search_ostrava",
			});
			const sold = yield* createListingFx(seller.id, {
				title: "Travel laptop sold",
				...listingDefaults,
			});
			const onHold = yield* createListingFx(seller.id, {
				title: "Travel laptop on hold",
				...listingDefaults,
			});

			for (const listing of [
				matching,
				tooFar,
				sold,
				onHold,
			]) {
				yield* patchListingSearchFixtureFx(database, {
					id: listing.id,
					price: 5000,
					condition: 5,
					age: 2,
					delivery: personalDelivery,
					warranty: "warranty",
				});
			}
			yield* patchListingSearchFixtureFx(database, {
				id: tooFar.id,
				locationId: "loc_public_listing_search_ostrava",
				price: 4500,
			});
			yield* patchListingSearchFixtureFx(database, {
				id: sold.id,
				price: 4800,
				status: "sold",
			});
			yield* patchListingSearchFixtureFx(database, {
				id: onHold.id,
				price: 4000,
				condition: 4,
				age: 1,
				delivery: postDelivery,
				warranty: "custom",
				status: "on-hold",
			});

			const where = {
				fulltext: "travel laptop",
				categoryId: listingDefaults.categoryId,
				priceMin: 4000,
				priceMax: 5500,
				conditionIn: [
					5,
				],
				ageIn: [
					2,
				],
				deliveryIn: personalDelivery,
				warrantyIn: [
					"warranty" as const,
				],
				range: 10,
			};
			const meta = {
				locationId: listingDefaults.locationId,
			};
			const collection = yield* listingCollectionFx({
				scope: {},
				where,
				meta,
			});
			const count = yield* listingCountFx({
				scope: {},
				where,
				meta,
			});

			expect(collection.map((item) => item.id)).toEqual([
				matching.id,
			]);
			expect(collection.map((item) => item.id)).not.toContain(tooFar.id);
			expect(collection.map((item) => item.id)).not.toContain(sold.id);
			expect(collection.map((item) => item.id)).not.toContain(onHold.id);
			expect(count).toBe(collection.length);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
