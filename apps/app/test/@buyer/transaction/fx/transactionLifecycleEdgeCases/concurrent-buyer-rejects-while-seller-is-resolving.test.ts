import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionRejectFx } from "~/client/@buyer/transaction/server/fx/transactionRejectFx";
import { transactionAcceptFx } from "~/client/@seller/transaction/server/fx/transactionAcceptFx";
import { transactionResolveFx } from "~/client/@seller/transaction/server/fx/transactionResolveFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/utils/createPendingScenarioFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("transactionLifecycleEdgeCases (buyer)", () => {
	it("concurrent: buyer rejects while seller is resolving", async () => {
		const database = await testabase("buyerCloseFx-concurrent");

		return Effect.gen(function* () {
			const { api } = auth(() => database.dialect);

			const { user: seller } = yield* Effect.promise(async () => {
				return api.signUpEmail({
					body: {
						email: "seller@concurrent.cz",
						name: "Seller",
						password: "12345678",
					},
				});
			});
			const { user: buyer } = yield* Effect.promise(async () => {
				return api.signUpEmail({
					body: {
						email: "buyer@concurrent.cz",
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

			const result = yield* Effect.either(
				transactionRejectFx({
					transactionId: tx.id,
					userId: buyer.id,
				}),
			);

			expect(result._tag).toBe("Left");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
