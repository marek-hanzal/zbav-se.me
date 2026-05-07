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
	it("archives all matching items by reference and leaves others untouched", async () => {
		const database = await testabase("activityArchive-by-reference");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});

			yield* Effect.promise(() =>
				seedActivity(database, [
					{
						id: "arch-ref-a1",
						userId: user.id,
						reference: [
							"listing-a",
							"tx-1",
						],
						family: "transaction",
						type: "buyer-message",
						payload: {
							transactionId: "tx-1",
						},
						priority: "high",
					},
					{
						id: "arch-ref-a2",
						userId: user.id,
						reference: [
							"listing-a",
							"tx-1",
						],
						family: "transaction",
						type: "seller-message",
						payload: {
							transactionId: "tx-1",
						},
						priority: "high",
					},
					{
						id: "arch-ref-b1",
						userId: user.id,
						reference: [
							"listing-b",
						],
						family: "reaction",
						type: "favourite",
						payload: {
							listingId: "listing-b",
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
					reference: "listing-a",
				},
			});

			const archivedItems = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("activity")
					.select([
						"id",
						"archivedAt",
					])
					.where("id", "in", [
						"arch-ref-a1",
						"arch-ref-a2",
					])
					.execute(),
			);

			expect(archivedItems.every((i) => i.archivedAt !== null)).toBe(true);

			const untouched = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("activity")
					.select("archivedAt")
					.where("id", "=", "arch-ref-b1")
					.executeTakeFirstOrThrow(),
			);

			expect(untouched.archivedAt).toBeNull();
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
