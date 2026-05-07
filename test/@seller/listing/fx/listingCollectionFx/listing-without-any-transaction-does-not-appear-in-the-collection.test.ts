import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/seller/listing/server/fx/listingCollectionFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("listingCollectionFx (seller dashboard transactions)", () => {
	it("listing without any transaction does not appear in the filtered collection", async () => {
		const database = await testabase("listing-no-transaction");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});

			const listing = yield* createListingFx(seller.id);

			const collection = yield* listingCollectionFx({
				userId: seller.id,
				scope: {
					userId: seller.id,
				},
				where: {
					withTransaction: true,
				},
			});

			const ids = collection.map((item) => item.id);
			expect(ids).not.toContain(listing.id);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
