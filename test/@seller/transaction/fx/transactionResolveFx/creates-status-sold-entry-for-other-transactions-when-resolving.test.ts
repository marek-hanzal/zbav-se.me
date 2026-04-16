import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCreateFx } from "~/buyer/transaction/server/fx/transactionCreateFx";
import { transactionAcceptFx } from "~/seller/transaction/server/fx/transactionAcceptFx";
import { transactionResolveFx } from "~/seller/transaction/server/fx/transactionResolveFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("transactionResolveFx — sold status entry", () => {
	it("creates status-sold entry for other transactions when resolving one transaction", async () => {
		const database = await testabase("transactionResolveFx-sold-entry");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyerB = yield* leaseTestUserFx({});
			const buyerC = yield* leaseTestUserFx({});

			const listing = yield* createListingFx(seller.id, {
				title: "Test listing for sold entry",
			});

			// Create two transactions on the same listing
			const txB = yield* transactionCreateFx({
				listingId: listing.id,
				userId: buyerB.id,
			});

			const txC = yield* transactionCreateFx({
				listingId: listing.id,
				userId: buyerC.id,
			});

			// Accept and resolve transaction B
			yield* transactionAcceptFx({
				transactionId: txB.id,
				userId: seller.id,
			});

			yield* transactionResolveFx({
				transactionId: txB.id,
				userId: seller.id,
			});

			// Check transaction C has status-sold
			const finalTxC = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("status")
					.where("id", "=", txC.id)
					.executeTakeFirstOrThrow(),
			);

			expect(finalTxC.status).toBe("sold");

			// Verify status-sold entry was created for transaction C
			const soldEntries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select("kind")
					.where("transactionId", "=", txC.id)
					.where("kind", "=", "status-sold")
					.execute(),
			);

			expect(soldEntries).toHaveLength(1);
			// biome-ignore lint/style/noNonNullAssertion: Ssst
			expect(soldEntries[0]!.kind).toBe("status-sold");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
