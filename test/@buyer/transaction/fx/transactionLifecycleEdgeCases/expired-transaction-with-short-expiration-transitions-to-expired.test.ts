import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCloseFx } from "~/buyer/transaction/server/fx/transactionCloseFx";
import { transactionAcceptFx } from "~/seller/transaction/server/fx/transactionAcceptFx";
import { transactionResolveFx } from "~/seller/transaction/server/fx/transactionResolveFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("transactionLifecycleEdgeCases (buyer)", () => {
	it("expired: transaction with short expiration transitions to expired", async () => {
		const database = await testabase("buyerCloseFx-expired");

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

			const { status } = yield* Effect.promise(async () => {
				return database.kysely
					.selectFrom("transaction")
					.select("status")
					.where("id", "=", tx.id)
					.executeTakeFirstOrThrow();
			});

			expect(status).toBe("resolved");

			yield* transactionCloseFx({
				transactionId: tx.id,
				userId: buyer.id,
			});

			const { status: statusAfterClose } = yield* Effect.promise(async () => {
				return database.kysely
					.selectFrom("transaction")
					.select("status")
					.where("id", "=", tx.id)
					.executeTakeFirstOrThrow();
			});

			expect(statusAfterClose).toBe("closed");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
