import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { activityCollectionFx } from "~/user/activity/server/fx/activityCollectionFx";

describe("activity read model filters by reference", () => {
	it("matches single, any and all reference filters", async () => {
		const database = await testabase("activityReadModelFx-reference");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});
			const stranger = yield* leaseTestUserFx({});

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("activity")
					.values([
						{
							id: "activity-read-tx-a",
							userId: user.id,
							reference: [
								"listing-a",
								"tx-a",
							],
							family: "transaction",
							type: "buyer-message",
							payload: {
								transactionId: "tx-a",
								transactionEntryId: "entry-a",
							},
							priority: "high",
							timestamp: new Date("2026-04-01T09:00:00.000Z"),
							archivedAt: null,
						},
						{
							id: "activity-read-thumb-b",
							userId: user.id,
							reference: [
								"listing-b",
							],
							family: "reaction",
							type: "thumb",
							payload: {
								listingId: "listing-b",
								thumb: "like",
							},
							priority: "common",
							timestamp: new Date("2026-04-01T10:00:00.000Z"),
							archivedAt: null,
						},
						{
							id: "activity-read-favourite-c",
							userId: user.id,
							reference: [
								"listing-c",
							],
							family: "reaction",
							type: "favourite",
							payload: {
								listingId: "listing-c",
							},
							priority: "common",
							timestamp: new Date("2026-04-01T11:00:00.000Z"),
							archivedAt: null,
						},
						{
							id: "activity-read-stranger",
							userId: stranger.id,
							reference: [
								"listing-stranger",
								"tx-stranger",
							],
							family: "transaction",
							type: "buyer-message",
							payload: {
								transactionId: "tx-stranger",
								transactionEntryId: "entry-stranger",
							},
							priority: "high",
							timestamp: new Date("2026-04-01T13:00:00.000Z"),
							archivedAt: null,
						},
					])
					.execute(),
			);

			const byReference = yield* activityCollectionFx({
				scope: {
					userId: user.id,
				},
				where: {
					reference: "tx-a",
				},
			});
			const byAnyReference = yield* activityCollectionFx({
				scope: {
					userId: user.id,
				},
				where: {
					referenceIn: [
						"listing-z",
						"listing-b",
					],
				},
			});
			const byAllReference = yield* activityCollectionFx({
				scope: {
					userId: user.id,
				},
				where: {
					referenceAllIn: [
						"listing-a",
						"tx-a",
					],
				},
			});

			expect(byReference.map((item) => item.id)).toEqual([
				"activity-read-tx-a",
			]);
			expect(byAnyReference.map((item) => item.id)).toEqual([
				"activity-read-thumb-b",
			]);
			expect(byAllReference.map((item) => item.id)).toEqual([
				"activity-read-tx-a",
			]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
