import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingFetchFx } from "~/buyer/listing/server/fx/listingFetchFx";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { createRestrictionProbeListings, createUserRestriction } from "./restrictionFixtures";

describe("buyer listing restriction fetch scope", () => {
	it("rejects direct fetch by id when category or listing restriction exceeds the buyer", async () => {
		const database = await testabase("buyer-listing-restriction-fetch-by-id");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});
			const fixtures = yield* createRestrictionProbeListings(database, {
				sellerId: users.seller.id,
				title: "Buyer fetch restriction marker",
				slugPrefix: "buyer-fetch-restriction",
			});

			const defaultRestrictedCategoryFetch = yield* Effect.either(
				listingFetchFx({
					userId: users.buyer.id,
					scope: {},
					where: {
						id: fixtures.restrictedCategoryListing.id,
					},
				}),
			);
			const defaultRestrictedListingFetch = yield* Effect.either(
				listingFetchFx({
					userId: users.buyer.id,
					scope: {},
					where: {
						id: fixtures.restrictedListingRestriction.id,
					},
				}),
			);

			expectTaggedErrorFx(defaultRestrictedCategoryFetch, {
				tag: "NotFoundErrorFx",
			});
			expectTaggedErrorFx(defaultRestrictedListingFetch, {
				tag: "NotFoundErrorFx",
			});

			yield* createUserRestriction(database, {
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
			const adultRestrictedCategoryFetch = yield* Effect.either(
				listingFetchFx({
					userId: users.buyer.id,
					scope: {},
					where: {
						id: fixtures.restrictedCategoryListing.id,
					},
				}),
			);
			const adultRestrictedListingFetch = yield* Effect.either(
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
			expectTaggedErrorFx(adultRestrictedCategoryFetch, {
				tag: "NotFoundErrorFx",
			});
			expectTaggedErrorFx(adultRestrictedListingFetch, {
				tag: "NotFoundErrorFx",
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
