import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCreateFx } from "~/buyer/transaction/server/fx/transactionCreateFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("activity reference", () => {
	it("maps transaction activity reference from listingId", async () => {
		const database = await testabase("activityReference-transaction-create");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});
			const listing = yield* createListingFx(seller.id, {
				title: "Reference fixture listing",
			});

			const transaction = yield* transactionCreateFx({
				listingId: listing.id,
				userId: buyer.id,
			});

			const activity = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("activity")
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

			expect(activity.reference).toEqual([
				listing.id,
				transaction.id,
			]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
