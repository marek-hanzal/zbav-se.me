import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import type { ActivityPriorityEnumSchema } from "~/common/activity/enum/ActivityPriorityEnumSchema";
import type { ActivityTypeEnumSchema } from "~/common/activity/enum/ActivityTypeEnumSchema";
import type { ActivityTableSchema } from "~/server/database/@table/ActivityTableSchema";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { activityArchiveFx } from "~/user/activity/server/fx/activityArchiveFx";

/**
 * Inserts activity rows directly into the DB — bypasses activityCreateFx so tests
 * are not coupled to the full transaction/listing lifecycle.
 */
const seedActivity = async (
	database: Awaited<ReturnType<typeof import("~/test/testabase").testabase>>,
	rows: Array<
		Pick<ActivityTableSchema.Type, "family" | "payload"> & {
			id: string;
			userId: string;
			reference: string[];
			type: ActivityTypeEnumSchema.Type;
			priority: ActivityPriorityEnumSchema.Type;
		}
	>,
) => {
	await database.kysely
		.insertInto("activity")
		.values(
			rows.map((r) => ({
				...r,
				timestamp: new Date("2026-03-17T12:00:00.000Z"),
				archivedAt: null,
			})),
		)
		.execute();
};

describe("activityArchiveFx", () => {
	it("cursor size limits how many items are archived in one call", async () => {
		const database = await testabase("activityArchive-cursor-limit");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});

			yield* Effect.promise(() =>
				seedActivity(database, [
					{
						id: "cursor-1",
						userId: user.id,
						reference: [
							"listing-cursor",
						],
						family: "reaction",
						type: "favourite",
						payload: {
							listingId: "listing-cursor",
						},
						priority: "common",
					},
					{
						id: "cursor-2",
						userId: user.id,
						reference: [
							"listing-cursor",
						],
						family: "reaction",
						type: "favourite",
						payload: {
							listingId: "listing-cursor",
						},
						priority: "common",
					},
					{
						id: "cursor-3",
						userId: user.id,
						reference: [
							"listing-cursor",
						],
						family: "reaction",
						type: "favourite",
						payload: {
							listingId: "listing-cursor",
						},
						priority: "common",
					},
				]),
			);

			yield* activityArchiveFx({
				scope: {
					userId: user.id,
				},
				where: {
					reference: "listing-cursor",
				},
				cursor: {
					page: 0,
					size: 2,
				},
			});

			const archived = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("activity")
					.select("archivedAt")
					.where("userId", "=", user.id)
					.execute(),
			);

			const archivedCount = archived.filter((i) => i.archivedAt !== null).length;
			const activeCount = archived.filter((i) => i.archivedAt === null).length;

			expect(archivedCount).toBe(2);
			expect(activeCount).toBe(1);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
