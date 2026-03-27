import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCountFx } from "~/client/@buyer/transaction/server/fx/transactionCountFx";
import { transactionAcceptFx } from "~/client/@seller/transaction/server/fx/transactionAcceptFx";
import { transactionResolveFx } from "~/client/@seller/transaction/server/fx/transactionResolveFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/utils/createPendingScenarioFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("transactionLifecycleEdgeCases (buyer)", () => {
	it("count: verify transaction count accuracy", async () => {
		const database = await testabase("buyerCloseFx-count");

		return Effect.gen(function* () {
			const { api } = auth(() => database.dialect);

			const { user: seller } = yield* Effect.promise(async () => {
				return api.signUpEmail({
					body: {
						email: "seller@count.cz",
						name: "Seller",
						password: "12345678",
					},
				});
			});
			const { user: buyer } = yield* Effect.promise(async () => {
				return api.signUpEmail({
					body: {
						email: "buyer@count.cz",
						name: "Buyer",
						password: "12345678",
					},
				});
			});

			const { listingId: listingId1 } = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const { listingId: listingId2 } = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const countBefore = yield* transactionCountFx({
				where: {
					userId: buyer.id,
				},
				scope: {
					userId: buyer.id,
				},
			});

			expect(countBefore.where).toBe(2);

			const tx1 = yield* Effect.promise(() => {
				return database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("listingId", "=", listingId1)
					.where("userId", "=", buyer.id)
					.executeTakeFirstOrThrow();
			});

			const tx2 = yield* Effect.promise(() => {
				return database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("listingId", "=", listingId2)
					.where("userId", "=", buyer.id)
					.executeTakeFirstOrThrow();
			});

			yield* transactionAcceptFx({
				transactionId: tx1.id,
				userId: seller.id,
			});

			yield* transactionAcceptFx({
				transactionId: tx2.id,
				userId: seller.id,
			});

			yield* transactionResolveFx({
				transactionId: tx1.id,
				userId: seller.id,
			});

			yield* transactionResolveFx({
				transactionId: tx2.id,
				userId: seller.id,
			});

			const countAfter = yield* transactionCountFx({
				where: {
					userId: buyer.id,
				},
				scope: {
					userId: buyer.id,
				},
			});

			expect(countAfter.where).toBe(2);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
