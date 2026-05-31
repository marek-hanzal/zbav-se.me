import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateContextFx } from "@/lib/common/date";
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
		const firstWindowNow = DateTime.fromISO("2026-05-11T10:05:45.000Z");
		const nextWindowNow = DateTime.fromISO("2026-05-11T10:16:00.000Z");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

			const listing = yield* createListingFx(seller.id);

			yield* listingEventCreateFx({
				userId: buyer.id,
				listingId: listing.id,
				event: "favourite",
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => firstWindowNow,
				}),
			);

			const duplicate = yield* Effect.either(
				listingEventRateLimitFx({
					listingId: listing.id,
					event: "favourite",
				}).pipe(
					Effect.provideService(DateContextFx, {
						now: () => firstWindowNow,
					}),
				),
			);

			const duplicateError = expectTaggedErrorFx(duplicate, {
				tag: "RateLimitErrorFx",
				message: "You have already created this event",
			}) as {
				rule?: string;
				limit?: number;
				count?: number;
				exceeded?: number;
				window?: number;
			};

			expect(duplicateError.rule).toBe("listing:event");
			expect(duplicateError.limit).toBe(1);
			expect(duplicateError.count).toBe(2);
			expect(duplicateError.exceeded).toBe(1);
			expect(duplicateError.window).toBe(600);

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
				}).pipe(
					Effect.provideService(DateContextFx, {
						now: () => firstWindowNow,
					}),
				),
			);

			expect(differentEvent._tag).toBe("Right");

			const nextWindowEvent = yield* Effect.either(
				listingEventRateLimitFx({
					listingId: listing.id,
					event: "favourite",
				}).pipe(
					Effect.provideService(DateContextFx, {
						now: () => nextWindowNow,
					}),
				),
			);

			expect(nextWindowEvent._tag).toBe("Right");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
