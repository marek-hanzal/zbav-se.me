import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/buyer/listing/server/fx/listingCollectionFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { createRestrictionProbeListings, createUserRestriction } from "./restrictionFixtures";

describe("buyer listing active restriction ordering", () => {
	it("uses the newest active row instead of the strongest older row", async () => {
		const database = await testabase("buyer-listing-restriction-newest-active");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});
			const fixtures = yield* createRestrictionProbeListings(database, {
				sellerId: users.seller.id,
				title: "Buyer newest restriction marker",
				slugPrefix: "buyer-newest-restriction",
			});

			yield* createUserRestriction(database, {
				userId: users.buyer.id,
				restriction: "restricted",
				availableAtOffsetMinutes: -60,
				createdAtOffsetMinutes: -60,
			});
			yield* createUserRestriction(database, {
				userId: users.buyer.id,
				restriction: "none",
				availableAtOffsetMinutes: -5,
				createdAtOffsetMinutes: -5,
			});

			const collection = yield* listingCollectionFx({
				userId: users.buyer.id,
				scope: {},
				where: {
					// title: "Buyer newest restriction marker",
					categoryIdIn: [
						...fixtures.categoryIdIn,
					],
				},
			});

			expect(collection.map((item) => item.id)).toEqual([
				fixtures.noneListing.id,
			]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
