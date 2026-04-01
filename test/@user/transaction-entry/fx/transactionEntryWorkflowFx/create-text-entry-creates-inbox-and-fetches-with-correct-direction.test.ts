import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createOpenScenarioFx } from "~/test/utils/createOpenScenarioFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";
import { transactionEntryCollectionFx } from "~/user/transaction-entry/server/fx/transactionEntryCollectionFx";
import { transactionEntryCreateFx } from "~/user/transaction-entry/server/fx/transactionEntryCreateFx";
import { transactionEntryFetchFx } from "~/user/transaction-entry/server/fx/transactionEntryFetchFx";

describe("transactionEntry workflow", () => {
	it("creates text entry, notifies counterparty and maps direction per viewer", async () => {
		const database = await testabase("transactionEntry-text-workflow");
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
				"transaction-entry-text-seller@test.cz",
				"Transaction Entry Seller",
			);
			const { user: buyer } = yield* signUp(
				"transaction-entry-text-buyer@test.cz",
				"Transaction Entry Buyer",
			);

			const { transactionId, listingId } = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
				database,
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

			const inboxItems = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("inbox")
					.select([
						"type",
						"reference",
						"payload",
					])
					.where("userId", "=", seller.id)
					.where("type", "=", "buyer-message")
					.execute(),
			);

			const matchingInbox = inboxItems.find(
				(item) =>
					Array.isArray(item.reference) &&
					item.reference[0] === listingId &&
					item.reference[1] === transactionId &&
					"transactionEntryId" in item.payload &&
					item.payload.transactionEntryId === entry.id,
			);

			expect(matchingInbox?.type).toBe("buyer-message");
			expect(matchingInbox?.reference).toEqual([
				listingId,
				transactionId,
			]);
			expect(matchingInbox?.payload).toMatchObject({
				transactionId,
				transactionEntryId: entry.id,
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
