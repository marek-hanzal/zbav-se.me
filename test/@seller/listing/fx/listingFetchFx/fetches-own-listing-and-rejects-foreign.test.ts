import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingFetchFx } from "~/seller-listing/fx/listingFetchFx";
import { expectErrorFn } from "~/test/common/fx/expectErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabaseFn } from "~/test/testabaseFn";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("seller listingFetchFx", () => {
	it("fetches own listing and rejects foreign listing", async () => {
		const database = await testabaseFn("seller-listingFetchFx-scope");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});
			const ownListing = yield* createListingFx(users.seller.id, {
				title: "Seller own listing",
				restriction: "none",
			});
			const foreignListing = yield* createListingFx(users.stranger.id, {
				title: "Foreign seller listing",
			});

			const fetched = yield* listingFetchFx({
				userId: users.seller.id,
				where: {
					id: ownListing.id,
				},
				scope: {
					userId: users.seller.id,
				},
			});

			expect(fetched.id).toBe(ownListing.id);
			expect(fetched.title).toBe("Seller own listing");
			expect(fetched.withRestriction).toBe("none");

			const foreign = yield* Effect.result(
				listingFetchFx({
					userId: users.seller.id,
					where: {
						id: foreignListing.id,
					},
					scope: {
						userId: users.seller.id,
					},
				}),
			);

			expectErrorFn(foreign);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
