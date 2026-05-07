import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/seller/listing/server/fx/listingCollectionFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("listingCollectionFx (seller)", () => {
	it("fulltext filter matches listing by title", async () => {
		const database = await testabase("sellerListing-fulltext");

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
					fulltext: "target listing",
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
					fulltext: "xyzzy-nonexistent-title",
				},
			});

			expect(empty).toHaveLength(0);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
