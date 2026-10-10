import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/buyer-listing/fx/listingCollectionFx";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { createRestrictionProbeListingsFx, createUserRestrictionFx } from "./restrictionFixtures";

describe("buyer listing active restriction ordering", () => {
	it("uses the newest active row instead of the strongest older row", async () => {
		const database = await testabaseFn("buyer-listing-restriction-newest-active");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});
			const fixtures = yield* createRestrictionProbeListingsFx(database, {
				sellerId: users.seller.id,
				title: "Buyer newest restriction marker",
				slugPrefix: "buyer-newest-restriction",
			});

			yield* createUserRestrictionFx(database, {
				userId: users.buyer.id,
				restriction: "restricted",
				availableAtOffsetMinutes: -60,
				createdAtOffsetMinutes: -60,
			});
			yield* createUserRestrictionFx(database, {
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
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
