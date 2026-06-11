import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { withDateServiceFx } from "@/lib/common/date";
import { transactionCreateFx } from "~/buyer/transaction/server/fx/transactionCreateFx";
import { withCronFx } from "~/common/@cron/server/withCronFx";
import { transactionAcceptFx } from "~/seller/transaction/server/fx/transactionAcceptFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { transactionEntryCreateFx } from "~/user/transaction-entry/server/fx/transactionEntryCreateFx";

const atFx = <A, E, R>(iso: string, eff: Effect.Effect<A, E, R>) =>
	eff.pipe(
		withDateServiceFx({
			now: () =>
				DateTime.fromISO(iso, {
					setZone: true,
				}),
		}),
	);

describe("transactionEntry workflow", () => {
	it("allows new messages in an open transaction after hourly cron expires the parent listing", async () => {
		const database = await testabase("transactionEntry-live-listing-expired-by-cron");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});
			const seller = users.seller;
			const buyer = users.buyer;

			const listing = yield* createListingFx(seller.id, {
				title: "Live listing waiting for cron expiration",
			});

			yield* Effect.promise(() =>
				database.kysely
					.updateTable("listing")
					.set({
						expiresAt: new Date("2026-05-10T09:59:59.000Z"),
					})
					.where("id", "=", listing.id)
					.execute(),
			);

			const transaction = yield* transactionCreateFx({
				listingId: listing.id,
				userId: buyer.id,
			});

			yield* transactionAcceptFx({
				transactionId: transaction.id,
				userId: seller.id,
			});

			yield* atFx(
				"2026-05-10T10:00:00.000Z",
				withCronFx({
					schedule: "hourly",
				}),
			);

			const expiredListing = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("listing")
					.select([
						"id",
						"status",
					])
					.where("id", "=", listing.id)
					.executeTakeFirstOrThrow(),
			);

			expect(expiredListing).toMatchObject({
				id: listing.id,
				status: "expired",
			});

			const entry = yield* transactionEntryCreateFx({
				userId: buyer.id,
				transactionId: transaction.id,
				kind: "text",
				payload: {
					text: "The listing expired in cron, but the chat must still work.",
				},
			});

			expect(entry.kind).toBe("text");
			expect(entry.direction).toBe("out");
			expect(entry.payload).toEqual({
				text: "The listing expired in cron, but the chat must still work.",
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
