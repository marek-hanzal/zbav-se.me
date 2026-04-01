import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionAcceptFx } from "~/seller/transaction/server/fx/transactionAcceptFx";
import { transactionRejectFx } from "~/seller/transaction/server/fx/transactionRejectFx";
import { transactionResolveFx } from "~/seller/transaction/server/fx/transactionResolveFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createResolvedScenarioFx } from "~/test/utils/createResolvedScenarioFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";
import { transactionSuccessFx } from "~/buyer/transaction/server/fx/transactionSuccessFx";

describe("seller transaction invalid transitions", () => {
	it("rejects seller actions once the transaction is terminal", async () => {
		const database = await testabase("sellerTransactionFx-invalid-terminal-actions");
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
				"seller-terminal-invalid@test.cz",
				"Seller Terminal Invalid",
			);
			const { user: buyer } = yield* signUp(
				"buyer-terminal-invalid@test.cz",
				"Buyer Terminal Invalid",
			);

			const { transactionId } = yield* createResolvedScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
				database,
			});

			yield* transactionSuccessFx({
				transactionId,
				userId: buyer.id,
			});

			const acceptResult = yield* Effect.either(
				transactionAcceptFx({
					transactionId,
					userId: seller.id,
				}),
			);
			const rejectResult = yield* Effect.either(
				transactionRejectFx({
					transactionId,
					userId: seller.id,
				}),
			);
			const resolveResult = yield* Effect.either(
				transactionResolveFx({
					transactionId,
					userId: seller.id,
				}),
			);

			expect(acceptResult._tag).toBe("Left");
			expect(rejectResult._tag).toBe("Left");
			expect(resolveResult._tag).toBe("Left");

			const transaction = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("status")
					.where("id", "=", transactionId)
					.executeTakeFirstOrThrow(),
			);

			expect(transaction.status).toBe("success");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
