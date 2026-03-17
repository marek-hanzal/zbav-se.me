import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { ignoreToggleFx } from "~/@buyer/ignore/fx/ignoreToggleFx";
import { auth } from "~/auth/auth";
import { createListingFx, withRuntimeFx } from "~test/fixture/transactionFixture";
import { testabase } from "~test/testabase";

describe("ignoreToggleFx", () => {
	it("toggle on: creates ignore record, listing_event and seller inbox", async () => {
		const database = await testabase("ignoreToggle-on");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@ignore-toggle-on.cz",
				name: "Seller",
				password: "12345678",
			},
		});
		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@ignore-toggle-on.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		const listing = await createListingFx(seller.id).pipe(
			withRuntimeFx(database),
			Effect.runPromise,
		);

		await Effect.gen(function* () {
			yield* ignoreToggleFx({
				userId: buyer.id,
				listingId: listing.id,
				toggle: true,
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		// Ignore record was created
		const ignore = await database.kysely
			.selectFrom("ignore")
			.select([
				"listingId",
				"userId",
			])
			.where("listingId", "=", listing.id)
			.where("userId", "=", buyer.id)
			.executeTakeFirst();

		expect(ignore).toBeDefined();

		// listing_event "ignore" was created
		const events = await database.kysely
			.selectFrom("listing_event")
			.select("event")
			.where("listingId", "=", listing.id)
			.execute();

		expect(events.map((e) => e.event)).toContain("ignore");

		// Ignore creates inbox for seller with type "ignore"
		const sellerInbox = await database.kysely
			.selectFrom("inbox")
			.select("type")
			.where("userId", "=", seller.id)
			.where("type", "=", "ignore")
			.executeTakeFirst();

		expect(sellerInbox).toBeDefined();
		expect(sellerInbox?.type).toBe("ignore");
	});

	it("toggle off: deletes ignore record, creates unignore event and seller inbox", async () => {
		const database = await testabase("ignoreToggle-off");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@ignore-toggle-off.cz",
				name: "Seller",
				password: "12345678",
			},
		});
		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@ignore-toggle-off.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		const listing = await createListingFx(seller.id).pipe(
			withRuntimeFx(database),
			Effect.runPromise,
		);

		// First ignore the listing
		await Effect.gen(function* () {
			yield* ignoreToggleFx({
				userId: buyer.id,
				listingId: listing.id,
				toggle: true,
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		// Then unignore it
		await Effect.gen(function* () {
			yield* ignoreToggleFx({
				userId: buyer.id,
				listingId: listing.id,
				toggle: false,
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		// Ignore record was deleted
		const ignore = await database.kysely
			.selectFrom("ignore")
			.select("id")
			.where("listingId", "=", listing.id)
			.where("userId", "=", buyer.id)
			.executeTakeFirst();

		expect(ignore).toBeUndefined();

		// Both events were tracked
		const events = await database.kysely
			.selectFrom("listing_event")
			.select("event")
			.where("listingId", "=", listing.id)
			.execute();

		const kinds = events.map((e) => e.event);
		expect(kinds).toContain("ignore");
		expect(kinds).toContain("unignore");

		// Unignore creates inbox for seller with type "unignore"
		const unignoreInbox = await database.kysely
			.selectFrom("inbox")
			.select("type")
			.where("userId", "=", seller.id)
			.where("type", "=", "unignore")
			.executeTakeFirst();

		expect(unignoreInbox).toBeDefined();
	});

	it("invalid: seller cannot ignore own listing", async () => {
		const database = await testabase("ignoreToggle-own-listing");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@ignore-own.cz",
				name: "Seller",
				password: "12345678",
			},
		});

		const listing = await createListingFx(seller.id).pipe(
			withRuntimeFx(database),
			Effect.runPromise,
		);

		await expect(
			Effect.gen(function* () {
				yield* ignoreToggleFx({
					userId: seller.id,
					listingId: listing.id,
					toggle: true,
				});
			}).pipe(withRuntimeFx(database), Effect.runPromise),
		).rejects.toThrow();
	});
});
