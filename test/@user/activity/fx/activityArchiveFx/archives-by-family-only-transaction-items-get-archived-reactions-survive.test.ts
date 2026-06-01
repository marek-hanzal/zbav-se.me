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
	it("archives by family: only transaction items get archived, reactions survive", async () => {
		const database = await testabase("activityArchive-by-family");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});

			yield* Effect.promise(() =>
				seedActivity(database, [
					{
						id: "family-tx",
						userId: user.id,
						reference: [
							"listing-x",
							"tx-x",
						],
						family: "transaction",
						type: "buyer-message",
						payload: {
							transactionId: "tx-x",
						},
						priority: "high",
					},
					{
						id: "family-reaction",
						userId: user.id,
						reference: [
							"listing-x",
						],
						family: "reaction",
						type: "listing.favourite",
						payload: {
							listingId: "listing-x",
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
					family: "transaction",
				},
			});

			const txItem = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("activity")
					.select("archivedAt")
					.where("id", "=", "family-tx")
					.executeTakeFirstOrThrow(),
			);

			const reactionItem = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("activity")
					.select("archivedAt")
					.where("id", "=", "family-reaction")
					.executeTakeFirstOrThrow(),
			);

			expect(txItem.archivedAt).not.toBeNull();
			expect(reactionItem.archivedAt).toBeNull();
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
