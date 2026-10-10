import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingFetchFx } from "~/buyer-listing/fx/listingFetchFx";
import { expectTaggedErrorFn } from "~/test/common/fx/expectTaggedErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { createRestrictionProbeListingsFx, createUserRestrictionFx } from "./restrictionFixtures";

describe("buyer listing restriction fetch scope", () => {
	it("rejects direct fetch by id when category or listing restriction exceeds the buyer", async () => {
		const database = await testabaseFn("buyer-listing-restriction-fetch-by-id");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});
			const fixtures = yield* createRestrictionProbeListingsFx(database, {
				sellerId: users.seller.id,
				title: "Buyer fetch restriction marker",
				slugPrefix: "buyer-fetch-restriction",
			});

			const defaultRestrictedCategoryFetch = yield* Effect.result(
				listingFetchFx({
					userId: users.buyer.id,
					scope: {},
					where: {
						id: fixtures.restrictedCategoryListing.id,
					},
				}),
			);
			const defaultRestrictedListingFetch = yield* Effect.result(
				listingFetchFx({
					userId: users.buyer.id,
					scope: {},
					where: {
						id: fixtures.restrictedListingRestriction.id,
					},
				}),
			);

			expectTaggedErrorFn(defaultRestrictedCategoryFetch, {
				tag: "NotFoundErrorFx",
			});
			expectTaggedErrorFn(defaultRestrictedListingFetch, {
				tag: "NotFoundErrorFx",
			});

			yield* createUserRestrictionFx(database, {
				userId: users.buyer.id,
				restriction: "adult",
				availableAtOffsetMinutes: -10,
			});

			const allowedAdultCategory = yield* listingFetchFx({
				userId: users.buyer.id,
				scope: {},
				where: {
					id: fixtures.adultCategoryListing.id,
				},
			});
			const allowedAdultListing = yield* listingFetchFx({
				userId: users.buyer.id,
				scope: {},
				where: {
					id: fixtures.adultListingRestriction.id,
				},
			});
			const adultRestrictedCategoryFetch = yield* Effect.result(
				listingFetchFx({
					userId: users.buyer.id,
					scope: {},
					where: {
						id: fixtures.restrictedCategoryListing.id,
					},
				}),
			);
			const adultRestrictedListingFetch = yield* Effect.result(
				listingFetchFx({
					userId: users.buyer.id,
					scope: {},
					where: {
						id: fixtures.restrictedListingRestriction.id,
					},
				}),
			);

			expect(allowedAdultCategory.id).toBe(fixtures.adultCategoryListing.id);
			expect(allowedAdultListing.id).toBe(fixtures.adultListingRestriction.id);
			expectTaggedErrorFn(adultRestrictedCategoryFetch, {
				tag: "NotFoundErrorFx",
			});
			expectTaggedErrorFn(adultRestrictedListingFetch, {
				tag: "NotFoundErrorFx",
			});
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
