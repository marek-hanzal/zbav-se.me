import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/buyer-listing/fx/listingCollectionFx";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { createRestrictionProbeListingsFx, createUserRestrictionFx } from "./restrictionFixtures";

describe("buyer listing active restriction ordering", () => {
	it("ignores expired rows when resolving the active user restriction", async () => {
		const database = await testabaseFn("buyer-listing-restriction-expired");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});
			const fixtures = yield* createRestrictionProbeListingsFx(database, {
				sellerId: users.seller.id,
				title: "Buyer expired restriction marker",
				slugPrefix: "buyer-expired-restriction",
			});

			yield* createUserRestrictionFx(database, {
				userId: users.buyer.id,
				restriction: "restricted",
				availableAtOffsetMinutes: -60,
				expiresAtOffsetMinutes: -5,
				createdAtOffsetMinutes: -60,
			});
			yield* createUserRestrictionFx(database, {
				userId: users.buyer.id,
				restriction: "adult",
				availableAtOffsetMinutes: -30,
				createdAtOffsetMinutes: -30,
			});

			const collection = yield* listingCollectionFx({
				userId: users.buyer.id,
				scope: {},
				where: {
					// title: "Buyer expired restriction marker",
					categoryIdIn: [
						...fixtures.categoryIdIn,
					],
				},
			});
			const ids = collection.map((item) => item.id).sort();

			expect(ids).toEqual(
				[
					fixtures.noneListing.id,
					fixtures.adultCategoryListing.id,
					fixtures.adultListingRestriction.id,
				].sort(),
			);
			expect(ids).not.toContain(fixtures.restrictedCategoryListing.id);
			expect(ids).not.toContain(fixtures.restrictedListingRestriction.id);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
