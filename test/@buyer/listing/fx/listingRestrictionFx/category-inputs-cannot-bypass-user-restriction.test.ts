import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/buyer-listing/fx/listingCollectionFx";
import type { ListingWhereSchema } from "~/buyer-listing/schema/ListingWhereSchema";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { createRestrictionProbeListingsFx, createUserRestrictionFx } from "./restrictionFixtures";

describe("buyer listing restriction category input scope", () => {
	it("does not let where or scope category inputs bypass user restriction", async () => {
		const database = await testabaseFn("buyer-listing-restriction-category-inputs");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});
			const fixtures = yield* createRestrictionProbeListingsFx(database, {
				sellerId: users.seller.id,
				title: "Buyer category input restriction marker",
				slugPrefix: "buyer-category-input-restriction",
			});

			yield* createUserRestrictionFx(database, {
				userId: users.buyer.id,
				restriction: "adult",
				availableAtOffsetMinutes: -10,
			});

			const categoryInputs = [
				{
					name: "where categoryId",
					query: {
						where: {
							categoryId: fixtures.restrictedCategory.id,
						},
					},
				},
				{
					name: "scope categoryId",
					query: {
						scope: {
							categoryId: fixtures.restrictedCategory.id,
						},
					},
				},
				{
					name: "where categoryIdIn",
					query: {
						where: {
							categoryIdIn: [
								fixtures.restrictedCategory.id,
							],
						},
					},
				},
				{
					name: "scope categoryIdIn",
					query: {
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
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
