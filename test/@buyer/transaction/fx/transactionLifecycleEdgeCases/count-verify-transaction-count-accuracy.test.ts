import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCountFx } from "~/buyer/transaction/server/fx/transactionCountFx";
import { transactionAcceptFx } from "~/seller/transaction/server/fx/transactionAcceptFx";
import { transactionResolveFx } from "~/seller/transaction/server/fx/transactionResolveFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("transactionLifecycleEdgeCases (buyer)", () => {
	it("count: verify transaction count accuracy", async () => {
		const database = await testabase("buyerCloseFx-count");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

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

			expect(countBefore).toBe(2);

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

			expect(countAfter).toBe(2);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
