import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCollectionFx } from "~/buyer/transaction/server/fx/transactionCollectionFx";
import { transactionAcceptFx } from "~/seller/transaction/server/fx/transactionAcceptFx";
import { transactionResolveFx } from "~/seller/transaction/server/fx/transactionResolveFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("transactionLifecycleEdgeCases (buyer)", () => {
	it("fetch: verify transaction fetch with filters returns correct data", async () => {
		const database = await testabase("buyerCloseFx-fetch-filter");

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

			const result = yield* transactionCollectionFx({
				where: {
					userId: buyer.id,
				},
				scope: {
					userId: buyer.id,
				},
			});

			expect(result).toHaveLength(2);
			// expect(typeof result[0]?.unreadCount).toBe("number");
			const transactionIds = result.map((t) => t.id);
			expect(transactionIds).toContain(tx1.id);
			expect(transactionIds).toContain(tx2.id);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
