import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createOpenScenarioFx } from "~/test/utils/createOpenScenarioFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";
import { transactionEntryCollectionFx } from "~/user/transaction-entry/server/fx/transactionEntryCollectionFx";
import { transactionEntryCountFx } from "~/user/transaction-entry/server/fx/transactionEntryCountFx";
import { transactionEntryCreateFx } from "~/user/transaction-entry/server/fx/transactionEntryCreateFx";
import { transactionEntryFetchFx } from "~/user/transaction-entry/server/fx/transactionEntryFetchFx";

describe("transactionEntry read model", () => {
	it("filters entries by kind, actor and ids while isolating foreign viewers", async () => {
		const database = await testabase("transactionEntryReadModelFx-filters");
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
				"transaction-entry-read-seller@test.cz",
				"Transaction Entry Read Seller",
			);
			const { user: buyer } = yield* signUp(
				"transaction-entry-read-buyer@test.cz",
				"Transaction Entry Read Buyer",
			);
			const { user: outsider } = yield* signUp(
				"transaction-entry-read-outsider@test.cz",
				"Transaction Entry Read Outsider",
			);

			const { transactionId } = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
				database,
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
			expect(outsiderFetch._tag).toBe("Left");
			expect(outsiderCollection).toHaveLength(0);
			expect(outsiderCount.where).toBe(0);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
