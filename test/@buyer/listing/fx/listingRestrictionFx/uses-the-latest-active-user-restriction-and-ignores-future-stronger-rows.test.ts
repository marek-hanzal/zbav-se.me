import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/buyer-listing/fx/listingCollectionFx";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { createRestrictionProbeListingsFx, createUserRestrictionFx } from "./restrictionFixtures";

describe("buyer listing active restriction ordering", () => {
	it("uses the latest active user restriction and ignores future stronger rows", async () => {
		const database = await testabaseFn("buyer-listing-restriction-time-ordering");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});
			const fixtures = yield* createRestrictionProbeListingsFx(database, {
				sellerId: users.seller.id,
				title: "Buyer time restriction marker",
				slugPrefix: "buyer-time-restriction",
			});

			yield* createUserRestrictionFx(database, {
				userId: users.buyer.id,
				restriction: "adult",
				availableAtOffsetMinutes: -30,
				createdAtOffsetMinutes: -30,
			});
			yield* createUserRestrictionFx(database, {
				userId: users.buyer.id,
				restriction: "restricted",
				availableAtOffsetMinutes: 60,
				createdAtOffsetMinutes: -5,
			});

			const collection = yield* listingCollectionFx({
				userId: users.buyer.id,
				scope: {},
				where: {
					// title: "Buyer time restriction marker",
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
