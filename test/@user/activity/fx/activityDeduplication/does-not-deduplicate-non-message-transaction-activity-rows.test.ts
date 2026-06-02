import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { activityCollectionFx } from "~/user/activity/server/fx/activityCollectionFx";

describe("activity deduplication edge cases", () => {
	it("does not deduplicate non-message transaction activity rows", async () => {
		const database = await testabase("activityDedup-non-message-untouched");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("activity")
					.values([
						{
							id: "dedup-transaction-a",
							userId: user.id,
							reference: [
								"listing-transaction",
								"tx-transaction",
							],
							family: "transaction",
							type: "transaction",
							payload: {
								transactionId: "tx-transaction",
								transactionEntryId: "entry-a",
								listingId: "listing-transaction",
								target: "buyer",
							},
							priority: "high",
							timestamp: new Date("2026-03-17T13:00:00.000Z"),
							archivedAt: null,
						},
						{
							id: "dedup-transaction-b",
							userId: user.id,
							reference: [
								"listing-transaction",
								"tx-transaction",
							],
							family: "transaction",
							type: "transaction",
							payload: {
								transactionId: "tx-transaction",
								transactionEntryId: "entry-b",
								listingId: "listing-transaction",
								target: "buyer",
							},
							priority: "high",
							timestamp: new Date("2026-03-17T13:01:00.000Z"),
							archivedAt: null,
						},
					])
					.execute(),
			);

			const collection = yield* activityCollectionFx({
				scope: {
					userId: user.id,
				},
				where: {
					userId: user.id,
					type: "transaction",
				},
			});

			expect(collection.map((item) => item.id)).toEqual([
				"dedup-transaction-a",
				"dedup-transaction-b",
			]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
