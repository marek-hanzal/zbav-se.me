import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { flagToggleFx } from "~/@buyer/flag/fx/flagToggleFx";
import { auth } from "~/auth/auth";
import { createListingFx, withRuntimeFx } from "~test/fixture/transactionFixture";
import { testabase } from "~test/testabase";

describe("flagToggleFx", () => {
	it("toggle on: creates flag record and listing_event", async () => {
		const database = await testabase("flagToggle-on");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@flag-toggle-on.cz",
				name: "Seller",
				password: "12345678",
			},
		});
		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@flag-toggle-on.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		const listing = await createListingFx(seller.id).pipe(
			withRuntimeFx(database),
			Effect.runPromise,
		);

		await Effect.gen(function* () {
			yield* flagToggleFx({
				userId: buyer.id,
				listingId: listing.id,
				toggle: true,
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		// Flag record was created
		const flag = await database.kysely
			.selectFrom("flag")
			.select([
				"listingId",
				"userId",
			])
			.where("listingId", "=", listing.id)
			.where("userId", "=", buyer.id)
			.executeTakeFirst();

		expect(flag).toBeDefined();

		// listing_event "flag" was created
		const events = await database.kysely
			.selectFrom("listing_event")
			.select("event")
			.where("listingId", "=", listing.id)
			.execute();

		expect(events.map((e) => e.event)).toContain("flag");

		// Flag creates inbox for seller (type "flag", priority "common")
		const sellerInbox = await database.kysely
			.selectFrom("inbox")
			.select("type")
			.where("userId", "=", seller.id)
			.where("type", "=", "flag")
			.executeTakeFirst();

		expect(sellerInbox).toBeDefined();
		expect(sellerInbox?.type).toBe("flag");
	});

	it("toggle off: deletes flag record and creates unflag event", async () => {
		const database = await testabase("flagToggle-off");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@flag-toggle-off.cz",
				name: "Seller",
				password: "12345678",
			},
		});
		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@flag-toggle-off.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		const listing = await createListingFx(seller.id).pipe(
			withRuntimeFx(database),
			Effect.runPromise,
		);

		// First flag the listing
		await Effect.gen(function* () {
			yield* flagToggleFx({
				userId: buyer.id,
				listingId: listing.id,
				toggle: true,
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		// Then unflag it
		await Effect.gen(function* () {
			yield* flagToggleFx({
				userId: buyer.id,
				listingId: listing.id,
				toggle: false,
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		// Flag record was deleted
		const flag = await database.kysely
			.selectFrom("flag")
			.select("id")
			.where("listingId", "=", listing.id)
			.where("userId", "=", buyer.id)
			.executeTakeFirst();

		expect(flag).toBeUndefined();

		// Both events were tracked
		const events = await database.kysely
			.selectFrom("listing_event")
			.select("event")
			.where("listingId", "=", listing.id)
			.execute();

		const kinds = events.map((e) => e.event);
		expect(kinds).toContain("flag");
		expect(kinds).toContain("unflag");

		// Unflag creates inbox for seller with type "unflag"
		const unflagInbox = await database.kysely
			.selectFrom("inbox")
			.select("type")
			.where("userId", "=", seller.id)
			.where("type", "=", "unflag")
			.executeTakeFirst();

		expect(unflagInbox).toBeDefined();
	});

	it("invalid: seller cannot flag own listing", async () => {
		const database = await testabase("flagToggle-own-listing");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@flag-own.cz",
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
				yield* flagToggleFx({
					userId: seller.id,
					listingId: listing.id,
					toggle: true,
				});
			}).pipe(withRuntimeFx(database), Effect.runPromise),
		).rejects.toThrow();
	});

	it("invalid: cannot flag an already-flagged listing (conflict on insert)", async () => {
		const database = await testabase("flagToggle-duplicate");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@flag-duplicate.cz",
				name: "Seller",
				password: "12345678",
			},
		});
		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@flag-duplicate.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		const listing = await createListingFx(seller.id).pipe(
			withRuntimeFx(database),
			Effect.runPromise,
		);

		// First flag succeeds
		await Effect.gen(function* () {
			yield* flagToggleFx({
				userId: buyer.id,
				listingId: listing.id,
				toggle: true,
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		// Second flag throws because doNothing causes executeTakeFirstOrThrow to fail
		await expect(
			Effect.gen(function* () {
				yield* flagToggleFx({
					userId: buyer.id,
					listingId: listing.id,
					toggle: true,
				});
			}).pipe(withRuntimeFx(database), Effect.runPromise),
		).rejects.toThrow();
	});
});
