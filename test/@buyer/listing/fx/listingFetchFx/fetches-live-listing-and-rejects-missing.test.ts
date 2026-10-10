import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingFetchFx } from "~/buyer-listing/fx/listingFetchFx";
import { expectErrorFn } from "~/test/common/fx/expectErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { createUserRestrictionFx } from "~/test/listing/fx/listingSearchFixturesFx";
import { testabaseFn } from "~/test/testabaseFn";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("buyer listingFetchFx", () => {
	it("fetches live listing and rejects missing id", async () => {
		const database = await testabaseFn("buyer-listingFetchFx-contract");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});
			const listing = yield* createListingFx(users.seller.id, {
				title: "Buyer fetch listing",
				restriction: "adult-relaxed",
			});
			yield* createUserRestrictionFx(database, {
				userId: users.buyer.id,
				restriction: "adult-relaxed",
			});

			const fetched = yield* listingFetchFx({
				userId: users.buyer.id,
				where: {
					id: listing.id,
				},
				scope: {},
			});

			expect(fetched.id).toBe(listing.id);
			expect(fetched.title).toBe("Buyer fetch listing");
			expect(fetched.status).toBe("live");
			expect(fetched.withRestriction).toBe("adult-relaxed");

			const missing = yield* Effect.result(
				listingFetchFx({
					userId: users.buyer.id,
					where: {
						id: "missing-listing-id",
					},
					scope: {},
				}),
			);

			expectErrorFn(missing);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
