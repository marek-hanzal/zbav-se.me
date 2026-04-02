import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { ignoreToggleFx } from "~/buyer/ignore/server/fx/ignoreToggleFx";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";

describe("ignoreToggleFx", () => {
	it("toggle on: creates ignore record, listing_event and seller inbox", async () => {
		const database = await testabase("ignoreToggle-on");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "seller@ignore-toggle-on.cz",
						name: "Seller",
						password: "12345678",
					},
				}),
			);
			const { user: buyer } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "buyer@ignore-toggle-on.cz",
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

			const ignore = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("ignore")
					.select([
						"listingId",
						"userId",
					])
					.where("listingId", "=", listing.id)
					.where("userId", "=", buyer.id)
					.executeTakeFirst(),
			);

			expect(ignore).toBeDefined();

			const events = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("listing_event")
					.select("event")
					.where("listingId", "=", listing.id)
					.execute(),
			);

			expect(events.map((e) => e.event)).toContain("ignore");

			const sellerInbox = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("inbox")
					.select("type")
					.where("userId", "=", seller.id)
					.where("type", "=", "ignore")
					.executeTakeFirst(),
			);

			expect(sellerInbox).toBeDefined();
			expect(sellerInbox?.type).toBe("ignore");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
