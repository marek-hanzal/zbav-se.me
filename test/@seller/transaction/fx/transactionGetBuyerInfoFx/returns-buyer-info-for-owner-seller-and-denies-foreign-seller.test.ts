import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionGetBuyerInfoFx } from "~/seller/transaction/server/fx/transactionGetBuyerInfoFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/utils/createPendingScenarioFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("transactionGetBuyerInfoFx", () => {
	it("returns buyer info for the owning seller and denies a foreign seller", async () => {
		const database = await testabase("transactionGetBuyerInfoFx-access");
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
				"transaction-buyer-info-seller@test.cz",
				"Transaction Buyer Info Seller",
			);
			const { user: buyer } = yield* signUp(
				"transaction-buyer-info-buyer@test.cz",
				"Transaction Buyer Info Buyer",
			);
			const { user: strangerSeller } = yield* signUp(
				"transaction-buyer-info-stranger@test.cz",
				"Transaction Buyer Info Stranger",
			);

			const { listingId } = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const transaction = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("listingId", "=", listingId)
					.where("userId", "=", buyer.id)
					.executeTakeFirstOrThrow(),
			);

			const buyerInfo = yield* transactionGetBuyerInfoFx({
				userId: seller.id,
				transactionId: transaction.id,
			});

			expect(buyerInfo.registered).toBeInstanceOf(Date);

			const denied = yield* Effect.either(
				transactionGetBuyerInfoFx({
					userId: strangerSeller.id,
					transactionId: transaction.id,
				}),
			);

			expect(denied._tag).toBe("Left");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
