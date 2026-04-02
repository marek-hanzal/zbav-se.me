import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionSuccessFx } from "~/buyer/transaction/server/fx/transactionSuccessFx";
import { transactionAcceptFx } from "~/seller/transaction/server/fx/transactionAcceptFx";
import { transactionRejectFx } from "~/seller/transaction/server/fx/transactionRejectFx";
import { transactionResolveFx } from "~/seller/transaction/server/fx/transactionResolveFx";
import { auth } from "~/server/auth/auth";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createResolvedScenarioFx } from "~/test/transaction/fx/createResolvedScenarioFx";

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
			const beforeEntries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select((eb) => eb.fn.countAll<number>().as("count"))
					.where("transactionId", "=", transactionId)
					.executeTakeFirstOrThrow(),
			);

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

			expectTaggedErrorFx(acceptResult, {
				tag: "InvalidRequestErrorFx",
				message: "Invalid transaction status transition from success to open for seller",
			});
			expectTaggedErrorFx(rejectResult, {
				tag: "InvalidRequestErrorFx",
				message:
					"Invalid transaction status transition from success to rejected for seller",
			});
			expectTaggedErrorFx(resolveResult, {
				tag: "InvalidRequestErrorFx",
				message:
					"Invalid transaction status transition from success to resolved for seller",
			});

			const transaction = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("status")
					.where("id", "=", transactionId)
					.executeTakeFirstOrThrow(),
			);
			const afterEntries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select((eb) => eb.fn.countAll<number>().as("count"))
					.where("transactionId", "=", transactionId)
					.executeTakeFirstOrThrow(),
			);

			expect(transaction.status).toBe("success");
			expect(afterEntries.count).toBe(beforeEntries.count);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
