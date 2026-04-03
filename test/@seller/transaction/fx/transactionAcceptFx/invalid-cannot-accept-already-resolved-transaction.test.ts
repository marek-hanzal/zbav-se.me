import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionAcceptFx } from "~/seller/transaction/server/fx/transactionAcceptFx";
import { auth } from "~/server/auth/auth";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createResolvedScenarioFx } from "~/test/transaction/fx/createResolvedScenarioFx";

describe("transactionAcceptFx", () => {
	it("invalid: cannot accept an already resolved transaction", async () => {
		const database = await testabase("transactionAcceptFx-invalid-resolved");
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
				"seller-accept-invalid-resolved@test.cz",
				"Seller Accept Invalid Resolved",
			);
			const { user: buyer } = yield* signUp(
				"buyer-accept-invalid-resolved@test.cz",
				"Buyer Accept Invalid Resolved",
			);

			const { transactionId } = yield* createResolvedScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const result = yield* Effect.either(
				transactionAcceptFx({
					transactionId,
					userId: seller.id,
				}),
			);

			expectTaggedErrorFx(result, {
				tag: "InvalidRequestErrorFx",
				message: "Invalid transaction status transition from resolved to open for seller",
			});

			const transaction = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("status")
					.where("id", "=", transactionId)
					.executeTakeFirstOrThrow(),
			);
			const entries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select("kind")
					.where("transactionId", "=", transactionId)
					.orderBy("createdAt", "asc")
					.execute(),
			);

			expect(transaction.status).toBe("resolved");
			expect(entries.at(-1)?.kind).toBe("status-resolved");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
