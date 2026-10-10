import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/seller-listing/fx/listingCollectionFx";
import { listingFetchFx } from "~/seller-listing/fx/listingFetchFx";
import { expectTaggedErrorFn } from "~/test/common/fx/expectTaggedErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { getDefaultListingCreateFx } from "~/test/listing/fx/getDefaultListingCreateFx";
import { testabaseFn } from "~/test/testabaseFn";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("seller listing transaction foreign isolation", () => {
	it("keeps foreign seller listings out", async () => {
		const database = await testabaseFn("seller-listing-transaction-foreign");

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

			const mixedIds = yield* listingCollectionFx({
				userId: seller.id,
				scope: {
					userId: seller.id,
				},
				where: {
					withTransaction: true,
					idIn: [
						ownScenario.listingId,
						foreignScenario.listingId,
					],
				},
			});
			const foreignFetch = yield* Effect.result(
				listingFetchFx({
					userId: seller.id,
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
			expectTaggedErrorFn(foreignFetch, {
				tag: "NotFoundErrorFx",
			});
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
