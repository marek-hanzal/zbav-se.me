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
	it("archived items disappear from collection when filtered with archivedAtIsNull", async () => {
		const database = await testabase("activityArchive-collection-filter");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});

			yield* Effect.promise(() =>
				seedActivity(database, [
					{
						id: "coll-active",
						userId: user.id,
						reference: [
							"listing-active",
						],
						family: "reaction",
						type: "favourite",
						payload: {
							listingId: "listing-active",
						},
						priority: "common",
					},
					{
						id: "coll-to-archive",
						userId: user.id,
						reference: [
							"listing-old",
						],
						family: "reaction",
						type: "favourite",
						payload: {
							listingId: "listing-old",
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
					reference: "listing-old",
				},
			});

			const active = yield* activityCollectionFx({
				scope: {
					userId: user.id,
				},
				where: {
					archivedAtIsNull: true,
				},
			});

			const ids = active.map((i) => i.id);
			expect(ids).toContain("coll-active");
			expect(ids).not.toContain("coll-to-archive");

			const all = yield* activityCollectionFx({
				scope: {
					userId: user.id,
				},
			});

			const allIds = all.map((i) => i.id);
			expect(allIds).toContain("coll-active");
			expect(allIds).toContain("coll-to-archive");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
