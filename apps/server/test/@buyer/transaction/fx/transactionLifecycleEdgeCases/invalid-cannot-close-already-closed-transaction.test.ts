import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCloseFx } from "~/@buyer/transaction/fx/transactionCloseFx";
import { auth } from "~/auth/auth";
import { createResolvedScenarioFx, withRuntimeFx } from "~test/fixture/transactionFixture";
import { testabase } from "~test/testabase";

describe("transactionLifecycleEdgeCases (buyer)", () => {
	it("invalid: cannot close already-closed transaction", async () => {
		const database = await testabase("buyerCloseFx-double-close-edge");

		return Effect.gen(function* () {
			const { api } = auth(() => database.dialect);

			const { user: seller } = yield* Effect.promise(async () => {
				return api.signUpEmail({
					body: {
						email: "seller@double-close.cz",
						name: "Seller",
						password: "12345678",
					},
				});
			});
			const { user: buyer } = yield* Effect.promise(async () => {
				return api.signUpEmail({
					body: {
						email: "buyer@double-close.cz",
						name: "Buyer",
						password: "12345678",
					},
				});
			});

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
