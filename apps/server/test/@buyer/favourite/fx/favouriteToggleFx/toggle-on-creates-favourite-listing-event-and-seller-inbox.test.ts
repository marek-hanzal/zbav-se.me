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
});
