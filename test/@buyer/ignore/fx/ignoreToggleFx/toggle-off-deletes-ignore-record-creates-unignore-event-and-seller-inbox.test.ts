import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { ignoreToggleFx } from "~/buyer/ignore/server/fx/ignoreToggleFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createListingFx } from "~/test/utils/createListingFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("ignoreToggleFx", () => {
	it("toggle off: deletes ignore record, creates unignore event and seller inbox", async () => {
		const database = await testabase("ignoreToggle-off");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "seller@ignore-toggle-off.cz",
						name: "Seller",
						password: "12345678",
					},
				}),
			);
			const { user: buyer } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "buyer@ignore-toggle-off.cz",
						name: "Buyer",
						password: "12345678",
					},
				}),
			);

			const listing = yield* createListingFx(seller.id);

			yield* ignoreToggleFx({
				userId: buyer.id,
				listingId: listing.id,
				toggle: true,
			});

			yield* ignoreToggleFx({
				userId: buyer.id,
				listingId: listing.id,
				toggle: false,
			});

			const ignore = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("ignore")
					.select("id")
					.where("listingId", "=", listing.id)
					.where("userId", "=", buyer.id)
					.executeTakeFirst(),
			);

			expect(ignore).toBeUndefined();

			const events = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("listing_event")
					.select("event")
					.where("listingId", "=", listing.id)
					.execute(),
			);

			const kinds = events.map((e) => e.event);
			expect(kinds).toContain("ignore");
			expect(kinds).toContain("unignore");

			const unignoreInbox = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("inbox")
					.select("type")
					.where("userId", "=", seller.id)
					.where("type", "=", "unignore")
					.executeTakeFirst(),
			);

			expect(unignoreInbox).toBeDefined();
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
