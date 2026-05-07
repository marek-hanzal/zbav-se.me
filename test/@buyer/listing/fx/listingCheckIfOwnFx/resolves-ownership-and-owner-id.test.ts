import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCheckIfOwnFx } from "~/buyer/listing/server/fx/listingCheckIfOwnFx";
import { expectErrorFx } from "~/test/common/fx/expectErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("listingCheckIfOwnFx", () => {
	it("rejects missing and own listing, and returns owner id for foreign listing", async () => {
		const database = await testabase("listingCheckIfOwnFx-contract");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});

			const listing = yield* createListingFx(users.seller.id);

			const missing = yield* Effect.either(
				listingCheckIfOwnFx({
					userId: users.buyer.id,
					listingId: "missing-listing-id",
					message: "Own listing is not allowed",
				}),
			);
			expectErrorFx(missing);

			const own = yield* Effect.either(
				listingCheckIfOwnFx({
					userId: users.seller.id,
					listingId: listing.id,
					message: "Own listing is not allowed",
				}),
			);
			expectErrorFx(own);

			const ownerId = yield* listingCheckIfOwnFx({
				userId: users.buyer.id,
				listingId: listing.id,
				message: "Own listing is not allowed",
			});

			expect(ownerId).toBe(users.seller.id);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
