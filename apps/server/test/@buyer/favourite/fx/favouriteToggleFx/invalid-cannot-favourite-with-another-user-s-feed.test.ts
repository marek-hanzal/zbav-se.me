import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { favouriteToggleFx } from "~/@buyer/favourite/fx/favouriteToggleFx";
import { feedCreateFx } from "~/@buyer/feed/fx/feedCreateFx";
import { auth } from "~/auth/auth";
import { createListingFx, withRuntimeFx } from "~test/fixture/transactionFixture";
import { testabase } from "~test/testabase";

describe("favouriteToggleFx", () => {
	it("invalid: cannot favourite with another user's feed", async () => {
		const database = await testabase("favouriteToggle-wrong-feed");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@fav-wrong-feed.cz",
				name: "Seller",
				password: "12345678",
			},
		});
		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@fav-wrong-feed.cz",
				name: "Buyer",
				password: "12345678",
			},
		});
		const { user: other } = await api.signUpEmail({
			body: {
				email: "other@fav-wrong-feed.cz",
				name: "Other",
				password: "12345678",
			},
		});

		const listing = await createListingFx(seller.id).pipe(
			withRuntimeFx(database),
			Effect.runPromise,
		);

		// Feed belongs to "other", not to "buyer"
		const otherFeed = await Effect.gen(function* () {
			return yield* feedCreateFx({
				userId: other.id,
				type: "user",
				name: "Other's feed",
				query: {},
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		await expect(
			Effect.gen(function* () {
				yield* favouriteToggleFx({
					userId: buyer.id,
					listingId: listing.id,
					feedId: otherFeed.id,
					toggle: true,
				});
			}).pipe(withRuntimeFx(database), Effect.runPromise),
		).rejects.toThrow();
	});
});
