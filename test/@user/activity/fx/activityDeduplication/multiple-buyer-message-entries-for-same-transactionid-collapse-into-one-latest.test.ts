import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { activityCollectionFx } from "~/user/activity/server/fx/activityCollectionFx";

describe("activity deduplication (PARTITION BY transactionId)", () => {
	it("multiple buyer-message entries for same transactionId collapse into one (latest)", async () => {
		const database = await testabase("activityDedup-buyer-message");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});

			const txId = "dedup-tx-001";
			const listingId = "dedup-listing-001";

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("activity")
					.values([
						{
							id: "dedup-activity-1",
							userId: seller.id,
							reference: [
								listingId,
								txId,
							],
							family: "transaction",
							type: "buyer-message",
							payload: {
								transactionId: txId,
								transactionEntryId: "entry-1",
							},
							priority: "high",
							timestamp: new Date("2026-03-17T10:00:00.000Z"),
							archivedAt: null,
						},
						{
							id: "dedup-activity-2",
							userId: seller.id,
							reference: [
								listingId,
								txId,
							],
							family: "transaction",
							type: "buyer-message",
							payload: {
								transactionId: txId,
								transactionEntryId: "entry-2",
							},
							priority: "high",
							timestamp: new Date("2026-03-17T10:01:00.000Z"),
							archivedAt: null,
						},
						{
							id: "dedup-activity-3",
							userId: seller.id,
							reference: [
								listingId,
								txId,
							],
							family: "transaction",
							type: "buyer-message",
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
						"dedup-activity-1",
						"dedup-activity-2",
						"dedup-activity-3",
					])
					.execute(),
			);

			expect(rawItems).toHaveLength(3);

			const collection = yield* activityCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					userId: seller.id,
				},
			});

			const buyerMessageItems = collection.filter((item) => item.type === "buyer-message");
			expect(buyerMessageItems).toHaveLength(1);
			expect(buyerMessageItems[0]?.id).toBe("dedup-activity-3");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
