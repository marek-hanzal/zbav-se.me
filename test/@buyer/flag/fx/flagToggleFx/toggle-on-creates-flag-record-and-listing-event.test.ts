import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { flagToggleFx } from "~/buyer/flag/server/fx/flagToggleFx";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";

describe("flagToggleFx", () => {
	it("toggle on: creates flag record and listing_event", async () => {
		const database = await testabase("flagToggle-on");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "seller@flag-toggle-on.cz",
						name: "Seller",
						password: "12345678",
					},
				}),
			);
			const { user: buyer } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "buyer@flag-toggle-on.cz",
						name: "Buyer",
						password: "12345678",
					},
				}),
			);

			const listing = yield* createListingFx(seller.id);

			yield* flagToggleFx({
				userId: buyer.id,
				listingId: listing.id,
				toggle: true,
			});

			const flag = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("flag")
					.select([
						"listingId",
						"userId",
					])
					.where("listingId", "=", listing.id)
					.where("userId", "=", buyer.id)
					.executeTakeFirst(),
			);

			expect(flag).toBeDefined();

			const events = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("listing_event")
					.select("event")
					.where("listingId", "=", listing.id)
					.execute(),
			);

			expect(events.map((e) => e.event)).toContain("flag");

			const sellerInbox = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("inbox")
					.select("type")
					.where("userId", "=", seller.id)
					.where("type", "=", "flag")
					.executeTakeFirst(),
			);

			expect(sellerInbox).toBeDefined();
			expect(sellerInbox?.type).toBe("flag");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
