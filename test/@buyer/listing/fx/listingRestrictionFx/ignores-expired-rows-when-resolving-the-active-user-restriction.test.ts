import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/buyer/listing/server/fx/listingCollectionFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { createRestrictionProbeListings, createUserRestriction } from "./restrictionFixtures";

describe("buyer listing active restriction ordering", () => {
	it("ignores expired rows when resolving the active user restriction", async () => {
		const database = await testabase("buyer-listing-restriction-expired");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});
			const fixtures = yield* createRestrictionProbeListings(database, {
				sellerId: users.seller.id,
				title: "Buyer expired restriction marker",
				slugPrefix: "buyer-expired-restriction",
			});

			yield* createUserRestriction(database, {
				userId: users.buyer.id,
				restriction: "restricted",
				availableAtOffsetMinutes: -60,
				expiresAtOffsetMinutes: -5,
				createdAtOffsetMinutes: -60,
			});
			yield* createUserRestriction(database, {
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
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
