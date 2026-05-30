import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/buyer/listing/server/fx/listingCollectionFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createResolvedScenarioFx } from "~/test/transaction/fx/createResolvedScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("listingCollectionFx (buyer) — listing status visibility", () => {
	it("sold listing remains visible to buyer after filters were opened", async () => {
		const database = await testabase("listingCollection-sold-hidden");
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
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
