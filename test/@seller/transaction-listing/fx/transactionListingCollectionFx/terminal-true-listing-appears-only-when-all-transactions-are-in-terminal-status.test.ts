import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionRejectFx } from "~/seller/transaction/server/fx/transactionRejectFx";
import { transactionListingCollectionFx } from "~/seller/transaction-listing/server/fx/transactionListingCollectionFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("transactionListingCollectionFx (seller dashboard)", () => {
	it("terminal: true — listing appears only when all transactions are in terminal status", async () => {
		const database = await testabase("txListing-terminal");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

			const { listingId } = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const tx = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("listingId", "=", listingId)
					.executeTakeFirstOrThrow(),
			);

			const notTerminal = yield* transactionListingCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					terminal: true,
				},
			});

			expect(notTerminal.map((l) => l.id)).not.toContain(listingId);

			yield* transactionRejectFx({
				transactionId: tx.id,
				userId: seller.id,
			});

			const terminal = yield* transactionListingCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					terminal: true,
				},
			});

			expect(terminal.map((l) => l.id)).toContain(listingId);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
