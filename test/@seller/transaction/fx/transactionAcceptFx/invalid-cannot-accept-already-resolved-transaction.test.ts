import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionAcceptFx } from "~/seller/transaction/server/fx/transactionAcceptFx";
import { auth } from "~/server/auth/auth";
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
				database,
			});

			const result = yield* Effect.either(
				transactionAcceptFx({
					transactionId,
					userId: seller.id,
				}),
			);

			expect(result._tag).toBe("Left");

			const transaction = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("status")
					.where("id", "=", transactionId)
					.executeTakeFirstOrThrow(),
			);

			expect(transaction.status).toBe("resolved");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
