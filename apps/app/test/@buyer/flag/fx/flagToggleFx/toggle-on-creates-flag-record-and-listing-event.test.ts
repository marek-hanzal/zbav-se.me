import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { flagToggleFx } from "~/client/@buyer/flag/server/fx/flagToggleFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createListingFx } from "~/test/utils/createListingFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

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
});
