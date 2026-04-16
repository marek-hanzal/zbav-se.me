import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { activityCollectionFx } from "~/user/activity/server/fx/activityCollectionFx";

describe("activity deduplication (PARTITION BY transactionId)", () => {
	it("multiple seller-message entries for same transactionId collapse into one (latest)", async () => {
		const database = await testabase("activityDedup-seller-message");

		return Effect.gen(function* () {
			const buyer = yield* leaseTestUserFx({});

			const txId = "dedup-tx-seller-001";
			const listingId = "dedup-listing-seller-001";

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("activity")
					.values([
						{
							id: "dedup-seller-1",
							userId: buyer.id,
							reference: [
								listingId,
								txId,
							],
							family: "transaction",
							type: "seller-message",
							payload: {
								transactionId: txId,
								transactionEntryId: "entry-1",
							},
							priority: "high",
							timestamp: new Date("2026-03-17T10:00:00.000Z"),
							archivedAt: null,
						},
						{
							id: "dedup-seller-2",
							userId: buyer.id,
							reference: [
								listingId,
								txId,
							],
							family: "transaction",
							type: "seller-message",
							payload: {
								transactionId: txId,
								transactionEntryId: "entry-2",
							},
							priority: "high",
							timestamp: new Date("2026-03-17T10:01:00.000Z"),
							archivedAt: null,
						},
						{
							id: "dedup-seller-3",
							userId: buyer.id,
							reference: [
								listingId,
								txId,
							],
							family: "transaction",
							type: "seller-message",
							payload: {
								transactionId: txId,
								transactionEntryId: "entry-3",
							},
							priority: "high",
							timestamp: new Date("2026-03-17T10:02:00.000Z"),
							archivedAt: null,
						},
					])
					.execute(),
			);

			const rawItems = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("activity")
					.select("id")
					.where("id", "in", [
						"dedup-seller-1",
						"dedup-seller-2",
						"dedup-seller-3",
					])
					.execute(),
			);

			expect(rawItems).toHaveLength(3);

			const collection = yield* activityCollectionFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					userId: buyer.id,
				},
			});

			const sellerMessageItems = collection.filter((item) => item.type === "seller-message");
			expect(sellerMessageItems).toHaveLength(1);
			expect(sellerMessageItems[0]?.id).toBe("dedup-seller-3");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
