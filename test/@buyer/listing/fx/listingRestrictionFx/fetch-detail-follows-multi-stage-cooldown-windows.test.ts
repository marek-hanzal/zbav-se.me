import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateServiceFx } from "@/lib/common/date";
import { listingFetchFx } from "~/buyer/listing/server/fx/listingFetchFx";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { createRestrictionProbeListings, createUserRestriction } from "./restrictionFixtures";

const atFx = <A, E, R>(iso: string, eff: Effect.Effect<A, E, R>) =>
	eff.pipe(
		Effect.provideService(DateServiceFx, {
			now: () => DateTime.fromISO(iso),
		}),
	);

describe("buyer listing restriction fetch flow", () => {
	it("changes direct fetch access only when staged restriction windows actually become active", async () => {
		const database = await testabase("buyer-listing-fetch-multi-stage-cooldown");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});
			const fixtures = yield* atFx(
				"2026-04-30T10:00:00.000Z",
				createRestrictionProbeListings(database, {
					sellerId: users.seller.id,
					title: "Buyer staged fetch restriction marker",
					slugPrefix: "buyer-staged-fetch-restriction",
				}),
			);

			yield* atFx(
				"2026-04-30T10:00:00.000Z",
				createUserRestriction(database, {
					userId: users.buyer.id,
					restriction: "adult",
					availableAtOffsetMinutes: -5,
					createdAtOffsetMinutes: -5,
				}),
			);
			yield* atFx(
				"2026-04-30T10:00:00.000Z",
				createUserRestriction(database, {
					userId: users.buyer.id,
					restriction: "restricted",
					availableAtOffsetMinutes: 30,
					createdAtOffsetMinutes: 1,
				}),
			);
			yield* atFx(
				"2026-04-30T10:00:00.000Z",
				createUserRestriction(database, {
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
				Effect.either(
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
				Effect.either(
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
				Effect.either(
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
			expectTaggedErrorFx(beforeFirstBoundaryRestricted, {
				tag: "NotFoundErrorFx",
			});
			expect(duringRestrictedWindow.id).toBe(fixtures.restrictedListingRestriction.id);
			expectTaggedErrorFx(afterReturnToNoneAdult, {
				tag: "NotFoundErrorFx",
			});
			expectTaggedErrorFx(afterReturnToNoneRestricted, {
				tag: "NotFoundErrorFx",
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
