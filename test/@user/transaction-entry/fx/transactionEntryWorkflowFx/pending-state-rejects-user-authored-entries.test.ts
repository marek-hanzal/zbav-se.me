import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionAcceptFx } from "~/seller/transaction/server/fx/transactionAcceptFx";
import { fetchActivityItemsFx } from "~/test/activity/fx/fetchActivityItemsFx";
import { testUploadUrl } from "~/test/common/fn/testUploadUrl";
import { expectErrorFx } from "~/test/common/fx/expectErrorFx";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { transactionEntryCollectionFx } from "~/user/transaction-entry/server/fx/transactionEntryCollectionFx";
import { transactionEntryCountFx } from "~/user/transaction-entry/server/fx/transactionEntryCountFx";
import { transactionEntryCreateFx } from "~/user/transaction-entry/server/fx/transactionEntryCreateFx";
import { transactionEntryFetchFx } from "~/user/transaction-entry/server/fx/transactionEntryFetchFx";
import { uploadCreateFx } from "~/user/upload/server/fx/uploadCreateFx";

describe("transactionEntry workflow", () => {
	it("allows buyer text in interest without seller visibility or activity", async () => {
		const database = await testabase("transactionEntry-pending-rejects-authored");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

			const { listingId } = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const transaction = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("listingId", "=", listingId)
					.where("userId", "=", buyer.id)
					.executeTakeFirstOrThrow(),
			);

			const upload = yield* uploadCreateFx({
				userId: buyer.id,
				url: testUploadUrl("transaction-entry-pending-gallery.jpg"),
			});

			const textEntry = yield* transactionEntryCreateFx({
				userId: buyer.id,
				transactionId: transaction.id,
				kind: "text",
				payload: {
					text: "Still pending",
				},
			});
			const sellerTextInInterest = yield* transactionEntryCollectionFx({
				userId: seller.id,
				where: {
					transactionId: transaction.id,
					kind: "text",
				},
			});
			const sellerTextCountInInterest = yield* transactionEntryCountFx({
				userId: seller.id,
				where: {
					transactionId: transaction.id,
					kind: "text",
				},
			});
			const sellerTimelineInInterest = yield* transactionEntryCollectionFx({
				userId: seller.id,
				where: {
					transactionId: transaction.id,
				},
			});
			const sellerFetchInInterest = yield* Effect.either(
				transactionEntryFetchFx({
					userId: seller.id,
					where: {
						id: textEntry.id,
					},
				}),
			);
			const sellerActivities = yield* fetchActivityItemsFx({
				database,
				userId: seller.id,
				type: "buyer-message",
			});
			const sellerTextActivity = sellerActivities.find((item) => {
				return (
					"transactionEntryId" in item.payload &&
					item.payload.transactionEntryId === textEntry.id
				);
			});

			expect(textEntry.kind).toBe("text");
			expect(textEntry.direction).toBe("out");
			expect(sellerTextInInterest).toHaveLength(0);
			expect(sellerTextCountInInterest).toBe(0);
			expect(sellerTimelineInInterest.map((item) => item.kind)).toContain("status-interest");
			expect(sellerTimelineInInterest.map((item) => item.id)).not.toContain(textEntry.id);
			expectErrorFx(sellerFetchInInterest);
			expect(sellerTextActivity).toBeUndefined();

			const sellerTextResult = yield* Effect.either(
				transactionEntryCreateFx({
					userId: seller.id,
					transactionId: transaction.id,
					kind: "text",
					payload: {
						text: "Seller should not write in interest",
					},
				}),
			);
			const galleryResult = yield* Effect.either(
				transactionEntryCreateFx({
					userId: buyer.id,
					transactionId: transaction.id,
					kind: "gallery",
					payload: {
						uploadIds: [
							upload.id,
						],
					},
				}),
			);
			const locationResult = yield* Effect.either(
				transactionEntryCreateFx({
					userId: buyer.id,
					transactionId: transaction.id,
					kind: "location",
					payload: {
						locationId: "loc_pending_invalid",
					},
				}),
			);
			const personalResult = yield* Effect.either(
				transactionEntryCreateFx({
					userId: buyer.id,
					transactionId: transaction.id,
					kind: "personal",
					payload: {
						name: "Buyer",
						phone: "+420123456789",
						email: "buyer@test.cz",
					},
				}),
			);

			expectTaggedErrorFx(sellerTextResult, {
				tag: "InvalidRequestErrorFx",
			});
			expectTaggedErrorFx(galleryResult, {
				tag: "InvalidRequestErrorFx",
			});
			expectTaggedErrorFx(locationResult, {
				tag: "InvalidRequestErrorFx",
			});
			expectTaggedErrorFx(personalResult, {
				tag: "InvalidRequestErrorFx",
			});

			const transactionEntries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select("id")
					.where("transactionId", "=", transaction.id)
					.where("kind", "in", [
						"text",
						"gallery",
						"location",
						"personal",
					])
					.execute(),
			);

			expect(transactionEntries.map((item) => item.id)).toEqual([
				textEntry.id,
			]);

			yield* transactionAcceptFx({
				transactionId: transaction.id,
				userId: seller.id,
			});

			const sellerTextInTrade = yield* transactionEntryCollectionFx({
				userId: seller.id,
				where: {
					transactionId: transaction.id,
					kind: "text",
				},
			});
			const sellerTextCountInTrade = yield* transactionEntryCountFx({
				userId: seller.id,
				where: {
					transactionId: transaction.id,
					kind: "text",
				},
			});
			const sellerFetchInTrade = yield* transactionEntryFetchFx({
				userId: seller.id,
				where: {
					id: textEntry.id,
				},
			});

			expect(sellerTextInTrade.map((item) => item.id)).toEqual([
				textEntry.id,
			]);
			expect(sellerTextCountInTrade).toBe(1);
			expect(sellerFetchInTrade.id).toBe(textEntry.id);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
