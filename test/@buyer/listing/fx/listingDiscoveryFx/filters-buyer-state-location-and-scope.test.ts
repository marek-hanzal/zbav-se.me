import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { favouriteCreateFx } from "~/buyer/favourite/server/fx/favouriteCreateFx";
import { feedCreateFx } from "~/buyer/feed/server/fx/feedCreateFx";
import { ignoreCreateFx } from "~/buyer/ignore/server/fx/ignoreCreateFx";
import { listingCollectionFx } from "~/buyer/listing/server/fx/listingCollectionFx";
import { listingCountFx } from "~/buyer/listing/server/fx/listingCountFx";
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
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("buyer listing discovery flow", () => {
	it("filters by buyer state, location and scope without leaking foreign data", async () => {
		const database = await testabase("buyer-listing-discovery-flow");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});
			const listingDefaults = yield* getDefaultListingCreateFx;

			yield* seedLocationFixtureFx(database, {
				id: "loc_listing_discovery_brno",
				query: "Brno",
				county: "Brno-mesto",
				municipality: "Brno",
				state: "Jihomoravsky kraj",
				address: "Brno, Cesko",
				city: "Brno",
				zip: "602 00",
				hash: "test:listing-discovery:brno:cs",
				lat: 49.195061,
				lon: 16.606837,
			});

			const favouriteListing = yield* createListingFx(users.seller.id, {
				title: "Portable console with dock",
				...listingDefaults,
			});
			const ignoredListing = yield* createListingFx(users.seller.id, {
				title: "Ignored portable console",
				...listingDefaults,
			});
			const farListing = yield* createListingFx(users.stranger.id, {
				title: "Portable console in Brno",
				categoryId: listingDefaults.categoryId,
				locationId: "loc_listing_discovery_brno",
			});
			const ownListing = yield* createListingFx(users.buyer.id, {
				title: "Buyer own portable console",
				...listingDefaults,
			});

			yield* patchListingSearchFixtureFx(database, {
				id: favouriteListing.id,
				price: 1200,
				age: 2,
				delivery: personalDelivery,
				warranty: "warranty",
			});
			yield* patchListingSearchFixtureFx(database, {
				id: ignoredListing.id,
				price: 1400,
				age: 3,
				delivery: personalDelivery,
				warranty: "custom",
			});
			yield* patchListingSearchFixtureFx(database, {
				id: farListing.id,
				locationId: "loc_listing_discovery_brno",
				price: 900,
				age: 1,
				delivery: postDelivery,
				warranty: "no-warranty",
			});
			yield* patchListingSearchFixtureFx(database, {
				id: ownListing.id,
				price: 800,
				age: 1,
				delivery: personalDelivery,
				warranty: "warranty",
			});

			const feed = yield* feedCreateFx({
				userId: users.buyer.id,
				type: "search",
				name: "Portable consoles",
				query: {
					filter: {
						// title: "portable console",
					},
				},
			});
			yield* favouriteCreateFx({
				userId: users.buyer.id,
				feedId: feed.id,
				listingId: favouriteListing.id,
			});
			yield* ignoreCreateFx({
				userId: users.buyer.id,
				listingId: ignoredListing.id,
			});

			const filteredWhere = {
				fulltext: [
					"portable console",
				],
				categoryIdIn: [
					listingDefaults.categoryId,
				],
				deliveryIn: personalDelivery,
				warrantyIn: [
					"warranty" as const,
				],
				ageMin: 1,
				ageMax: 2,
				withOwn: false,
				withIgnored: false,
				isFavourite: true,
				range: 10,
			};
			const filteredMeta = {
				locationId: listingDefaults.locationId,
			};
			const filtered = yield* listingCollectionFx({
				userId: users.buyer.id,
				scope: {},
				where: filteredWhere,
				meta: filteredMeta,
				sort: [
					{
						field: "createdAt",
						order: "asc",
					},
				],
			});
			const filteredCount = yield* listingCountFx({
				userId: users.buyer.id,
				scope: {},
				where: filteredWhere,
				meta: filteredMeta,
			});
			const ownOnly = yield* listingCollectionFx({
				userId: users.buyer.id,
				scope: {},
				where: {
					my: true,
				},
			});
			const allExceptOwn = yield* listingCollectionFx({
				userId: users.buyer.id,
				scope: {},
				where: {
					withOwn: false,
				},
			});

			expect(filtered.map((item) => item.id)).toEqual([
				favouriteListing.id,
			]);
			expect(filteredCount).toBe(filtered.length);
			expect(ownOnly.map((item) => item.id)).toEqual([
				ownListing.id,
			]);
			expect(allExceptOwn.map((item) => item.id)).not.toContain(ownListing.id);
			expect(allExceptOwn.map((item) => item.id)).toContain(farListing.id);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
