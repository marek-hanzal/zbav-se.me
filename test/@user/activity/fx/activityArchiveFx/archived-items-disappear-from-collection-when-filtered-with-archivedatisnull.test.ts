import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import type { ActivityPriorityEnumSchema } from "~/activity/schema/ActivityPriorityEnumSchema";
import type { ActivityTypeEnumSchema } from "~/activity/schema/ActivityTypeEnumSchema";
import type { ActivityTableSchema } from "~/database/schema/ActivityTable";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { activityArchiveFx } from "~/user-activity/fx/activityArchiveFx";
import { activityCollectionFx } from "~/user-activity/fx/activityCollectionFx";

/**
 * Inserts activity rows directly into the DB — bypasses activityCreateFx so tests
 * are not coupled to the full transaction/listing lifecycle.
 */
const seedActivityFn = async (
	database: Awaited<ReturnType<typeof import("~/test/testabaseFn").testabaseFn>>,
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
		const database = await testabaseFn("activityArchive-collection-filter");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});

			yield* Effect.promise(() =>
				seedActivityFn(database, [
					{
						id: "coll-active",
						userId: user.id,
						reference: [
							"listing-active",
						],
						family: "reaction",
						type: "listing.favourite",
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
						type: "listing.favourite",
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
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
