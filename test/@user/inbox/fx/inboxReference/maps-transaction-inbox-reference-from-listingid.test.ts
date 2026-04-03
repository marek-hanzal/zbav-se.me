import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCreateFx } from "~/buyer/transaction/server/fx/transactionCreateFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { createDbUserFx } from "~/test/user/fx/createDbUserFx";

describe("inbox reference", () => {
	it("maps transaction inbox reference from listingId", async () => {
		const database = await testabase("inboxReference-transaction-create");

		return Effect.gen(function* () {
			const seller = yield* createDbUserFx({
				email: "inbox-reference-seller@test.cz",
				name: "Seller Ref",
			});
			const buyer = yield* createDbUserFx({
				email: "inbox-reference-buyer@test.cz",
				name: "Buyer Ref",
			});
			const listing = yield* createListingFx(seller.id, {
				title: "Reference fixture listing",
			});

			const transaction = yield* transactionCreateFx({
				listingId: listing.id,
				userId: buyer.id,
			});

			const inbox = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("inbox")
					.select([
						"id",
						"reference",
						"type",
						"userId",
					])
					.where("userId", "=", seller.id)
					.where("type", "=", "buyer-message")
					.executeTakeFirstOrThrow(),
			);

			expect(inbox.reference).toEqual([
				listing.id,
				transaction.id,
			]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
