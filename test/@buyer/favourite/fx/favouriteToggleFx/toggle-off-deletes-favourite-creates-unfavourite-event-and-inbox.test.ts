import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { favouriteToggleFx } from "~/buyer/favourite/server/fx/favouriteToggleFx";
import { feedCreateFx } from "~/buyer/feed/server/fx/feedCreateFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createListingFx } from "~/test/utils/createListingFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("favouriteToggleFx", () => {
	it("toggle off: deletes favourite, creates unfavourite event and inbox", async () => {
		const database = await testabase("favouriteToggle-off");
		return Effect.gen(function* () {
			const { api } = auth(() => database.dialect);

			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "seller@fav-toggle-off.cz",
						name: "Seller",
						password: "12345678",
					},
				}),
			);
			const { user: buyer } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "buyer@fav-toggle-off.cz",
						name: "Buyer",
						password: "12345678",
					},
				}),
			);

			const listing = yield* createListingFx(seller.id);

			const feed = yield* feedCreateFx({
				userId: buyer.id,
				type: "user",
				name: "Test feed",
				query: {},
			});

			yield* favouriteToggleFx({
				userId: buyer.id,
				listingId: listing.id,
				feedId: feed.id,
				toggle: true,
			});

			yield* favouriteToggleFx({
				userId: buyer.id,
				listingId: listing.id,
				feedId: feed.id,
				toggle: false,
			});

			const favourite = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("favourite")
					.select("id")
					.where("listingId", "=", listing.id)
					.where("userId", "=", buyer.id)
					.executeTakeFirst(),
			);

			expect(favourite).toBeUndefined();

			const events = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("listing_event")
					.select("event")
					.where("listingId", "=", listing.id)
					.execute(),
			);

			const eventKinds = events.map((e) => e.event);
			expect(eventKinds).toContain("favourite");
			expect(eventKinds).toContain("unfavourite");

			const unfavouriteInbox = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("inbox")
					.select("type")
					.where("userId", "=", seller.id)
					.where("type", "=", "unfavourite")
					.executeTakeFirst(),
			);

			expect(unfavouriteInbox).toBeDefined();
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
