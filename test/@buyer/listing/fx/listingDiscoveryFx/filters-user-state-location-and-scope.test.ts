import { Effect } from "effect";
import { sql } from "kysely";
import { describe, expect, it } from "vitest";
import { favouriteCreateFx } from "~/buyer/favourite/server/fx/favouriteCreateFx";
import { feedCreateFx } from "~/buyer/feed/server/fx/feedCreateFx";
import { ignoreCreateFx } from "~/buyer/ignore/server/fx/ignoreCreateFx";
import { listingCollectionFx } from "~/buyer/listing/server/fx/listingCollectionFx";
import { listingCountFx } from "~/buyer/listing/server/fx/listingCountFx";
import type { ListingDeliveryEnumSchema } from "~/common/listing/enum/ListingDeliveryEnumSchema";
import { categoryFetchFx } from "~/session/category/server/fx/categoryFetchFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { getDefaultListingCreateFx } from "~/test/listing/fx/getDefaultListingCreateFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

type TestDatabase = Awaited<ReturnType<typeof testabase>>;

const personalDelivery: ListingDeliveryEnumSchema.Type[] = [
	"personal",
];

const postDelivery: ListingDeliveryEnumSchema.Type[] = [
	"post",
];

const seedBrnoLocation = (database: TestDatabase) =>
	Effect.promise(() =>
		database.kysely
			.insertInto("location")
			.values({
				id: "loc_listing_discovery_brno",
				query: "Brno",
				lang: "cs",
				country: "Cesko",
				code: "CZ",
				county: "Brno-mesto",
				municipality: "Brno",
				state: "Jihomoravsky kraj",
				address: "Brno, Cesko",
				city: "Brno",
				street: null,
				zip: "602 00",
				confidence: 0.98,
				hash: "test:listing-discovery:brno:cs",
				lat: 49.195061,
				lon: 16.606837,
				geo: sql`default`,
			})
			.onConflict((oc) =>
				oc
					.columns([
						"lang",
						"hash",
					])
					.doNothing(),
			)
			.execute(),
	);

const patchListingSearchData = (
	database: TestDatabase,
	props: {
		id: string;
		locationId?: string;
		price: number;
		age: number;
		delivery: ListingDeliveryEnumSchema.Type[];
		warranty: "custom" | "no-warranty" | "warranty";
	},
) =>
	Effect.promise(() =>
		database.kysely
			.updateTable("listing")
			.set({
				locationId: props.locationId,
				price: props.price,
				age: props.age,
				delivery: props.delivery,
				warranty: props.warranty,
			})
			.where("id", "=", props.id)
			.executeTakeFirstOrThrow(),
	);

const patchCategoryDiscovery = (
	database: TestDatabase,
	props: {
		id: string;
		discovery: "explicit" | "implicit";
	},
) =>
	Effect.promise(() =>
		database.kysely
			.updateTable("category")
			.set({
				discovery: props.discovery,
			})
			.where("id", "=", props.id)
			.executeTakeFirstOrThrow(),
	);

describe("buyer listing discovery flow", () => {
	it("filters by buyer state, location and scope without leaking foreign data", async () => {
		const database = await testabase("buyer-listing-discovery-flow");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});
			const listingDefaults = yield* getDefaultListingCreateFx;

			yield* seedBrnoLocation(database);

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

			yield* patchListingSearchData(database, {
				id: favouriteListing.id,
				price: 1200,
				age: 2,
				delivery: personalDelivery,
				warranty: "warranty",
			});
			yield* patchListingSearchData(database, {
				id: ignoredListing.id,
				price: 1400,
				age: 3,
				delivery: personalDelivery,
				warranty: "custom",
			});
			yield* patchListingSearchData(database, {
				id: farListing.id,
				locationId: "loc_listing_discovery_brno",
				price: 900,
				age: 1,
				delivery: postDelivery,
				warranty: "no-warranty",
			});
			yield* patchListingSearchData(database, {
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
					where: {
						title: "portable console",
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

			const filtered = yield* listingCollectionFx({
				userId: users.buyer.id,
				scope: {},
				where: {
					fulltext: "portable console",
					categoryIdIn: [
						listingDefaults.categoryId,
					],
					deliveryIn: personalDelivery,
					warrantyIn: [
						"warranty",
					],
					ageMin: 1,
					ageMax: 2,
					withOwn: false,
					withIgnored: false,
					isFavourite: true,
					range: 10,
				},
				meta: {
					latLon: {
						lat: 50.075539,
						lon: 14.4378,
					},
				},
				sort: [
					{
						field: "geo",
						order: "asc",
					},
				],
			});
			const filteredCount = yield* listingCountFx({
				userId: users.buyer.id,
				scope: {},
				where: {
					fulltext: "portable console",
					categoryIdIn: [
						listingDefaults.categoryId,
					],
					deliveryIn: personalDelivery,
					warrantyIn: [
						"warranty",
					],
					ageMin: 1,
					ageMax: 2,
					withOwn: false,
					withIgnored: false,
					isFavourite: true,
					range: 10,
				},
				meta: {
					latLon: {
						lat: 50.075539,
						lon: 14.4378,
					},
				},
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

	it("hides explicit categories unless the buyer query asks for a category", async () => {
		const database = await testabase("buyer-listing-category-discovery-flow");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});
			const implicitCategory = yield* categoryFetchFx({
				where: {
					slug: "pocitace-a-kancelar--uloziste-ssd-hdd",
				},
				scope: {},
			});
			const explicitCategory = yield* categoryFetchFx({
				where: {
					slug: "pocitace-a-kancelar--monitor",
				},
				scope: {},
			});

			yield* patchCategoryDiscovery(database, {
				id: explicitCategory.id,
				discovery: "explicit",
			});

			const implicitListing = yield* createListingFx(users.seller.id, {
				title: "Buyer category discovery visibility marker",
				categoryId: implicitCategory.id,
			});
			const explicitListing = yield* createListingFx(users.seller.id, {
				title: "Buyer category discovery visibility marker",
				categoryId: explicitCategory.id,
			});

			const defaultCollection = yield* listingCollectionFx({
				userId: users.buyer.id,
				scope: {},
				where: {
					title: "Buyer category discovery visibility marker",
				},
			});
			const defaultCount = yield* listingCountFx({
				userId: users.buyer.id,
				scope: {},
				where: {
					title: "Buyer category discovery visibility marker",
				},
			});
			const explicitByCategory = yield* listingCollectionFx({
				userId: users.buyer.id,
				scope: {},
				where: {
					title: "Buyer category discovery visibility marker",
					categoryId: explicitCategory.id,
				},
			});
			const explicitByCategoryIn = yield* listingCollectionFx({
				userId: users.buyer.id,
				scope: {},
				where: {
					title: "Buyer category discovery visibility marker",
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
