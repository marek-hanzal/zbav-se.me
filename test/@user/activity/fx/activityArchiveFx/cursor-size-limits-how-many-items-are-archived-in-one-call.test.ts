import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import type { ActivityPriorityEnumSchema } from "~/activity/schema/ActivityPriorityEnumSchema";
import type { ActivityTypeEnumSchema } from "~/activity/schema/ActivityTypeEnumSchema";
import type { ActivityTableSchema } from "~/database/schema/ActivityTable";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { activityArchiveFx } from "~/user-activity/fx/activityArchiveFx";

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
	it("cursor size limits how many items are archived in one call", async () => {
		const database = await testabaseFn("activityArchive-cursor-limit");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});

			yield* Effect.promise(() =>
				seedActivityFn(database, [
					{
						id: "cursor-1",
						userId: user.id,
						reference: [
							"listing-cursor",
						],
						family: "reaction",
						type: "listing.favourite",
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
						type: "listing.favourite",
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
						type: "listing.favourite",
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
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
