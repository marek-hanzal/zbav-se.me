import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCreateFx } from "~/buyer/transaction/server/fx/transactionCreateFx";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("transactionCreateFx", () => {
	it("rejects transaction creation for listings above buyer restriction", async () => {
		const database = await testabase("transactionCreateFx-restricted-listing");

		return Effect.gen(function* () {
			const { seller, buyer } = yield* createUsersFx({});
			const listing = yield* createListingFx(seller.id, {
				title: "Transaction Create Restricted Listing",
				restriction: "adult",
			});

			const result = yield* Effect.either(
				transactionCreateFx({
					userId: buyer.id,
					listingId: listing.id,
				}),
			);
			const transactions = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("listingId", "=", listing.id)
					.execute(),
			);

			expectTaggedErrorFx(result, {
				tag: "NotFoundErrorFx",
			});
			expect(transactions).toHaveLength(0);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
