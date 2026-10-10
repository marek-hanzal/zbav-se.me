import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/seller-listing/fx/listingCollectionFx";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabaseFn } from "~/test/testabaseFn";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("listingCollectionFx (seller)", () => {
	it("fulltext filter matches listing by title", async () => {
		const database = await testabaseFn("sellerListing-fulltext");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});

			yield* createListingFx(seller.id, {
				title: "seller fulltext target listing",
			});

			const collection = yield* listingCollectionFx({
				userId: seller.id,
				scope: {
					userId: seller.id,
				},
				where: {
					fulltext: [
						"target listing",
					],
				},
			});

			expect(collection.length).toBeGreaterThanOrEqual(1);
			expect(collection.every((item) => item.title.toLowerCase().includes("target"))).toBe(
				true,
			);

			const empty = yield* listingCollectionFx({
				userId: seller.id,
				scope: {
					userId: seller.id,
				},
				where: {
					fulltext: [
						"xyzzy-nonexistent-title",
					],
				},
			});

			expect(empty).toHaveLength(0);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
