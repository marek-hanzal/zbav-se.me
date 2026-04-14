import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { activityCollectionFx } from "~/user/activity/server/fx/activityCollectionFx";

describe("activity deduplication (PARTITION BY transactionId)", () => {
	it("buyer-message and seller-message for different transactions are NOT deduplicated together", async () => {
		const database = await testabase("activityDedup-separate-transactions");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			yield* leaseTestUserFx({});

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("activity")
					.values([
						{
							id: "dedup-sep-1",
							userId: seller.id,
							reference: [
								"listing-y",
								"tx-aaa",
							],
							family: "transaction",
							type: "buyer-message",
							payload: {
								transactionId: "tx-aaa",
								transactionEntryId: "entry-a",
							},
							priority: "high",
							timestamp: new Date("2026-03-17T11:00:00.000Z"),
							archivedAt: null,
						},
						{
							id: "dedup-sep-2",
							userId: seller.id,
							reference: [
								"listing-z",
								"tx-bbb",
							],
							family: "transaction",
							type: "buyer-message",
							payload: {
								transactionId: "tx-bbb",
								transactionEntryId: "entry-b",
							},
							priority: "high",
							timestamp: new Date("2026-03-17T11:01:00.000Z"),
							archivedAt: null,
						},
					])
					.execute(),
			);

			const collection = yield* activityCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					userId: seller.id,
				},
			});

			const buyerMessageItems = collection.filter((item) => item.type === "buyer-message");
			expect(buyerMessageItems).toHaveLength(2);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
