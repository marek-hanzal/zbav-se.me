import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { fetchActivityItemsFx } from "~/test/activity/fx/fetchActivityItemsFx";
import { expectErrorFx } from "~/test/common/fx/expectErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createOpenScenarioFx } from "~/test/transaction/fx/createOpenScenarioFx";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { transactionEntryCollectionFx } from "~/user/transaction-entry/server/fx/transactionEntryCollectionFx";
import { transactionEntryCountFx } from "~/user/transaction-entry/server/fx/transactionEntryCountFx";
import { transactionEntryCreateFx } from "~/user/transaction-entry/server/fx/transactionEntryCreateFx";
import { transactionEntryFetchFx } from "~/user/transaction-entry/server/fx/transactionEntryFetchFx";

describe("transactionEntry workflow", () => {
	it("creates text entry, notifies counterparty and maps direction per viewer", async () => {
		const database = await testabase("transactionEntry-text-workflow");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});
			const seller = users.seller;
			const buyer = users.buyer;
			const stranger = users.stranger;

			const { transactionId, listingId } = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const entry = yield* transactionEntryCreateFx({
				userId: buyer.id,
				transactionId,
				kind: "text",
				payload: {
					text: "Ahoj, kdy se muzeme potkat?",
				},
			});

			expect(entry.kind).toBe("text");
			expect(entry.direction).toBe("out");

			const sellerView = yield* transactionEntryFetchFx({
				userId: seller.id,
				where: {
					id: entry.id,
				},
			});

			expect(sellerView.kind).toBe("text");
			expect(sellerView.direction).toBe("in");

			const collection = yield* transactionEntryCollectionFx({
				userId: seller.id,
				where: {
					transactionId,
					kind: "text",
				},
			});

			expect(collection.map((item) => item.id)).toContain(entry.id);

			const outsiderFetch = yield* Effect.either(
				transactionEntryFetchFx({
					userId: stranger.id,
					where: {
						id: entry.id,
					},
				}),
			);
			const outsiderCollection = yield* transactionEntryCollectionFx({
				userId: stranger.id,
				where: {
					transactionId,
				},
			});
			const outsiderCount = yield* transactionEntryCountFx({
				userId: stranger.id,
				where: {
					transactionId,
				},
			});

			expectErrorFx(outsiderFetch);
			expect(outsiderCollection).toHaveLength(0);
			expect(outsiderCount).toBe(0);

			const activityItems = yield* fetchActivityItemsFx({
				database,
				userId: seller.id,
				type: "buyer-message",
			});

			const matchingActivity = activityItems.find(
				(item) =>
					Array.isArray(item.reference) &&
					item.reference[0] === listingId &&
					item.reference[1] === transactionId &&
					"transactionEntryId" in item.payload &&
					item.payload.transactionEntryId === entry.id,
			);

			expect(matchingActivity?.type).toBe("buyer-message");
			expect(matchingActivity?.reference).toEqual([
				listingId,
				transactionId,
			]);
			expect(matchingActivity?.payload).toMatchObject({
				transactionId,
				transactionEntryId: entry.id,
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
