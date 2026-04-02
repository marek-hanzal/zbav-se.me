import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createOpenScenarioFx } from "~/test/transaction/fx/createOpenScenarioFx";
import { createDbUserFx } from "~/test/user/fx/createDbUserFx";
import { transactionEntryCollectionFx } from "~/user/transaction-entry/server/fx/transactionEntryCollectionFx";
import { transactionEntryCountFx } from "~/user/transaction-entry/server/fx/transactionEntryCountFx";
import { transactionEntryCreateFx } from "~/user/transaction-entry/server/fx/transactionEntryCreateFx";
import { transactionEntryFetchFx } from "~/user/transaction-entry/server/fx/transactionEntryFetchFx";

describe("transactionEntry read model", () => {
	it("filters entries by kind, actor and ids for participants", async () => {
		const database = await testabase("transactionEntryReadModelFx-filters");

		return Effect.gen(function* () {
			const seller = yield* createDbUserFx({
				email: "transaction-entry-read-seller@test.cz",
				name: "Transaction Entry Read Seller",
			});
			const buyer = yield* createDbUserFx({
				email: "transaction-entry-read-buyer@test.cz",
				name: "Transaction Entry Read Buyer",
			});

			const { transactionId } = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const buyerText = yield* transactionEntryCreateFx({
				userId: buyer.id,
				transactionId,
				kind: "text",
				payload: {
					text: "Buyer text",
				},
			});
			const sellerText = yield* transactionEntryCreateFx({
				userId: seller.id,
				transactionId,
				kind: "text",
				payload: {
					text: "Seller text",
				},
			});
			const sellerLocation = yield* transactionEntryCreateFx({
				userId: seller.id,
				transactionId,
				kind: "location",
				payload: {
					locationId: "loc_transaction_entry_read",
				},
			});

			const byKind = yield* transactionEntryCollectionFx({
				userId: seller.id,
				where: {
					transactionId,
					kind: "text",
				},
				sort: [
					{
						field: "createdAt",
						order: "asc",
					},
				],
			});
			const byKindIn = yield* transactionEntryCollectionFx({
				userId: seller.id,
				where: {
					transactionId,
					kindIn: [
						"text",
						"location",
					],
				},
			});
			const byActor = yield* transactionEntryCollectionFx({
				userId: buyer.id,
				where: {
					transactionId,
					userId: seller.id,
				},
			});
			const idSubset = yield* transactionEntryCollectionFx({
				userId: buyer.id,
				where: {
					idIn: [
						sellerLocation.id,
						"foreign-entry-id",
					],
				},
			});
			const textCount = yield* transactionEntryCountFx({
				userId: seller.id,
				where: {
					transactionId,
					kind: "text",
				},
			});
			const fetched = yield* transactionEntryFetchFx({
				userId: buyer.id,
				where: {
					id: sellerLocation.id,
				},
			});

			expect(byKind.map((item) => item.id)).toEqual([
				buyerText.id,
				sellerText.id,
			]);
			expect(byKindIn.map((item) => item.id).sort()).toEqual(
				[
					buyerText.id,
					sellerLocation.id,
					sellerText.id,
				].sort(),
			);
			const actorIds = byActor.map((item) => item.id);
			expect(actorIds).toContain(sellerText.id);
			expect(actorIds).toContain(sellerLocation.id);
			expect(actorIds).not.toContain(buyerText.id);
			expect(idSubset.map((item) => item.id)).toEqual([
				sellerLocation.id,
			]);
			expect(textCount.where).toBe(2);
			expect(fetched.id).toBe(sellerLocation.id);
			expect(fetched.kind).toBe("location");
			expect(fetched.direction).toBe("in");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});

	it("isolates foreign viewers from transaction entries", async () => {
		const database = await testabase("transactionEntryReadModelFx-foreign");

		return Effect.gen(function* () {
			const seller = yield* createDbUserFx({
				email: "transaction-entry-foreign-seller@test.cz",
				name: "Transaction Entry Foreign Seller",
			});
			const buyer = yield* createDbUserFx({
				email: "transaction-entry-foreign-buyer@test.cz",
				name: "Transaction Entry Foreign Buyer",
			});
			const outsider = yield* createDbUserFx({
				email: "transaction-entry-read-outsider@test.cz",
				name: "Transaction Entry Read Outsider",
			});

			const { transactionId } = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const sellerLocation = yield* transactionEntryCreateFx({
				userId: seller.id,
				transactionId,
				kind: "location",
				payload: {
					locationId: "loc_transaction_entry_read",
				},
			});

			const outsiderFetch = yield* Effect.either(
				transactionEntryFetchFx({
					userId: outsider.id,
					where: {
						id: sellerLocation.id,
					},
				}),
			);
			const outsiderCollection = yield* transactionEntryCollectionFx({
				userId: outsider.id,
				where: {
					transactionId,
					kindIn: [
						"text",
						"location",
					],
				},
			});
			const outsiderCount = yield* transactionEntryCountFx({
				userId: outsider.id,
				where: {
					transactionId,
				},
			});

			expect(outsiderFetch._tag).toBe("Left");
			expect(outsiderCollection).toHaveLength(0);
			expect(outsiderCount.where).toBe(0);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
