import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/seller-listing/fx/listingCollectionFx";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createResolvedScenarioFx } from "~/test/transaction/fx/createResolvedScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("listingCollectionFx (seller)", () => {
	it("seller sees their sold listing (unlike buyer who only sees live)", async () => {
		const database = await testabaseFn("sellerListing-sold-visible");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

			const { listingId } = yield* createResolvedScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const { status } = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("listing")
					.select("status")
					.where("id", "=", listingId)
					.executeTakeFirstOrThrow(),
			);

			expect(status).toBe("sold");

			const collection = yield* listingCollectionFx({
				userId: seller.id,
				scope: {
					userId: seller.id,
				},
			});

			expect(collection.map((l) => l.id)).toContain(listingId);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
