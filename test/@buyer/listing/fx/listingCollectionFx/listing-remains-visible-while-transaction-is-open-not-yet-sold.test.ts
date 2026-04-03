import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/buyer/listing/server/fx/listingCollectionFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createOpenScenarioFx } from "~/test/transaction/fx/createOpenScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("listingCollectionFx (buyer) — listing status visibility", () => {
	it("listing remains visible while transaction is open (not yet sold)", async () => {
		const database = await testabase("listingCollection-open-still-live");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

			// Accept transaction → listing is still "live"
			const { listingId } = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const { status } = yield* Effect.promise(async () => {
				return database.kysely
					.selectFrom("listing")
					.select("status")
					.where("id", "=", listingId)
					.executeTakeFirstOrThrow();
			});

			expect(status).toBe("live");

			const collection = yield* listingCollectionFx({
				userId: buyer.id,
				scope: {},
			});

			const ids = collection.map((l) => l.id);
			expect(ids).toContain(listingId);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
