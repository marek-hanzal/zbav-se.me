import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionListingCollectionFx } from "~/seller/transaction-listing/server/fx/transactionListingCollectionFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("transactionListingCollectionFx (seller dashboard)", () => {
	it("listing without any transaction does not appear in the collection", async () => {
		const database = await testabase("txListing-no-tx");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});

			const listing = yield* createListingFx(seller.id);

			const collection = yield* transactionListingCollectionFx({
				scope: {
					userId: seller.id,
				},
			});

			const ids = collection.map((l) => l.id);
			expect(ids).not.toContain(listing.id);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
