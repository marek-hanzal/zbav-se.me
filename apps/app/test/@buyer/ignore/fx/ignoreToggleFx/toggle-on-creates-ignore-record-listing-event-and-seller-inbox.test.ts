import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { ignoreToggleFx } from "~/buyer/ignore/server/fx/ignoreToggleFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createListingFx } from "~/test/utils/createListingFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

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
});
