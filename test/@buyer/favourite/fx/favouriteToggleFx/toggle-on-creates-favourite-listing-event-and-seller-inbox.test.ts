import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { favouriteToggleFx } from "~/buyer/favourite/server/fx/favouriteToggleFx";
import { feedCreateFx } from "~/buyer/feed/server/fx/feedCreateFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createListingFx } from "~/test/utils/createListingFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("favouriteToggleFx", () => {
	it("toggle on: creates favourite, listing_event and seller inbox", async () => {
		const database = await testabase("favouriteToggle-on");
		return Effect.gen(function* () {
			const { api } = auth(() => database.dialect);

			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "seller@fav-toggle-on.cz",
						name: "Seller",
						password: "12345678",
					},
				}),
			);
			const { user: buyer } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "buyer@fav-toggle-on.cz",
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

			const favourite = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("favourite")
					.select([
						"listingId",
						"userId",
						"feedId",
					])
					.where("listingId", "=", listing.id)
					.where("userId", "=", buyer.id)
					.executeTakeFirst(),
			);

			expect(favourite).toBeDefined();
			expect(favourite?.feedId).toBe(feed.id);

			const events = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("listing_event")
					.select("event")
					.where("listingId", "=", listing.id)
					.execute(),
			);

			expect(events.map((e) => e.event)).toContain("favourite");

			const inbox = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("inbox")
					.select([
						"type",
						"family",
					])
					.where("userId", "=", seller.id)
					.where("type", "=", "favourite")
					.executeTakeFirst(),
			);

			expect(inbox).toBeDefined();
			expect(inbox?.family).toBe("reaction");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
