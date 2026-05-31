import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { activityCollectionFx } from "~/user/activity/server/fx/activityCollectionFx";

describe("activity deduplication edge cases", () => {
	it("prefers the latest active message when a newer archived duplicate exists", async () => {
		const database = await testabase("activityDedup-prefer-active");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("activity")
					.values([
						{
							id: "dedup-active-older",
							userId: user.id,
							reference: [
								"listing-active",
								"tx-active",
							],
							family: "transaction",
							type: "seller-message",
							payload: {
								transactionId: "tx-active",
								transactionEntryId: "entry-active",
							},
							priority: "high",
							timestamp: new Date("2026-03-17T12:00:00.000Z"),
							archivedAt: null,
						},
						{
							id: "dedup-archived-newer",
							userId: user.id,
							reference: [
								"listing-active",
								"tx-active",
							],
							family: "transaction",
							type: "seller-message",
							payload: {
								transactionId: "tx-active",
								transactionEntryId: "entry-archived",
							},
							priority: "high",
							timestamp: new Date("2026-03-17T12:01:00.000Z"),
							archivedAt: new Date("2026-03-17T12:02:00.000Z"),
						},
					])
					.execute(),
			);

			const activeOnly = yield* activityCollectionFx({
				scope: {
					userId: user.id,
				},
				where: {
					userId: user.id,
					archivedAtIsNull: true,
				},
			});

			expect(activeOnly.map((item) => item.id)).toEqual([
				"dedup-active-older",
			]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
