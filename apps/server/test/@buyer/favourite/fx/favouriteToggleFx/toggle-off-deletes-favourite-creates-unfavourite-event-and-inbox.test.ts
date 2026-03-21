import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { favouriteToggleFx } from "~/@buyer/favourite/fx/favouriteToggleFx";
import { feedCreateFx } from "~/@buyer/feed/fx/feedCreateFx";
import { auth } from "~/auth/auth";
import { testabase } from "~/test/testabase";
import { createListingFx } from "~/test/utils/createListingFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("favouriteToggleFx", () => {
	it("toggle off: deletes favourite, creates unfavourite event and inbox", async () => {
		const database = await testabase("favouriteToggle-off");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@fav-toggle-off.cz",
				name: "Seller",
				password: "12345678",
			},
		});
		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@fav-toggle-off.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		const listing = await createListingFx(seller.id).pipe(
			withRuntimeFx(database),
			Effect.runPromise,
		);

		const feed = await Effect.gen(function* () {
			return yield* feedCreateFx({
				userId: buyer.id,
				type: "user",
				name: "Test feed",
				query: {},
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		// First add to favourites
		await Effect.gen(function* () {
			yield* favouriteToggleFx({
				userId: buyer.id,
				listingId: listing.id,
				feedId: feed.id,
				toggle: true,
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		// Then remove from favourites
		await Effect.gen(function* () {
			yield* favouriteToggleFx({
				userId: buyer.id,
				listingId: listing.id,
				feedId: feed.id,
				toggle: false,
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		// Favourite record was deleted
		const favourite = await database.kysely
			.selectFrom("favourite")
			.select("id")
			.where("listingId", "=", listing.id)
			.where("userId", "=", buyer.id)
			.executeTakeFirst();

		expect(favourite).toBeUndefined();

		// listing_event "unfavourite" was created
		const events = await database.kysely
			.selectFrom("listing_event")
			.select("event")
			.where("listingId", "=", listing.id)
			.execute();

		const eventKinds = events.map((e) => e.event);
		expect(eventKinds).toContain("favourite");
		expect(eventKinds).toContain("unfavourite");

		// Seller received an inbox item of type "unfavourite"
		const unfavouriteInbox = await database.kysely
			.selectFrom("inbox")
			.select("type")
			.where("userId", "=", seller.id)
			.where("type", "=", "unfavourite")
			.executeTakeFirst();

		expect(unfavouriteInbox).toBeDefined();
	});
});
