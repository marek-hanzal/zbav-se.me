import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionDisputeFx } from "~/buyer-transaction/fx/transactionDisputeFx";
import { transactionAcceptFx } from "~/seller-transaction/fx/transactionAcceptFx";
import { transactionResolveFx } from "~/seller-transaction/fx/transactionResolveFx";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("transactionLifecycleEdgeCases (buyer)", () => {
	it("dispute: buyer initiates dispute and seller resolves in buyer's favor", async () => {
		const database = await testabaseFn("buyerCloseFx-dispute");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

			const { listingId } = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const tx = yield* Effect.promise(() => {
				return database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("listingId", "=", listingId)
					.where("userId", "=", buyer.id)
					.executeTakeFirstOrThrow();
			});

			yield* transactionAcceptFx({
				transactionId: tx.id,
				userId: seller.id,
			});

			yield* transactionResolveFx({
				transactionId: tx.id,
				userId: seller.id,
			});

			yield* transactionDisputeFx({
				transactionId: tx.id,
				userId: buyer.id,
			});

			const { status: statusAfterDispute } = yield* Effect.promise(async () => {
				return database.kysely
					.selectFrom("transaction")
					.select("status")
					.where("id", "=", tx.id)
					.executeTakeFirstOrThrow();
			});

			expect(statusAfterDispute).toBe("dispute");

			yield* transactionResolveFx({
				transactionId: tx.id,
				userId: seller.id,
			});

			const { status: statusAfterResolve } = yield* Effect.promise(async () => {
				return database.kysely
					.selectFrom("transaction")
					.select("status")
					.where("id", "=", tx.id)
					.executeTakeFirstOrThrow();
			});

			expect(statusAfterResolve).toBe("resolved");
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
