import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/buyer/listing/server/fx/listingCollectionFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { createRestrictionProbeListings, createUserRestriction } from "./restrictionFixtures";

describe("buyer listing active restriction ordering", () => {
	it("uses the latest active user restriction and ignores future stronger rows", async () => {
		const database = await testabase("buyer-listing-restriction-time-ordering");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});
			const fixtures = yield* createRestrictionProbeListings(database, {
				sellerId: users.seller.id,
				title: "Buyer time restriction marker",
				slugPrefix: "buyer-time-restriction",
			});

			yield* createUserRestriction(database, {
				userId: users.buyer.id,
				restriction: "adult",
				availableAtOffsetMinutes: -30,
				createdAtOffsetMinutes: -30,
			});
			yield* createUserRestriction(database, {
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
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
