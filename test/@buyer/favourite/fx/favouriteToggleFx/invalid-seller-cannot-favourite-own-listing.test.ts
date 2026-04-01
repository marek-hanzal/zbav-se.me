import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { favouriteToggleFx } from "~/buyer/favourite/server/fx/favouriteToggleFx";
import { feedCreateFx } from "~/buyer/feed/server/fx/feedCreateFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createListingFx } from "~/test/utils/createListingFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("favouriteToggleFx", () => {
	it("invalid: seller cannot favourite own listing", async () => {
		const database = await testabase("favouriteToggle-own-listing");
		return Effect.gen(function* () {
			const { api } = auth(() => database.dialect);

			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "seller@fav-own.cz",
						name: "Seller",
						password: "12345678",
					},
				}),
			);

			const listing = yield* createListingFx(seller.id);

			const feed = yield* feedCreateFx({
				userId: seller.id,
				type: "user",
				name: "Test feed",
				query: {},
			});

			const result = yield* Effect.either(
				favouriteToggleFx({
					userId: seller.id,
					listingId: listing.id,
					feedId: feed.id,
					toggle: true,
				}),
			);

			expect(result._tag).toBe("Left");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
