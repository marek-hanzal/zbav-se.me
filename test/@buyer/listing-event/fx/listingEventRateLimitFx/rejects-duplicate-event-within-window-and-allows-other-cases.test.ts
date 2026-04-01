import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingEventCreateFx } from "~/buyer/listing-event/server/fx/listingEventCreateFx";
import { listingEventRateLimitFx } from "~/buyer/listing-event/server/fx/listingEventRateLimitFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createListingFx } from "~/test/utils/createListingFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("listingEventRateLimitFx", () => {
	it("rejects duplicate event within the window and allows old or different events", async () => {
		const database = await testabase("listingEventRateLimitFx-window");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const signUp = (email: string, name: string) =>
				Effect.promise(() =>
					api.signUpEmail({
						body: {
							email,
							name,
							password: "12345678",
						},
					}),
				);

			const { user: seller } = yield* signUp(
				"listing-event-rate-limit-seller@test.cz",
				"Listing Event Seller",
			);
			const { user: buyer } = yield* signUp(
				"listing-event-rate-limit-buyer@test.cz",
				"Listing Event Buyer",
			);

			const listing = yield* createListingFx(seller.id);

			yield* listingEventCreateFx({
				userId: buyer.id,
				listingId: listing.id,
				event: "favourite",
			});

			const duplicate = yield* Effect.either(
				listingEventRateLimitFx({
					listingId: listing.id,
					event: "favourite",
				}),
			);

			expect(duplicate._tag).toBe("Left");

			const differentEvent = yield* Effect.either(
				listingEventRateLimitFx({
					listingId: listing.id,
					event: "like",
				}),
			);

			expect(differentEvent._tag).toBe("Right");

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("listing_event")
					.values({
						id: "listing-event-rate-limit-old",
						listingId: listing.id,
						event: "dislike",
						createdAt: new Date(Date.now() - 11 * 60 * 1000),
					})
					.execute(),
			);

			const oldEvent = yield* Effect.either(
				listingEventRateLimitFx({
					listingId: listing.id,
					event: "dislike",
				}),
			);

			expect(oldEvent._tag).toBe("Right");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
