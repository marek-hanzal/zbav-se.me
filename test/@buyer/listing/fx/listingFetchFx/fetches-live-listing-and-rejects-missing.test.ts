import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingFetchFx } from "~/buyer/listing/server/fx/listingFetchFx";
import { auth } from "~/server/auth/auth";
import { expectErrorFx } from "~/test/common/fx/expectErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("buyer listingFetchFx", () => {
	it("fetches live listing and rejects missing id", async () => {
		const database = await testabase("buyer-listingFetchFx-contract");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const users = yield* createUsersFx({
				api,
				slug: "buyer-listing-fetch",
			});
			const listing = yield* createListingFx(users.seller.id, {
				title: "Buyer fetch listing",
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

			const missing = yield* Effect.either(
				listingFetchFx({
					userId: users.buyer.id,
					where: {
						id: "missing-listing-id",
					},
					scope: {},
				}),
			);

			expectErrorFx(missing);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
