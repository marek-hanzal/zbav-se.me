import type { AgentInputItem } from "@openai/agents-core";
import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { agentStreamCollectionFx } from "~/user/agent/server/fx/agentStreamCollectionFx";
import { agentStreamDeleteCollectionFx } from "~/user/agent/server/fx/agentStreamDeleteCollectionFx";
import { agentStreamFetchFx } from "~/user/agent/server/fx/agentStreamFetchFx";
import { agentUsageCollectionFx } from "~/user/agent/server/fx/agentUsageCollectionFx";

type TestDatabase = Awaited<ReturnType<typeof testabase>>;

interface AgentStreamSeedRow {
	id: string;
	userId: string;
	threadId: string;
	payload: AgentInputItem;
	sort: number;
}

interface AgentUsageSeedRow {
	id: string;
	userId: string;
	threadId: string;
	requests: number;
	input: number;
	total: number;
	output: number;
	createdAt: Date;
}

const seedAgentStream = (database: TestDatabase, rows: AgentStreamSeedRow[]) =>
	Effect.promise(async () => {
		await seedAgentThreads(database, rows);
		await database.kysely.insertInto("agent_stream").values(rows).execute();
	});

const seedAgentUsage = (database: TestDatabase, rows: AgentUsageSeedRow[]) =>
	Effect.promise(async () => {
		await seedAgentThreads(database, rows);
		await database.kysely.insertInto("agent_usage").values(rows).execute();
	});

const seedAgentThreads = async (
	database: TestDatabase,
	rows: Array<{
		userId: string;
		threadId: string;
	}>,
) => {
	const now = new Date("2026-01-01T00:00:00.000Z");
	const threads = [
		...new Map(
			rows.map((row) => [
				row.threadId,
				{
					id: row.threadId,
					userId: row.userId,
					createdAt: now,
					updatedAt: now,
					archivedAt: null,
				},
			]),
		).values(),
	];
	const existing = await database.kysely
		.selectFrom("agent_thread")
		.select("id")
		.where(
			"id",
			"in",
			threads.map((thread) => thread.id),
		)
		.execute();
	const existingIds = new Set(existing.map((thread) => thread.id));
	const missing = threads.filter((thread) => !existingIds.has(thread.id));

	if (missing.length > 0) {
		await database.kysely.insertInto("agent_thread").values(missing).execute();
	}
};

describe("agent read models", () => {
	it("collections, fetch and delete collection apply user and thread scopes", async () => {
		const database = await testabase("agent-read-model-flow");

		return Effect.gen(function* () {
			const { seller, stranger } = yield* createUsersFx({});

			yield* seedAgentStream(database, [
				{
					id: "agent-read-stream-a-1",
					userId: seller.id,
					threadId: "thread-a",
					payload: {
						id: "agent-input-a-1",
						role: "user",
						content: "First",
					} satisfies AgentInputItem,
					sort: 2,
				},
				{
					id: "agent-read-stream-a-2",
					userId: seller.id,
					threadId: "thread-a",
					payload: {
						id: "agent-input-a-2",
						role: "user",
						content: "Second",
					} satisfies AgentInputItem,
					sort: 1,
				},
				{
					id: "agent-read-stream-b-1",
					userId: seller.id,
					threadId: "thread-b",
					payload: {
						id: "agent-input-b-1",
						role: "user",
						content: "Other thread",
					} satisfies AgentInputItem,
					sort: 1,
				},
				{
					id: "agent-read-stream-foreign",
					userId: stranger.id,
					threadId: "thread-foreign",
					payload: {
						id: "agent-input-foreign",
						role: "user",
						content: "Foreign thread",
					} satisfies AgentInputItem,
					sort: 1,
				},
			]);
			yield* seedAgentUsage(database, [
				{
					id: "agent-read-usage-a-1",
					userId: seller.id,
					threadId: "thread-a",
					requests: 1,
					input: 10,
					output: 5,
					total: 15,
					createdAt: new Date("2026-01-01T00:00:00.000Z"),
				},
				{
					id: "agent-read-usage-b-1",
					userId: seller.id,
					threadId: "thread-b",
					requests: 2,
					input: 20,
					output: 8,
					total: 28,
					createdAt: new Date("2026-01-01T00:01:00.000Z"),
				},
				{
					id: "agent-read-usage-foreign",
					userId: stranger.id,
					threadId: "thread-foreign",
					requests: 3,
					input: 30,
					output: 9,
					total: 39,
					createdAt: new Date("2026-01-01T00:02:00.000Z"),
				},
			]);

			const streamCollection = yield* agentStreamCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					threadId: "thread-a",
				},
				sort: [
					{
						field: "sort",
						order: "asc",
					},
				],
			});
			const fetched = yield* agentStreamFetchFx({
				scope: {
					userId: seller.id,
				},
				where: {
					id: "agent-read-stream-a-1",
				},
			});
			const usageCollection = yield* agentUsageCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					idIn: [
						"agent-read-usage-a-1",
						"agent-read-usage-foreign",
					],
				},
			});
			const deleted = yield* agentStreamDeleteCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					threadId: "thread-a",
				},
			});
			const remaining = yield* agentStreamCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					idIn: [
						"agent-read-stream-a-1",
						"agent-read-stream-a-2",
						"agent-read-stream-b-1",
						"agent-read-stream-foreign",
					],
				},
			});

			expect(streamCollection.map((item) => item.id)).toEqual([
				"agent-read-stream-a-2",
				"agent-read-stream-a-1",
			]);
			expect(fetched.id).toBe("agent-read-stream-a-1");
			expect(usageCollection.map((item) => item.id)).toEqual([
				"agent-read-usage-a-1",
			]);
			expect(deleted).toBe(2);
			expect(remaining.map((item) => item.id)).toEqual([
				"agent-read-stream-b-1",
			]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
