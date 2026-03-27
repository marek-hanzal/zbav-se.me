import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionAcceptFx } from "~/client/@seller/transaction/server/fx/transactionAcceptFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/utils/createPendingScenarioFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("transactionAcceptFx", () => {
	it("invalid: buyer cannot accept their own transaction", async () => {
		const database = await testabase("transactionAcceptFx-buyer-cannot-accept");

		return Effect.gen(function* () {
			const { api } = auth(() => database.dialect);

			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "seller@accept-invalid.cz",
						name: "Seller",
						password: "12345678",
					},
				}),
			);
			const { user: buyer } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "buyer@accept-invalid.cz",
						name: "Buyer",
						password: "12345678",
					},
				}),
			);

			yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const tx = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("userId", "=", buyer.id)
					.executeTakeFirstOrThrow(),
			);

			const result = yield* Effect.either(
				transactionAcceptFx({
					transactionId: tx.id,
					userId: buyer.id,
				}),
			);

			expect(result._tag).toBe("Left");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
