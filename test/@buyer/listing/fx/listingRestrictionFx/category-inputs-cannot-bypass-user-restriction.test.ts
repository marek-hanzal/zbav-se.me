import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/buyer/listing/server/fx/listingCollectionFx";
import type { ListingWhereSchema } from "~/buyer/listing/server/schema/ListingWhereSchema";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { createRestrictionProbeListings, createUserRestriction } from "./restrictionFixtures";

describe("buyer listing restriction category input scope", () => {
	it("does not let filter, where, or scope category inputs bypass user restriction", async () => {
		const database = await testabase("buyer-listing-restriction-category-inputs");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});
			const fixtures = yield* createRestrictionProbeListings(database, {
				sellerId: users.seller.id,
				title: "Buyer category input restriction marker",
				slugPrefix: "buyer-category-input-restriction",
			});

			yield* createUserRestriction(database, {
				userId: users.buyer.id,
				restriction: "adult",
				availableAtOffsetMinutes: -10,
			});

			const categoryInputs = [
				{
					name: "where categoryId",
					query: {
						where: {
							// title: "Buyer category input restriction marker",
							categoryId: fixtures.restrictedCategory.id,
						},
					},
				},
				{
					name: "filter categoryId",
					query: {
						filter: {
							// title: "Buyer category input restriction marker",
							categoryId: fixtures.restrictedCategory.id,
						},
					},
				},
				{
					name: "scope categoryId",
					query: {
						where: {
							// title: "Buyer category input restriction marker",
						},
						scope: {
							categoryId: fixtures.restrictedCategory.id,
						},
					},
				},
				{
					name: "where categoryIdIn",
					query: {
						where: {
							// title: "Buyer category input restriction marker",
							categoryIdIn: [
								fixtures.restrictedCategory.id,
							],
						},
					},
				},
				{
					name: "filter categoryIdIn",
					query: {
						filter: {
							// title: "Buyer category input restriction marker",
							categoryIdIn: [
								fixtures.restrictedCategory.id,
							],
						},
					},
				},
				{
					name: "scope categoryIdIn",
					query: {
						where: {
							// title: "Buyer category input restriction marker",
						},
						scope: {
							categoryIdIn: [
								fixtures.restrictedCategory.id,
							],
						},
					},
				},
			] satisfies {
				name: string;
				query: {
					filter?: ListingWhereSchema.Type;
					where?: ListingWhereSchema.Type;
					scope?: ListingWhereSchema.Type;
				};
			}[];

			for (const item of categoryInputs) {
				const collection = yield* listingCollectionFx({
					userId: users.buyer.id,
					scope: {},
					...item.query,
				});

				expect(collection, item.name).toEqual([]);
			}
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
