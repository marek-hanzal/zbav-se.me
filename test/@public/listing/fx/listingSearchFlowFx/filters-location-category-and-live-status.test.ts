import { Effect } from "effect";
import { sql } from "kysely";
import { describe, expect, it } from "vitest";
import type { CategoryRestrictionEnumSchema } from "~/common/category/enum/CategoryRestrictionEnumSchema";
import type { ListingDeliveryEnumSchema } from "~/common/listing/enum/ListingDeliveryEnumSchema";
import { listingCollectionFx } from "~/public/listing/server/fx/listingCollectionFx";
import { listingCountFx } from "~/public/listing/server/fx/listingCountFx";
import { categoryFetchFx } from "~/session/category/server/fx/categoryFetchFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { getDefaultListingCreateFx } from "~/test/listing/fx/getDefaultListingCreateFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

type TestDatabase = Awaited<ReturnType<typeof testabase>>;

const personalDelivery: ListingDeliveryEnumSchema.Type[] = [
	"personal",
];

const postDelivery: ListingDeliveryEnumSchema.Type[] = [
	"post",
];

const seedOstravaLocation = (database: TestDatabase) =>
	Effect.promise(() =>
		database.kysely
			.insertInto("location")
			.values({
				id: "loc_public_listing_search_ostrava",
				query: "Ostrava",
				lang: "cs",
				country: "Cesko",
				code: "CZ",
				county: "Ostrava-mesto",
				municipality: "Ostrava",
				state: "Moravskoslezsky kraj",
				address: "Ostrava, Cesko",
				city: "Ostrava",
				street: null,
				zip: "702 00",
				confidence: 0.98,
				hash: "test:public-listing-search:ostrava:cs",
				lat: 49.820923,
				lon: 18.262524,
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

const patchPublicListing = (
	database: TestDatabase,
	props: {
		id: string;
		locationId?: string;
		price: number;
		condition: number;
		age: number;
		delivery: ListingDeliveryEnumSchema.Type[];
		warranty: "custom" | "no-warranty" | "warranty";
		status?: "banned" | "live" | "on-hold" | "sold";
	},
) =>
	Effect.promise(() =>
		database.kysely
			.updateTable("listing")
			.set({
				locationId: props.locationId,
				price: props.price,
				condition: props.condition,
				age: props.age,
				delivery: props.delivery,
				warranty: props.warranty,
				status: props.status ?? "live",
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

const patchListingRestriction = (
	database: TestDatabase,
	props: {
		id: string;
		restriction: CategoryRestrictionEnumSchema.Type;
	},
) =>
	Effect.promise(() =>
		database.kysely
			.updateTable("listing")
			.set({
				restriction: props.restriction,
			})
			.where("id", "=", props.id)
			.executeTakeFirstOrThrow(),
	);

describe("public listing search flow", () => {
	it("applies high-level filters and excludes every non-live listing", async () => {
		const database = await testabase("public-listing-search-flow");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const listingDefaults = yield* getDefaultListingCreateFx;

			yield* seedOstravaLocation(database);

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

			yield* patchPublicListing(database, {
				id: matching.id,
				price: 5000,
				condition: 5,
				age: 2,
				delivery: personalDelivery,
				warranty: "warranty",
			});
			yield* patchPublicListing(database, {
				id: tooFar.id,
				locationId: "loc_public_listing_search_ostrava",
				price: 4500,
				condition: 5,
				age: 2,
				delivery: personalDelivery,
				warranty: "warranty",
			});
			yield* patchPublicListing(database, {
				id: sold.id,
				price: 4800,
				condition: 5,
				age: 2,
				delivery: personalDelivery,
				warranty: "warranty",
				status: "sold",
			});
			yield* patchPublicListing(database, {
				id: onHold.id,
				price: 4000,
				condition: 4,
				age: 1,
				delivery: postDelivery,
				warranty: "custom",
				status: "on-hold",
			});

			const collection = yield* listingCollectionFx({
				scope: {},
				where: {
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
						"warranty",
					],
					range: 10,
				},
				meta: {
					latLon: {
						lat: 50.075539,
						lon: 14.4378,
					},
				},
			});
			const count = yield* listingCountFx({
				scope: {},
				where: {
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
						"warranty",
					],
					range: 10,
				},
				meta: {
					latLon: {
						lat: 50.075539,
						lon: 14.4378,
					},
				},
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

	it("hides explicit categories unless the query asks for a category", async () => {
		const database = await testabase("public-listing-category-discovery-flow");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
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

			const implicitListing = yield* createListingFx(seller.id, {
				title: "Category discovery visibility marker",
				categoryId: implicitCategory.id,
			});
			const explicitListing = yield* createListingFx(seller.id, {
				title: "Category discovery visibility marker",
				categoryId: explicitCategory.id,
			});

			const defaultCollection = yield* listingCollectionFx({
				scope: {},
				where: {
					title: "Category discovery visibility marker",
				},
			});
			const emptyCategoryCollection = yield* listingCollectionFx({
				scope: {},
				where: {
					title: "Category discovery visibility marker",
					categoryIdIn: [],
				},
			});
			const defaultCount = yield* listingCountFx({
				scope: {},
				where: {
					title: "Category discovery visibility marker",
				},
			});
			const explicitByCategory = yield* listingCollectionFx({
				scope: {},
				where: {
					title: "Category discovery visibility marker",
					categoryId: explicitCategory.id,
				},
			});
			const explicitByCategoryIn = yield* listingCollectionFx({
				scope: {},
				where: {
					title: "Category discovery visibility marker",
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

	it("allows only public-safe restrictions even with explicit category filters", async () => {
		const database = await testabase("public-listing-restriction-flow");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const openCategory = yield* categoryFetchFx({
				where: {
					slug: "pocitace-a-kancelar--uloziste-ssd-hdd",
				},
				scope: {},
			});
			const adultRelaxedCategory = yield* categoryFetchFx({
				where: {
					slug: "vape-elektronicke-cigarety--mody",
				},
				scope: {},
			});
			const adultCategory = yield* categoryFetchFx({
				where: {
					slug: "tv-audio-a-foto--drony-s-kamerou",
				},
				scope: {},
			});
			const sensitiveCategory = yield* categoryFetchFx({
				where: {
					slug: "airsoft--airsoftove-pistole",
				},
				scope: {},
			});

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

			yield* patchListingRestriction(database, {
				id: adultListingRestriction.id,
				restriction: "adult",
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
					title: "Public restriction marker",
					categoryIdIn,
				},
			});
			const count = yield* listingCountFx({
				scope: {},
				where: {
					title: "Public restriction marker",
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
			expect(count).toBe(collection.length);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
