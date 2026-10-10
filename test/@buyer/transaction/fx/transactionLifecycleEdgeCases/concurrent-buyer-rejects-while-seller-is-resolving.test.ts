import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionRejectFx } from "~/buyer-transaction/fx/transactionRejectFx";
import { transactionAcceptFx } from "~/seller-transaction/fx/transactionAcceptFx";
import { transactionResolveFx } from "~/seller-transaction/fx/transactionResolveFx";
import { expectTaggedErrorFn } from "~/test/common/fx/expectTaggedErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("transactionLifecycleEdgeCases (buyer)", () => {
	it("concurrent: buyer rejects while seller is resolving", async () => {
		const database = await testabaseFn("buyerCloseFx-concurrent");

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

			const result = yield* Effect.result(
				transactionRejectFx({
					transactionId: tx.id,
					userId: buyer.id,
				}),
			);

			expectTaggedErrorFn(result, {
				tag: "InvalidRequestErrorFx",
			});

			const storedTransaction = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select([
						"id",
						"status",
					])
					.where("id", "=", tx.id)
					.executeTakeFirstOrThrow(),
			);

			expect(storedTransaction.status).toBe("resolved");
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
