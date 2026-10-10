import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { activityCollectionFx } from "~/user-activity/fx/activityCollectionFx";

describe("activity read model filters by priority", () => {
	it("filters activity items by priority level", async () => {
		const database = await testabaseFn("activityReadModelFx-priority");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("activity")
					.values([
						{
							id: "activity-priority-high",
							userId: user.id,
							reference: [
								"listing-priority",
							],
							family: "transaction",
							type: "buyer-message",
							payload: {
								transactionId: "tx-high",
							},
							priority: "high",
							timestamp: new Date("2026-04-01T09:00:00.000Z"),
							archivedAt: null,
						},
						{
							id: "activity-priority-common",
							userId: user.id,
							reference: [
								"listing-priority",
							],
							family: "reaction",
							type: "thumb",
							payload: {
								listingId: "listing-priority",
								thumb: "like",
							},
							priority: "common",
							timestamp: new Date("2026-04-01T11:00:00.000Z"),
							archivedAt: null,
						},
					])
					.execute(),
			);

			const highOnly = yield* activityCollectionFx({
				scope: {
					userId: user.id,
				},
				where: {
					priority: "high",
				},
			});

			const commonOnly = yield* activityCollectionFx({
				scope: {
					userId: user.id,
				},
				where: {
					priority: "common",
				},
			});

			expect(highOnly.map((item) => item.id)).toEqual([
				"activity-priority-high",
			]);
			expect(commonOnly.map((item) => item.id)).toEqual([
				"activity-priority-common",
			]);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
