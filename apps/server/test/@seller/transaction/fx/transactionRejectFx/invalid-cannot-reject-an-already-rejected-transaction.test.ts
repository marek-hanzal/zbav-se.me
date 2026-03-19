import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionRejectFx } from "~/@seller/transaction/fx/transactionRejectFx";
import { auth } from "~/auth/auth";
import { createPendingScenarioFx, withRuntimeFx } from "~test/fixture/transactionFixture";
import { testabase } from "~test/testabase";

describe("transactionRejectFx (seller)", () => {
	it("invalid: cannot reject an already-rejected transaction", async () => {
		const database = await testabase("sellerRejectFx-double-reject");

		return Effect.gen(function* () {
			const { api } = auth(() => database.dialect);

			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "seller@seller-double-reject.cz",
						name: "Seller",
						password: "12345678",
					},
				}),
			);
			const { user: buyer } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "buyer@seller-double-reject.cz",
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

			yield* transactionRejectFx({
				transactionId: tx.id,
				userId: seller.id,
			});

			const result = yield* Effect.either(
				transactionRejectFx({
					transactionId: tx.id,
					userId: seller.id,
				}),
			);

			expect(result._tag).toBe("Left");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
