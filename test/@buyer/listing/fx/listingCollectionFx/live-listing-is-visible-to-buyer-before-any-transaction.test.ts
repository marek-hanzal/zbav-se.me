import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/buyer-listing/fx/listingCollectionFx";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabaseFn } from "~/test/testabaseFn";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("listingCollectionFx (buyer) — listing status visibility", () => {
	it("live listing is visible to buyer before any transaction", async () => {
		const database = await testabaseFn("listingCollection-live-visible");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({
				key: "a",
			});
			const buyer = yield* leaseTestUserFx({
				key: "b",
			});

			const listing = yield* createListingFx(seller.id);

			const collection = yield* listingCollectionFx({
				userId: buyer.id,
				scope: {},
			});

			const ids = collection.map((l) => l.id);
			expect(ids).toContain(listing.id);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
