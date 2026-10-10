import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { listingFetchFx } from "~/buyer-listing/fx/listingFetchFx";
import { withDateServiceFn } from "~/date/fn/withDateServiceFn";
import { expectTaggedErrorFn } from "~/test/common/fx/expectTaggedErrorFn";
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

describe("buyer listing restriction fetch flow", () => {
	it("changes direct fetch access only when staged restriction windows actually become active", async () => {
		const database = await testabaseFn("buyer-listing-fetch-multi-stage-cooldown");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});
			const fixtures = yield* atFx(
				"2026-04-30T10:00:00.000Z",
				createRestrictionProbeListingsFx(database, {
					sellerId: users.seller.id,
					title: "Buyer staged fetch restriction marker",
					slugPrefix: "buyer-staged-fetch-restriction",
				}),
			);

			yield* atFx(
				"2026-04-30T10:00:00.000Z",
				createUserRestrictionFx(database, {
					userId: users.buyer.id,
					restriction: "adult",
					availableAtOffsetMinutes: -5,
					createdAtOffsetMinutes: -5,
				}),
			);
			yield* atFx(
				"2026-04-30T10:00:00.000Z",
				createUserRestrictionFx(database, {
					userId: users.buyer.id,
					restriction: "restricted",
					availableAtOffsetMinutes: 30,
					createdAtOffsetMinutes: 1,
				}),
			);
			yield* atFx(
				"2026-04-30T10:00:00.000Z",
				createUserRestrictionFx(database, {
					userId: users.buyer.id,
					restriction: "none",
					availableAtOffsetMinutes: 90,
					createdAtOffsetMinutes: 2,
				}),
			);

			const beforeFirstBoundaryAdult = yield* atFx(
				"2026-04-30T10:29:59.999Z",
				listingFetchFx({
					userId: users.buyer.id,
					scope: {},
					where: {
						id: fixtures.adultCategoryListing.id,
					},
				}),
			);
			const beforeFirstBoundaryRestricted = yield* atFx(
				"2026-04-30T10:29:59.999Z",
				Effect.result(
					listingFetchFx({
						userId: users.buyer.id,
						scope: {},
						where: {
							id: fixtures.restrictedCategoryListing.id,
						},
					}),
				),
			);
			const duringRestrictedWindow = yield* atFx(
				"2026-04-30T10:30:00.000Z",
				listingFetchFx({
					userId: users.buyer.id,
					scope: {},
					where: {
						id: fixtures.restrictedListingRestriction.id,
					},
				}),
			);
			const afterReturnToNoneAdult = yield* atFx(
				"2026-04-30T11:30:00.000Z",
				Effect.result(
					listingFetchFx({
						userId: users.buyer.id,
						scope: {},
						where: {
							id: fixtures.adultListingRestriction.id,
						},
					}),
				),
			);
			const afterReturnToNoneRestricted = yield* atFx(
				"2026-04-30T11:30:00.000Z",
				Effect.result(
					listingFetchFx({
						userId: users.buyer.id,
						scope: {},
						where: {
							id: fixtures.restrictedCategoryListing.id,
						},
					}),
				),
			);

			expect(beforeFirstBoundaryAdult.id).toBe(fixtures.adultCategoryListing.id);
			expectTaggedErrorFn(beforeFirstBoundaryRestricted, {
				tag: "NotFoundErrorFx",
			});
			expect(duringRestrictedWindow.id).toBe(fixtures.restrictedListingRestriction.id);
			expectTaggedErrorFn(afterReturnToNoneAdult, {
				tag: "NotFoundErrorFx",
			});
			expectTaggedErrorFn(afterReturnToNoneRestricted, {
				tag: "NotFoundErrorFx",
			});
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
