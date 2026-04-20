import type { AgentInputItem } from "@openai/agents-core";
import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { agentStreamDeleteCollectionFx } from "~/user/agent/server/fx/agentStreamDeleteCollectionFx";

const seedAgentStream = async (
	database: Awaited<ReturnType<typeof import("~/test/testabase").testabase>>,
	rows: Array<{
		id: string;
		userId: string;
		threadId: string;
		payload: AgentInputItem;
		sort: number;
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
	await database.kysely.insertInto("agent_stream").values(rows).execute();
};

describe("agentStreamDeleteCollectionFx", () => {
	it("deletes only scoped agent stream items and returns the removed count", async () => {
		const database = await testabase("agentStreamDeleteCollectionFx-contract");

		return Effect.gen(function* () {
			const { seller, stranger } = yield* createUsersFx({});

			yield* Effect.promise(() =>
				seedAgentStream(database, [
					{
						id: "agent-stream-alice-1",
						userId: seller.id,
						threadId: "thread-a",
						payload: {
							id: "agent-input-alice-1",
							role: "user",
							content: "Alpha",
						} satisfies AgentInputItem,
						sort: 1,
					},
					{
						id: "agent-stream-alice-2",
						userId: seller.id,
						threadId: "thread-b",
						payload: {
							id: "agent-input-alice-2",
							role: "user",
							content: "Beta",
						} satisfies AgentInputItem,
						sort: 1,
					},
					{
						id: "agent-stream-bob-1",
						userId: stranger.id,
						threadId: "thread-c",
						payload: {
							id: "agent-input-bob-1",
							role: "user",
							content: "Gamma",
						} satisfies AgentInputItem,
						sort: 1,
					},
				]),
			);

			const deleted = yield* agentStreamDeleteCollectionFx({
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
					.selectFrom("agent_stream")
					.select("id")
					.orderBy("id", "asc")
					.execute(),
			);

			expect(remaining).toEqual([
				{
					id: "agent-stream-bob-1",
				},
			]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
