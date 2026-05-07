import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createOpenScenarioFx } from "~/test/transaction/fx/createOpenScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { transactionEntryCleanupSensitiveFx } from "~/user/transaction-entry/server/fx/transactionEntryCleanupSensitiveFx";

describe("transactionEntryCleanupSensitiveFx", () => {
	it("does not delete entries when status is non-terminal (open)", async () => {
		const database = await testabase("entryCleanup-non-terminal");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

			const { transactionId } = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			// Insert sensitive entries directly
			yield* Effect.promise(() =>
				database.kysely
					.insertInto("transaction_entry")
					.values([
						{
							id: "entry-loc-open",
							transactionId,
							kind: "location",
							userId: seller.id,
							payload: {
								text: "location data",
							},
							createdAt: new Date(),
						},
					])
					.execute(),
			);

			yield* transactionEntryCleanupSensitiveFx({
				transactionId,
				status: "trade",
			});

			const entries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select("kind")
					.where("transactionId", "=", transactionId)
					.where("kind", "=", "location")
					.execute(),
			);

			expect(entries).toHaveLength(1);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
