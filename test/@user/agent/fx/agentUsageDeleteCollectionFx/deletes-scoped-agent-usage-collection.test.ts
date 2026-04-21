import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { agentUsageDeleteCollectionFx } from "~/user/agent/server/fx/agentUsageDeleteCollectionFx";

const seedAgentUsage = async (
	database: Awaited<ReturnType<typeof import("~/test/testabase").testabase>>,
	rows: Array<{
		id: string;
		userId: string;
		threadId: string;
		requests: number;
		input: number;
		total: number;
		output: number;
		createdAt: Date;
	}>,
) => {
	const now = new Date("2026-01-01T00:00:00.000Z");
	const threads = rows.map((row) => ({
		id: row.threadId,
		userId: row.userId,
		createdAt: now,
		updatedAt: now,
		archivedAt: null,
	}));

	await database.kysely.insertInto("agent_thread").values(threads).execute();
	await database.kysely.insertInto("agent_usage").values(rows).execute();
};

describe("agentUsageDeleteCollectionFx", () => {
	it("deletes only scoped agent usage items and returns the removed rows", async () => {
		const database = await testabase("agentUsageDeleteCollectionFx-contract");

		return Effect.gen(function* () {
			const { seller, stranger } = yield* createUsersFx({});

			yield* Effect.promise(() =>
				seedAgentUsage(database, [
					{
						id: "agent-usage-alice-1",
						userId: seller.id,
						threadId: "thread-a",
						requests: 1,
						input: 1,
						total: 1,
						output: 0,
						createdAt: new Date("2026-01-01T00:00:00.000Z"),
					},
					{
						id: "agent-usage-alice-2",
						userId: seller.id,
						threadId: "thread-b",
						requests: 2,
						input: 2,
						total: 2,
						output: 0,
						createdAt: new Date("2026-01-01T00:01:00.000Z"),
					},
					{
						id: "agent-usage-bob-1",
						userId: stranger.id,
						threadId: "thread-c",
						requests: 3,
						input: 3,
						total: 3,
						output: 0,
						createdAt: new Date("2026-01-01T00:02:00.000Z"),
					},
				]),
			);

			const deleted = yield* agentUsageDeleteCollectionFx({
				where: {
					userId: seller.id,
				},
				scope: {
					userId: seller.id,
				},
			});

			expect(deleted).toBe(2);

			const remaining = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("agent_usage")
					.select("id")
					.orderBy("id", "asc")
					.execute(),
			);

			expect(remaining).toEqual([
				{
					id: "agent-usage-bob-1",
				},
			]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
