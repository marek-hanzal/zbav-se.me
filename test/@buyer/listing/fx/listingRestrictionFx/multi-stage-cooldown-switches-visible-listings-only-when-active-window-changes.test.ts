import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/buyer-listing/fx/listingCollectionFx";
import { listingCountFx } from "~/buyer-listing/fx/listingCountFx";
import { withDateServiceFn } from "~/date/fn/withDateServiceFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { createRestrictionProbeListingsFx, createUserRestrictionFx } from "./restrictionFixtures";

const atFx = <A, E, R>(iso: string, eff: Effect.Effect<A, E, R>) =>
	eff.pipe(
		withDateServiceFn({
			nowFn: () => DateTime.fromISO(iso),
		}),
	);

describe("buyer listing restriction cooldown flow", () => {
	it("changes visible listings only when the next restriction window actually becomes active", async () => {
		const database = await testabaseFn("buyer-listing-restriction-multi-stage-cooldown");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});
			const fixtures = yield* atFx(
				"2026-04-28T10:00:00.000Z",
				createRestrictionProbeListingsFx(database, {
					sellerId: users.seller.id,
					title: "Buyer staged cooldown restriction marker",
					slugPrefix: "buyer-staged-cooldown-restriction",
				}),
			);

			yield* atFx(
				"2026-04-28T10:00:00.000Z",
				createUserRestrictionFx(database, {
					userId: users.buyer.id,
					restriction: "adult",
					availableAtOffsetMinutes: -10,
					createdAtOffsetMinutes: -10,
				}),
			);
			yield* atFx(
				"2026-04-28T10:00:00.000Z",
				createUserRestrictionFx(database, {
					userId: users.buyer.id,
					restriction: "restricted",
					availableAtOffsetMinutes: 60,
					createdAtOffsetMinutes: 5,
				}),
			);
			yield* atFx(
				"2026-04-28T10:00:00.000Z",
				createUserRestrictionFx(database, {
					userId: users.buyer.id,
					restriction: "adult-relaxed",
					availableAtOffsetMinutes: 120,
					createdAtOffsetMinutes: 10,
				}),
			);

			const beforeFirstFlip = yield* atFx(
				"2026-04-28T10:59:59.999Z",
				listingCollectionFx({
					userId: users.buyer.id,
					scope: {},
					where: {
						categoryIdIn: [
							...fixtures.categoryIdIn,
						],
					},
				}),
			);
			const duringRestrictedWindow = yield* atFx(
				"2026-04-28T11:00:00.000Z",
				listingCollectionFx({
					userId: users.buyer.id,
					scope: {},
					where: {
						categoryIdIn: [
							...fixtures.categoryIdIn,
						],
					},
				}),
			);
			const afterSecondFlip = yield* atFx(
				"2026-04-28T12:00:00.000Z",
				listingCollectionFx({
					userId: users.buyer.id,
					scope: {},
					where: {
						categoryIdIn: [
							...fixtures.categoryIdIn,
						],
					},
				}),
			);
			const afterSecondFlipCount = yield* atFx(
				"2026-04-28T12:00:00.000Z",
				listingCountFx({
					userId: users.buyer.id,
					scope: {},
					where: {
						categoryIdIn: [
							...fixtures.categoryIdIn,
						],
					},
				}),
			);

			expect(beforeFirstFlip.map((item) => item.id).sort()).toEqual(
				[
					fixtures.noneListing.id,
					fixtures.adultCategoryListing.id,
					fixtures.adultListingRestriction.id,
				].sort(),
			);

			expect(duringRestrictedWindow.map((item) => item.id).sort()).toEqual(
				[
					fixtures.noneListing.id,
					fixtures.adultCategoryListing.id,
					fixtures.restrictedCategoryListing.id,
					fixtures.adultListingRestriction.id,
					fixtures.restrictedListingRestriction.id,
				].sort(),
			);

			expect(afterSecondFlip.map((item) => item.id)).toEqual([
				fixtures.noneListing.id,
			]);
			expect(afterSecondFlipCount).toBe(afterSecondFlip.length);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
