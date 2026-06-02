import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { activityCollectionFx } from "~/user/activity/server/fx/activityCollectionFx";

describe("activity deduplication edge cases", () => {
	it("breaks same-timestamp ties by newer lexicographic id", async () => {
		const database = await testabase("activityDedup-tie-break-id");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("activity")
					.values([
						{
							id: "dedup-tie-a",
							userId: user.id,
							reference: [
								"listing-tie",
								"tx-tie",
							],
							family: "transaction",
							type: "seller-message",
							payload: {
								transactionId: "tx-tie",
								transactionEntryId: "entry-a",
							},
							priority: "high",
							timestamp: new Date("2026-03-17T12:00:00.000Z"),
							archivedAt: null,
						},
						{
							id: "dedup-tie-b",
							userId: user.id,
							reference: [
								"listing-tie",
								"tx-tie",
							],
							family: "transaction",
							type: "seller-message",
							payload: {
								transactionId: "tx-tie",
								transactionEntryId: "entry-b",
							},
							priority: "high",
							timestamp: new Date("2026-03-17T12:00:00.000Z"),
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
				},
			});

			expect(collection.map((item) => item.id)).toEqual([
				"dedup-tie-b",
			]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
