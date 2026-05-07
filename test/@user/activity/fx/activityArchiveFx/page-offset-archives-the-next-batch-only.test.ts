import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import type { ActivityPriorityEnumSchema } from "~/common/activity/enum/ActivityPriorityEnumSchema";
import type { ActivityTypeEnumSchema } from "~/common/activity/enum/ActivityTypeEnumSchema";
import type { ActivityTableSchema } from "~/server/database/@table/ActivityTableSchema";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { activityArchiveFx } from "~/user/activity/server/fx/activityArchiveFx";

type TestDatabase = Awaited<ReturnType<typeof testabase>>;

const seedActivityFx = (
	database: TestDatabase,
	rows: Array<
		Pick<ActivityTableSchema.Type, "family" | "payload" | "timestamp"> & {
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
			.values(
				rows.map((row) => ({
					...row,
					archivedAt: null,
				})),
			)
			.execute(),
	);

describe("activityArchiveFx", () => {
	it("uses cursor page offsets to archive only the next matching batch", async () => {
		const database = await testabase("activityArchive-page-offset");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});

			yield* seedActivityFx(database, [
				{
					id: "page-batch-1",
					userId: user.id,
					reference: [
						"listing-page",
					],
					family: "reaction",
					type: "favourite",
					payload: {
						listingId: "listing-page",
					},
					priority: "common",
					timestamp: new Date("2026-03-17T12:00:00.000Z"),
				},
				{
					id: "page-batch-2",
					userId: user.id,
					reference: [
						"listing-page",
					],
					family: "reaction",
					type: "favourite",
					payload: {
						listingId: "listing-page",
					},
					priority: "common",
					timestamp: new Date("2026-03-17T12:01:00.000Z"),
				},
				{
					id: "page-batch-3",
					userId: user.id,
					reference: [
						"listing-page",
					],
					family: "reaction",
					type: "favourite",
					payload: {
						listingId: "listing-page",
					},
					priority: "common",
					timestamp: new Date("2026-03-17T12:02:00.000Z"),
				},
			]);

			yield* activityArchiveFx({
				scope: {
					userId: user.id,
				},
				where: {
					reference: "listing-page",
				},
				sort: [
					{
						field: "timestamp",
						order: "asc",
					},
				],
				cursor: {
					page: 1,
					size: 1,
				},
			});

			const rows = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("activity")
					.select([
						"id",
						"archivedAt",
					])
					.where("userId", "=", user.id)
					.orderBy("timestamp", "asc")
					.execute(),
			);

			expect(rows.map((row) => row.id)).toEqual([
				"page-batch-1",
				"page-batch-2",
				"page-batch-3",
			]);
			expect(rows[0]?.archivedAt).toBeNull();
			expect(rows[1]?.archivedAt).not.toBeNull();
			expect(rows[2]?.archivedAt).toBeNull();
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
