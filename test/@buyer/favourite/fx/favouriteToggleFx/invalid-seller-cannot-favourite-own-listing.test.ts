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
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@fav-own.cz",
				name: "Seller",
				password: "12345678",
			},
		});

		const listing = await createListingFx(seller.id).pipe(
			withRuntimeFx(database),
			Effect.runPromise,
		);

		const feed = await Effect.gen(function* () {
			return yield* feedCreateFx({
				userId: seller.id,
				type: "user",
				name: "Test feed",
				query: {},
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		await expect(
			Effect.gen(function* () {
				yield* favouriteToggleFx({
					userId: seller.id,
					listingId: listing.id,
					feedId: feed.id,
					toggle: true,
				});
			}).pipe(withRuntimeFx(database), Effect.runPromise),
		).rejects.toThrow();
	});
});
