import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/seller/listing/server/fx/listingCollectionFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("listingCollectionFx (seller)", () => {
	it("seller does not see other sellers' listings", async () => {
		const database = await testabase("sellerListing-isolation");

		return Effect.gen(function* () {
			const seller1 = yield* leaseTestUserFx({});
			const seller2 = yield* leaseTestUserFx({});

			const listing1 = yield* createListingFx(seller1.id);
			const listing2 = yield* createListingFx(seller2.id);

			const collection = yield* listingCollectionFx({
				userId: seller1.id,
				scope: {
					userId: seller1.id,
				},
			});

			const ids = collection.map((l) => l.id);
			expect(ids).toContain(listing1.id);
			expect(ids).not.toContain(listing2.id);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
