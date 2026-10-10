import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/buyer-listing/fx/listingCollectionFx";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createResolvedScenarioFx } from "~/test/transaction/fx/createResolvedScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("listingCollectionFx (buyer) — listing status visibility", () => {
	it("sold listing remains visible to buyer after filters were opened", async () => {
		const database = await testabaseFn("listingCollection-sold-hidden");
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
				userId: buyer.id,
				scope: {},
			});

			const ids = collection.map((l) => l.id);
			expect(ids).toContain(listingId);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
