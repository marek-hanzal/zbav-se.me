import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { activityCollectionFx } from "~/user/activity/server/fx/activityCollectionFx";

describe("activity read model filters by archive timestamp and scope", () => {
	it("applies archive and timestamp filters inside the current scope", async () => {
		const database = await testabase("activityReadModelFx-meta-filters");

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
							id: "activity-read-favourite-c",
							userId: user.id,
							reference: [
								"listing-c",
							],
							family: "reaction",
							type: "listing.favourite",
							payload: {
								listingId: "listing-c",
							},
							priority: "common",
							timestamp: new Date("2026-04-01T11:00:00.000Z"),
							archivedAt: null,
						},
						{
							id: "activity-read-tx-archived",
							userId: user.id,
							reference: [
								"listing-a",
								"tx-archived",
							],
							family: "transaction",
							type: "transaction",
							payload: {
								listingId: "listing-a",
								transactionId: "tx-archived",
								transactionEntryId: "entry-archived",
								target: "seller",
							},
							priority: "high",
							timestamp: new Date("2026-04-01T12:00:00.000Z"),
							archivedAt: new Date("2026-04-01T12:30:00.000Z"),
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

			const all = yield* activityCollectionFx({
				scope: {
					userId: user.id,
				},
				sort: [
					{
						field: "timestamp",
						order: "asc",
					},
				],
			});
			const archivedOnly = yield* activityCollectionFx({
				scope: {
					userId: user.id,
				},
				where: {
					archivedAtIsNull: false,
				},
			});
			const recentOnly = yield* activityCollectionFx({
				scope: {
					userId: user.id,
				},
				where: {
					timestampGte: new Date("2026-04-01T10:30:00.000Z"),
					timestampLte: new Date("2026-04-01T12:00:00.000Z"),
				},
			});
			const idSubset = yield* activityCollectionFx({
				scope: {
					userId: user.id,
				},
				where: {
					idIn: [
						"activity-read-favourite-c",
						"activity-read-stranger",
					],
				},
			});

			expect(all.map((item) => item.id)).toEqual([
				"activity-read-tx-a",
				"activity-read-favourite-c",
				"activity-read-tx-archived",
			]);
			expect(archivedOnly.map((item) => item.id)).toEqual([
				"activity-read-tx-archived",
			]);
			expect(recentOnly.map((item) => item.id).sort()).toEqual([
				"activity-read-favourite-c",
				"activity-read-tx-archived",
			]);
			expect(idSubset.map((item) => item.id)).toEqual([
				"activity-read-favourite-c",
			]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
