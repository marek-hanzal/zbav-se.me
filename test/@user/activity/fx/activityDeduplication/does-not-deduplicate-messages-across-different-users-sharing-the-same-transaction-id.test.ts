import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { activityCollectionFx } from "~/user/activity/server/fx/activityCollectionFx";

describe("activity deduplication edge cases", () => {
	it("does not deduplicate messages across different users sharing the same transaction id", async () => {
		const database = await testabase("activityDedup-user-scope");

		return Effect.gen(function* () {
			const alice = yield* leaseTestUserFx({});
			const bob = yield* leaseTestUserFx({});

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("activity")
					.values([
						{
							id: "dedup-user-a-1",
							userId: alice.id,
							reference: [
								"listing-user-scope",
								"shared-tx-id",
							],
							family: "transaction",
							type: "buyer-message",
							payload: {
								transactionId: "shared-tx-id",
								transactionEntryId: "alice-entry",
							},
							priority: "high",
							timestamp: new Date("2026-03-17T12:00:00.000Z"),
							archivedAt: null,
						},
						{
							id: "dedup-user-b-1",
							userId: bob.id,
							reference: [
								"listing-user-scope",
								"shared-tx-id",
							],
							family: "transaction",
							type: "buyer-message",
							payload: {
								transactionId: "shared-tx-id",
								transactionEntryId: "bob-entry",
							},
							priority: "high",
							timestamp: new Date("2026-03-17T12:01:00.000Z"),
							archivedAt: null,
						},
					])
					.execute(),
			);

			const aliceCollection = yield* activityCollectionFx({
				scope: {
					userId: alice.id,
				},
				where: {
					userId: alice.id,
				},
			});
			const bobCollection = yield* activityCollectionFx({
				scope: {
					userId: bob.id,
				},
				where: {
					userId: bob.id,
				},
			});

			expect(aliceCollection.map((item) => item.id)).toEqual([
				"dedup-user-a-1",
			]);
			expect(bobCollection.map((item) => item.id)).toEqual([
				"dedup-user-b-1",
			]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
