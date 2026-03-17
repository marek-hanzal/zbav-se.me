import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { favouriteToggleFx } from "~/@buyer/favourite/fx/favouriteToggleFx";
import { feedCreateFx } from "~/@buyer/feed/fx/feedCreateFx";
import { auth } from "~/auth/auth";
import { createListingFx, withRuntimeFx } from "~test/fixture/transactionFixture";
import { testabase } from "~test/testabase";

describe("favouriteToggleFx", () => {
	it("toggle on: creates favourite, listing_event and seller inbox", async () => {
		const database = await testabase("favouriteToggle-on");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@fav-toggle-on.cz",
				name: "Seller",
				password: "12345678",
			},
		});
		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@fav-toggle-on.cz",
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

		await Effect.gen(function* () {
			yield* favouriteToggleFx({
				userId: buyer.id,
				listingId: listing.id,
				feedId: feed.id,
				toggle: true,
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		// Favourite record was created
		const favourite = await database.kysely
			.selectFrom("favourite")
			.select([
				"listingId",
				"userId",
				"feedId",
			])
			.where("listingId", "=", listing.id)
			.where("userId", "=", buyer.id)
			.executeTakeFirst();

		expect(favourite).toBeDefined();
		expect(favourite?.feedId).toBe(feed.id);

		// listing_event "favourite" was created
		const events = await database.kysely
			.selectFrom("listing_event")
			.select("event")
			.where("listingId", "=", listing.id)
			.execute();

		expect(events.map((e) => e.event)).toContain("favourite");

		// Seller received an inbox item of type "favourite"
		const inbox = await database.kysely
			.selectFrom("inbox")
			.select([
				"type",
				"family",
			])
			.where("userId", "=", seller.id)
			.where("type", "=", "favourite")
			.executeTakeFirst();

		expect(inbox).toBeDefined();
		expect(inbox?.family).toBe("reaction");
	});

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
