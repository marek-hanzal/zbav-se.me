import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCreateFx } from "~/buyer/transaction/server/fx/transactionCreateFx";
import { transactionAcceptFx } from "~/seller/transaction/server/fx/transactionAcceptFx";
import { transactionResolveFx } from "~/seller/transaction/server/fx/transactionResolveFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { fetchTransactionFx } from "~/test/transaction/fx/fetchTransactionFx";
import { fetchTransactionEntryKindsFx } from "~/test/transaction-entry/fx/fetchTransactionEntryKindsFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("transactionResolveFx — sold behavior", () => {
	it("seller resolves transaction for buyer B — buyer C gets sold, listing gets sold", async () => {
		const database = await testabase("transactionResolveFx-sold-behavior");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyerB = yield* leaseTestUserFx({});
			const buyerC = yield* leaseTestUserFx({});

			const listing = yield* createListingFx(seller.id, {
				title: "Test listing for resolve flow",
			});

			expect(listing.status).toBe("live");

			yield* transactionCreateFx({
				listingId: listing.id,
				userId: buyerB.id,
			});

			yield* transactionCreateFx({
				listingId: listing.id,
				userId: buyerC.id,
			});

			const [txB, txC] = yield* Effect.promise(() =>
				Promise.all([
					database.kysely
						.selectFrom("transaction")
						.select("id")
						.where("listingId", "=", listing.id)
						.where("userId", "=", buyerB.id)
						.executeTakeFirstOrThrow(),
					database.kysely
						.selectFrom("transaction")
						.select("id")
						.where("listingId", "=", listing.id)
						.where("userId", "=", buyerC.id)
						.executeTakeFirstOrThrow(),
				]),
			);

			yield* transactionAcceptFx({
				transactionId: txB.id,
				userId: seller.id,
			});

			yield* transactionResolveFx({
				transactionId: txB.id,
				userId: seller.id,
			});

			const [finalTxB, finalTxC] = yield* Effect.promise(() =>
				Promise.all([
					fetchTransactionFx({
						database,
						id: txB.id,
						select: [
							"status",
						],
					}).pipe(Effect.runPromise),
					fetchTransactionFx({
						database,
						id: txC.id,
						select: [
							"status",
						],
					}).pipe(Effect.runPromise),
				]),
			);

			expect(finalTxB.status).toBe("resolved");
			expect(finalTxC.status).toBe("sold");

			const finalListing = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("listing")
					.select("status")
					.where("id", "=", listing.id)
					.executeTakeFirstOrThrow(),
			);

			expect(finalListing.status).toBe("sold");

			const kindsB = yield* fetchTransactionEntryKindsFx({
				database,
				transactionId: txB.id,
			});
			expect(kindsB).toContain("status-interest");
			expect(kindsB).toContain("status-trade");
			expect(kindsB).toContain("status-resolved");
			expect(kindsB).not.toContain("status-sold");

			const kindsC = yield* fetchTransactionEntryKindsFx({
				database,
				transactionId: txC.id,
			});
			expect(kindsC).toContain("status-interest");
			expect(kindsC).toContain("status-sold");
			expect(kindsC).not.toContain("status-resolved");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
