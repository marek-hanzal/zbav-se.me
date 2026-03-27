import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCloseFx } from "~/@buyer/transaction/server/fx/transactionCloseFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createResolvedScenarioFx } from "~/test/utils/createResolvedScenarioFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("transactionCloseFx (buyer)", () => {
	it("invalid: cannot close an already-closed transaction", async () => {
		const database = await testabase("buyerCloseFx-double-close");

		return Effect.gen(function* () {
			const { api } = auth(() => database.dialect);

			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "seller@buyer-double-close.cz",
						name: "Seller",
						password: "12345678",
					},
				}),
			);
			const { user: buyer } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "buyer@buyer-double-close.cz",
						name: "Buyer",
						password: "12345678",
					},
				}),
			);

			const { transactionId } = yield* createResolvedScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
				database,
			});

			yield* transactionCloseFx({
				transactionId,
				userId: buyer.id,
			});

			const result = yield* Effect.either(
				transactionCloseFx({
					transactionId,
					userId: buyer.id,
				}),
			);

			expect(result._tag).toBe("Left");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
