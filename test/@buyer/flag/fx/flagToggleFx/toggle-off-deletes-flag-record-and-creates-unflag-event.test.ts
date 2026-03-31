import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { flagToggleFx } from "~/buyer/flag/server/fx/flagToggleFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createListingFx } from "~/test/utils/createListingFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("flagToggleFx", () => {
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
});
