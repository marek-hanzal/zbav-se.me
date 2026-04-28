import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingFetchFx } from "~/seller/listing/server/fx/listingFetchFx";
import { expectErrorFx } from "~/test/common/fx/expectErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("seller listingFetchFx", () => {
	it("fetches own listing and rejects foreign listing", async () => {
		const database = await testabase("seller-listingFetchFx-scope");

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
				where: {
					id: ownListing.id,
				},
				scope: {
					userId: users.seller.id,
				},
			});

			expect(fetched.id).toBe(ownListing.id);
			// expect(fetched.title).toBe("Seller own listing");
			// expect(fetched.restrictions).toEqual([
			// 	"none",
			// ]);

			const foreign = yield* Effect.either(
				listingFetchFx({
					where: {
						id: foreignListing.id,
					},
					scope: {
						userId: users.seller.id,
					},
				}),
			);

			expectErrorFx(foreign);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
