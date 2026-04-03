import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingEventCreateFx } from "~/buyer/listing-event/server/fx/listingEventCreateFx";
import { listingEventRateLimitFx } from "~/buyer/listing-event/server/fx/listingEventRateLimitFx";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("listingEventRateLimitFx", () => {
	it("rejects duplicate event within the window and allows old or different events", async () => {
		const database = await testabase("listingEventRateLimitFx-window");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

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

			expectTaggedErrorFx(duplicate, {
				tag: "TooManyRequestsFx",
				message: "You have already created this event",
			});

			const duplicateCount = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("listing_event")
					.select("id")
					.where("listingId", "=", listing.id)
					.where("event", "=", "favourite")
					.execute(),
			);

			expect(duplicateCount).toHaveLength(1);

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
