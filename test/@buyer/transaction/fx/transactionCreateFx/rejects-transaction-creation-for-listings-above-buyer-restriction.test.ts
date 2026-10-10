import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCreateFx } from "~/buyer-transaction/fx/transactionCreateFx";
import { expectTaggedErrorFn } from "~/test/common/fx/expectTaggedErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabaseFn } from "~/test/testabaseFn";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("transactionCreateFx", () => {
	it("rejects transaction creation for listings above buyer restriction", async () => {
		const database = await testabaseFn("transactionCreateFx-restricted-listing");

		return Effect.gen(function* () {
			const { seller, buyer } = yield* createUsersFx({});
			const listing = yield* createListingFx(seller.id, {
				title: "Transaction Create Restricted Listing",
				restriction: "adult",
			});

			const result = yield* Effect.result(
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

			expectTaggedErrorFn(result, {
				tag: "NotFoundErrorFx",
			});
			expect(transactions).toHaveLength(0);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
