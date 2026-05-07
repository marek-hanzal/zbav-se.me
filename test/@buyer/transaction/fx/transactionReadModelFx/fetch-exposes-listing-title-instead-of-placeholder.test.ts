import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCreateFx } from "~/buyer/transaction/server/fx/transactionCreateFx";
import { transactionFetchFx } from "~/buyer/transaction/server/fx/transactionFetchFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("buyer transaction read model title", () => {
	it("returns the listing title instead of a placeholder string", async () => {
		const database = await testabase("buyer-transaction-read-model-title");

		return Effect.gen(function* () {
			const { seller, buyer } = yield* createUsersFx({});
			const listing = yield* createListingFx(seller.id, {
				title: "Buyer transaction title fixture",
			});
			const transaction = yield* transactionCreateFx({
				userId: buyer.id,
				listingId: listing.id,
			});

			const fetched = yield* transactionFetchFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					id: transaction.id,
				},
			});

			expect(fetched.title).toBe("Buyer transaction title fixture");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
