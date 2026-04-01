import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { favouriteToggleFx } from "~/buyer/favourite/server/fx/favouriteToggleFx";
import { feedCreateFx } from "~/buyer/feed/server/fx/feedCreateFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createListingFx } from "~/test/utils/createListingFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("favouriteToggleFx", () => {
	it("invalid: cannot favourite with another user's feed", async () => {
		const database = await testabase("favouriteToggle-wrong-feed");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "seller@fav-wrong-feed.cz",
						name: "Seller",
						password: "12345678",
					},
				}),
			);
			const { user: buyer } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "buyer@fav-wrong-feed.cz",
						name: "Buyer",
						password: "12345678",
					},
				}),
			);
			const { user: other } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "other@fav-wrong-feed.cz",
						name: "Other",
						password: "12345678",
					},
				}),
			);

			const listing = yield* createListingFx(seller.id);

			const otherFeed = yield* feedCreateFx({
				userId: other.id,
				type: "user",
				name: "Other's feed",
				query: {},
			});

			const result = yield* Effect.either(
				favouriteToggleFx({
					userId: buyer.id,
					listingId: listing.id,
					feedId: otherFeed.id,
					toggle: true,
				}),
			);

			expect(result._tag).toBe("Left");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
