import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionDisputeFx } from "~/client/@buyer/transaction/server/fx/transactionDisputeFx";
import { transactionAcceptFx } from "~/client/@seller/transaction/server/fx/transactionAcceptFx";
import { transactionResolveFx } from "~/client/@seller/transaction/server/fx/transactionResolveFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/utils/createPendingScenarioFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("transactionLifecycleEdgeCases (buyer)", () => {
	it("dispute: buyer initiates dispute and seller resolves in buyer's favor", async () => {
		const database = await testabase("buyerCloseFx-dispute");

		return Effect.gen(function* () {
			const { api } = auth(() => database.dialect);

			const { user: seller } = yield* Effect.promise(async () => {
				return api.signUpEmail({
					body: {
						email: "seller@dispute.cz",
						name: "Seller",
						password: "12345678",
					},
				});
			});
			const { user: buyer } = yield* Effect.promise(async () => {
				return api.signUpEmail({
					body: {
						email: "buyer@dispute.cz",
						name: "Buyer",
						password: "12345678",
					},
				});
			});

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
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
