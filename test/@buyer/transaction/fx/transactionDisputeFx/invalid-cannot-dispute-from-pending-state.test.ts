import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCreateFx } from "~/buyer/transaction/server/fx/transactionCreateFx";
import { transactionDisputeFx } from "~/buyer/transaction/server/fx/transactionDisputeFx";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("transactionDisputeFx (buyer)", () => {
	it("invalid: cannot dispute from interest state", async () => {
		const database = await testabase("buyerDisputeFx-invalid-from-interest");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

			const listing = yield* createListingFx(seller.id);
			yield* transactionCreateFx({
				listingId: listing.id,
				userId: buyer.id,
			});

			const tx = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select([
						"id",
						"status",
					])
					.where("userId", "=", buyer.id)
					.executeTakeFirstOrThrow(),
			);
			const beforeEntries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select((eb) => eb.fn.countAll<number>().as("count"))
					.where("transactionId", "=", tx.id)
					.executeTakeFirstOrThrow(),
			);

			const result = yield* Effect.either(
				transactionDisputeFx({
					transactionId: tx.id,
					userId: buyer.id,
				}),
			);

			expectTaggedErrorFx(result, {
				tag: "InvalidRequestErrorFx",
				message: "Invalid transaction status transition from interest to dispute for buyer",
			});

			const afterTransaction = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("status")
					.where("id", "=", tx.id)
					.executeTakeFirstOrThrow(),
			);
			const afterEntries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select((eb) => eb.fn.countAll<number>().as("count"))
					.where("transactionId", "=", tx.id)
					.executeTakeFirstOrThrow(),
			);

			expect(afterTransaction.status).toBe(tx.status);
			expect(afterEntries.count).toBe(beforeEntries.count);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
