import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionGetBuyerInfoFx } from "~/seller-transaction/fx/transactionGetBuyerInfoFx";
import { expectTaggedErrorFn } from "~/test/common/fx/expectTaggedErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("transactionGetBuyerInfoFx", () => {
	it("returns buyer info for the owning seller and denies a foreign seller", async () => {
		const database = await testabaseFn("transactionGetBuyerInfoFx-access");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});
			const strangerSeller = yield* leaseTestUserFx({});

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

			const denied = yield* Effect.result(
				transactionGetBuyerInfoFx({
					userId: strangerSeller.id,
					transactionId: transaction.id,
				}),
			);

			expectTaggedErrorFn(denied, {
				tag: "NotFoundErrorFx",
			});
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
