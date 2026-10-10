import type { AgentInputItem } from "@openai/agents-core";
import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { agentStreamDeleteCollectionFx } from "~/user-agent/fx/agentStreamDeleteCollectionFx";

const seedAgentStreamFn = async (
	database: Awaited<ReturnType<typeof import("~/test/testabaseFn").testabaseFn>>,
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
		const database = await testabaseFn("agentStreamDeleteCollectionFx-contract");

		return Effect.gen(function* () {
			const { seller, stranger } = yield* createUsersFx({});

			yield* Effect.promise(() =>
				seedAgentStreamFn(database, [
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
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
