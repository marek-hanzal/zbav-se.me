import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCollectionFx } from "~/buyer/transaction/server/fx/transactionCollectionFx";
import { transactionFetchFx } from "~/buyer/transaction/server/fx/transactionFetchFx";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { getDefaultListingCreateFx } from "~/test/listing/fx/getDefaultListingCreateFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("buyer transaction read model foreign isolation", () => {
	it("keeps foreign buyer transactions out", async () => {
		const database = await testabase("buyerTransactionReadModelFx-foreign");

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
				sellerId: seller.id,
				buyerId: stranger.id,
				listing,
			});

			const mixedIds = yield* transactionCollectionFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					idIn: [
						ownScenario.transactionId,
						foreignScenario.transactionId,
					],
				},
			});
			const foreignFetch = yield* Effect.either(
				transactionFetchFx({
					scope: {
						userId: buyer.id,
					},
					where: {
						id: foreignScenario.transactionId,
					},
				}),
			);

			expect(mixedIds).toHaveLength(1);
			expect(mixedIds[0]?.id).toBe(ownScenario.transactionId);
			expectTaggedErrorFx(foreignFetch, {
				tag: "NotFoundErrorFx",
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
