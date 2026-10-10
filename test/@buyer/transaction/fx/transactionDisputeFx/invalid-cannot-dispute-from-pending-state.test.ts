import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCreateFx } from "~/buyer-transaction/fx/transactionCreateFx";
import { transactionDisputeFx } from "~/buyer-transaction/fx/transactionDisputeFx";
import { expectTaggedErrorFn } from "~/test/common/fx/expectTaggedErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabaseFn } from "~/test/testabaseFn";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("transactionDisputeFx (buyer)", () => {
	it("invalid: cannot dispute from interest state", async () => {
		const database = await testabaseFn("buyerDisputeFx-invalid-from-interest");

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
					.select((ebFn) => ebFn.fn.countAll<number>().as("count"))
					.where("transactionId", "=", tx.id)
					.executeTakeFirstOrThrow(),
			);

			const result = yield* Effect.result(
				transactionDisputeFx({
					transactionId: tx.id,
					userId: buyer.id,
				}),
			);

			expectTaggedErrorFn(result, {
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
					.select((ebFn) => ebFn.fn.countAll<number>().as("count"))
					.where("transactionId", "=", tx.id)
					.executeTakeFirstOrThrow(),
			);

			expect(afterTransaction.status).toBe(tx.status);
			expect(afterEntries.count).toBe(beforeEntries.count);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
