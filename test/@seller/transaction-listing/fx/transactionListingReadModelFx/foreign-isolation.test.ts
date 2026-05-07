import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionListingCollectionFx } from "~/seller/transaction-listing/server/fx/transactionListingCollectionFx";
import { transactionListingFetchFx } from "~/seller/transaction-listing/server/fx/transactionListingFetchFx";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { getDefaultListingCreateFx } from "~/test/listing/fx/getDefaultListingCreateFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("seller transaction-listing read model foreign isolation", () => {
	it("keeps foreign seller listings out", async () => {
		const database = await testabase("sellerTransactionListingReadModelFx-foreign");

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

			const mixedIds = yield* transactionListingCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					idIn: [
						ownScenario.listingId,
						foreignScenario.listingId,
					],
				},
			});
			const foreignFetch = yield* Effect.either(
				transactionListingFetchFx({
					scope: {
						userId: seller.id,
					},
					where: {
						id: foreignScenario.listingId,
					},
				}),
			);

			expect(mixedIds).toHaveLength(1);
			expect(mixedIds[0]?.id).toBe(ownScenario.listingId);
			expectTaggedErrorFx(foreignFetch, {
				tag: "NotFoundErrorFx",
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
