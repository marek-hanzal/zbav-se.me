import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCollectionFx } from "~/seller-transaction/fx/transactionCollectionFx";
import { transactionFetchFx } from "~/seller-transaction/fx/transactionFetchFx";
import { expectTaggedErrorFn } from "~/test/common/fx/expectTaggedErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { getDefaultListingCreateFx } from "~/test/listing/fx/getDefaultListingCreateFx";
import { testabaseFn } from "~/test/testabaseFn";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("seller transaction read model foreign isolation", () => {
	it("keeps foreign seller transactions out", async () => {
		const database = await testabaseFn("sellerTransactionReadModelFx-foreign");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});
			const stranger = yield* leaseTestUserFx({});
			const listing = yield* getDefaultListingCreateFx;

			const ownScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
				listing,
			});
			const foreignScenario = yield* createPendingScenarioFx({
				sellerId: stranger.id,
				buyerId: buyer.id,
				listing,
			});

			const mixedIds = yield* transactionCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					idIn: [
						ownScenario.transactionId,
						foreignScenario.transactionId,
					],
				},
			});
			const foreignFetch = yield* Effect.result(
				transactionFetchFx({
					scope: {
						userId: seller.id,
					},
					where: {
						id: foreignScenario.transactionId,
					},
				}),
			);

			expect(mixedIds).toHaveLength(1);
			expect(mixedIds[0]?.id).toBe(ownScenario.transactionId);
			expectTaggedErrorFn(foreignFetch, {
				tag: "NotFoundErrorFx",
			});
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
