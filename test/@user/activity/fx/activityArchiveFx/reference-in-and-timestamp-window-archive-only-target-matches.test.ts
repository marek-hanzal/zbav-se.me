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
	it("archives only rows matching both referenceIn overlap and timestamp window", async () => {
		const database = await testabase("activityArchive-referenceIn-timestamp-window");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});

			yield* seedActivityFx(database, [
				{
					id: "window-too-early",
					userId: user.id,
					reference: [
						"listing-a",
					],
					family: "reaction",
					type: "favourite",
					payload: {
						listingId: "listing-a",
					},
					priority: "common",
					timestamp: new Date("2026-03-17T12:00:00.000Z"),
				},
				{
					id: "window-target",
					userId: user.id,
					reference: [
						"listing-b",
						"listing-shared",
					],
					family: "reaction",
					type: "favourite",
					payload: {
						listingId: "listing-b",
					},
					priority: "common",
					timestamp: new Date("2026-03-17T12:05:00.000Z"),
				},
				{
					id: "window-too-late",
					userId: user.id,
					reference: [
						"listing-a",
					],
					family: "reaction",
					type: "favourite",
					payload: {
						listingId: "listing-a",
					},
					priority: "common",
					timestamp: new Date("2026-03-17T12:10:00.000Z"),
				},
				{
					id: "window-wrong-reference",
					userId: user.id,
					reference: [
						"listing-z",
					],
					family: "reaction",
					type: "favourite",
					payload: {
						listingId: "listing-z",
					},
					priority: "common",
					timestamp: new Date("2026-03-17T12:05:30.000Z"),
				},
			]);

			yield* activityArchiveFx({
				scope: {
					userId: user.id,
				},
				where: {
					referenceIn: [
						"listing-a",
						"listing-b",
					],
					timestampGte: new Date("2026-03-17T12:03:00.000Z"),
					timestampLte: new Date("2026-03-17T12:06:00.000Z"),
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
					.orderBy("id", "asc")
					.execute(),
			);

			expect(rows.find((row) => row.id === "window-target")?.archivedAt).not.toBeNull();
			expect(rows.find((row) => row.id === "window-too-early")?.archivedAt).toBeNull();
			expect(rows.find((row) => row.id === "window-too-late")?.archivedAt).toBeNull();
			expect(rows.find((row) => row.id === "window-wrong-reference")?.archivedAt).toBeNull();
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
