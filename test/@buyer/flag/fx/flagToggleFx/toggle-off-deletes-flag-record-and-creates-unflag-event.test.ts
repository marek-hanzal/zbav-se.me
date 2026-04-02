import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { flagToggleFx } from "~/buyer/flag/server/fx/flagToggleFx";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";

describe("flagToggleFx", () => {
	it("toggle off: deletes flag record and creates unflag event", async () => {
		const database = await testabase("flagToggle-off");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "seller@flag-toggle-off.cz",
						name: "Seller",
						password: "12345678",
					},
				}),
			);
			const { user: buyer } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "buyer@flag-toggle-off.cz",
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

			yield* flagToggleFx({
				userId: buyer.id,
				listingId: listing.id,
				toggle: false,
			});

			const flag = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("flag")
					.select("id")
					.where("listingId", "=", listing.id)
					.where("userId", "=", buyer.id)
					.executeTakeFirst(),
			);

			expect(flag).toBeUndefined();

			const events = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("listing_event")
					.select("event")
					.where("listingId", "=", listing.id)
					.execute(),
			);

			const kinds = events.map((e) => e.event);
			expect(kinds).toContain("flag");
			expect(kinds).toContain("unflag");

			const unflagInbox = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("inbox")
					.select("type")
					.where("userId", "=", seller.id)
					.where("type", "=", "unflag")
					.executeTakeFirst(),
			);

			expect(unflagInbox).toBeDefined();
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
