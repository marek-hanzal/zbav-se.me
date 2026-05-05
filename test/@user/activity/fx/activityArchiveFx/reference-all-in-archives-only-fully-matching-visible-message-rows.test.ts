import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import type { ActivityPriorityEnumSchema } from "~/common/activity/enum/ActivityPriorityEnumSchema";
import type { ActivityTypeEnumSchema } from "~/common/activity/enum/ActivityTypeEnumSchema";
import type { ActivityTableSchema } from "~/server/database/@table/ActivityTableSchema";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { activityArchiveFx } from "~/user/activity/server/fx/activityArchiveFx";
import { activityCollectionFx } from "~/user/activity/server/fx/activityCollectionFx";
import { activityCountFx } from "~/user/activity/server/fx/activityCountFx";

type TestDatabase = Awaited<ReturnType<typeof testabase>>;

const seedActivityFx = (
	database: TestDatabase,
	rows: Array<
		Pick<ActivityTableSchema.Type, "family" | "payload" | "timestamp" | "archivedAt"> & {
			id: string;
			userId: string;
			reference: string[];
			type: ActivityTypeEnumSchema.Type;
			priority: ActivityPriorityEnumSchema.Type;
		}
	>,
) =>
	Effect.promise(() =>
		database.kysely
			.insertInto("activity")
			.values(rows)
			.execute(),
	);

describe("activityArchiveFx", () => {
	it("archives only fully matching visible message rows when referenceAllIn is used", async () => {
		const database = await testabase("activityArchive-reference-all-visible-message");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});

			yield* seedActivityFx(database, [
				{
					id: "visible-active-message",
					userId: user.id,
					reference: [
						"listing-all",
						"tx-all",
					],
					family: "transaction",
					type: "seller-message",
					payload: {
						transactionId: "tx-all",
					},
					priority: "high",
					timestamp: new Date("2026-03-17T12:00:00.000Z"),
					archivedAt: null,
				},
				{
					id: "newer-already-archived-message",
					userId: user.id,
					reference: [
						"listing-all",
						"tx-all",
					],
					family: "transaction",
					type: "seller-message",
					payload: {
						transactionId: "tx-all",
					},
					priority: "high",
					timestamp: new Date("2026-03-17T12:01:00.000Z"),
					archivedAt: new Date("2026-03-17T12:02:00.000Z"),
				},
				{
					id: "partial-reference-message",
					userId: user.id,
					reference: [
						"listing-all",
					],
					family: "transaction",
					type: "seller-message",
					payload: {
						transactionId: "tx-partial",
					},
					priority: "high",
					timestamp: new Date("2026-03-17T12:03:00.000Z"),
					archivedAt: null,
				},
				{
					id: "matching-reaction",
					userId: user.id,
					reference: [
						"listing-all",
						"tx-all",
					],
					family: "reaction",
					type: "favourite",
					payload: {
						listingId: "listing-all",
					},
					priority: "common",
					timestamp: new Date("2026-03-17T12:04:00.000Z"),
					archivedAt: null,
				},
			]);

			const beforeVisible = yield* activityCollectionFx({
				scope: {
					userId: user.id,
				},
				where: {
					referenceAllIn: [
						"listing-all",
						"tx-all",
					],
					archivedAtIsNull: true,
				},
			});

			yield* activityArchiveFx({
				scope: {
					userId: user.id,
				},
				where: {
					referenceAllIn: [
						"listing-all",
						"tx-all",
					],
					type: "seller-message",
					archivedAtIsNull: true,
				},
			});

			const afterVisibleCount = yield* activityCountFx({
				scope: {
					userId: user.id,
				},
				where: {
					referenceAllIn: [
						"listing-all",
						"tx-all",
					],
					type: "seller-message",
					archivedAtIsNull: true,
				},
			});
			const rows = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("activity")
					.select([
						"id",
						"archivedAt",
					])
					.where("id", "in", [
						"visible-active-message",
						"newer-already-archived-message",
						"partial-reference-message",
						"matching-reaction",
					])
					.orderBy("id", "asc")
					.execute(),
			);

			expect(beforeVisible.map((item) => item.id).sort()).toEqual([
				"matching-reaction",
				"visible-active-message",
			]);
			expect(afterVisibleCount).toBe(0);
			expect(rows.find((row) => row.id === "visible-active-message")?.archivedAt).not.toBeNull();
			expect(
				rows.find((row) => row.id === "newer-already-archived-message")?.archivedAt,
			).not.toBeNull();
			expect(rows.find((row) => row.id === "partial-reference-message")?.archivedAt).toBeNull();
			expect(rows.find((row) => row.id === "matching-reaction")?.archivedAt).toBeNull();
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
