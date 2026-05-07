import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateContextFx } from "@/lib/common/date";
import { transactionCreateFx } from "~/buyer/transaction/server/fx/transactionCreateFx";
import { transactionAcceptFx } from "~/seller/transaction/server/fx/transactionAcceptFx";
import { transactionListingCollectionFx } from "~/seller/transaction-listing/server/fx/transactionListingCollectionFx";
import { transactionListingFetchFx } from "~/seller/transaction-listing/server/fx/transactionListingFetchFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { transactionEntryCreateFx } from "~/user/transaction-entry/server/fx/transactionEntryCreateFx";

const atFx = <A, E, R>(iso: string, eff: Effect.Effect<A, E, R>) =>
	eff.pipe(
		Effect.provideService(DateContextFx, {
			now: () => DateTime.fromISO(iso),
		}),
	);

describe("seller transaction-listing read model", () => {
	it("uses the latest visible timestamp across transactions and ignores newer hidden interest text", async () => {
		const database = await testabase("seller-transaction-listing-lastat-controlled-timestamps");

		return Effect.gen(function* () {
			const { seller, buyer, stranger } = yield* createUsersFx({});
			const listing = yield* createListingFx(seller.id, {
				title: "time controlled listing preview",
			});

			const hiddenTransaction = yield* atFx(
				"2026-04-02T10:00:00.000Z",
				transactionCreateFx({
					listingId: listing.id,
					userId: buyer.id,
				}),
			);
			const visibleTransaction = yield* atFx(
				"2026-04-02T10:05:00.000Z",
				transactionCreateFx({
					listingId: listing.id,
					userId: stranger.id,
				}),
			);

			yield* atFx(
				"2026-04-02T11:45:00.000Z",
				transactionEntryCreateFx({
					userId: buyer.id,
					transactionId: hiddenTransaction.id,
					kind: "text",
					payload: {
						text: "Newest hidden pending buyer text",
					},
				}),
			);

			yield* atFx(
				"2026-04-02T10:30:00.000Z",
				transactionAcceptFx({
					transactionId: visibleTransaction.id,
					userId: seller.id,
				}),
			);
			const visibleEntry = yield* atFx(
				"2026-04-02T11:30:00.000Z",
				transactionEntryCreateFx({
					userId: stranger.id,
					transactionId: visibleTransaction.id,
					kind: "text",
					payload: {
						text: "Latest visible buyer text",
					},
				}),
			);

			const collection = yield* transactionListingCollectionFx({
				scope: {
					userId: seller.id,
				},
			});
			const fetched = yield* transactionListingFetchFx({
				scope: {
					userId: seller.id,
				},
				where: {
					id: listing.id,
				},
			});

			expect(collection.map((item) => item.id)).toEqual([
				listing.id,
			]);
			expect(fetched.entry.id).toBe(visibleEntry.id);
			expect(fetched.lastAt.toISOString()).toBe("2026-04-02T11:30:00.000Z");
			expect(collection[0]?.entry.id).toBe(visibleEntry.id);
			expect(collection[0]?.lastAt.toISOString()).toBe("2026-04-02T11:30:00.000Z");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
