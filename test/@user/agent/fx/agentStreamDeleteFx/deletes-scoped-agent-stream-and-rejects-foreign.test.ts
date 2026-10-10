import type { AgentInputItem } from "@openai/agents-core";
import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { expectTaggedErrorFn } from "~/test/common/fx/expectTaggedErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { agentStreamDeleteFx } from "~/user-agent/fx/agentStreamDeleteFx";
import { agentStreamFetchFx } from "~/user-agent/fx/agentStreamFetchFx";

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

describe("agentStreamDeleteFx", () => {
	it("deletes scoped agent stream rows and rejects foreign access", async () => {
		const database = await testabaseFn("agentStreamDeleteFx-contract");

		return Effect.gen(function* () {
			const alice = yield* leaseTestUserFx({});
			const bob = yield* leaseTestUserFx({});

			yield* Effect.promise(() =>
				seedAgentStreamFn(database, [
					{
						id: "agent-stream-alice",
						userId: alice.id,
						threadId: "thread-shared",
						payload: {
							id: "agent-input-alice",
							role: "user",
							content: "Hello from Alice",
						} satisfies AgentInputItem,
						sort: 1,
					},
					{
						id: "agent-stream-bob",
						userId: bob.id,
						threadId: "thread-bob",
						payload: {
							id: "agent-input-bob",
							role: "user",
							content: "Hello from Bob",
						} satisfies AgentInputItem,
						sort: 1,
					},
				]),
			);

			const deleted = yield* agentStreamDeleteFx({
				where: {
					id: "agent-stream-alice",
				},
				scope: {
					userId: alice.id,
				},
			});

			expect(deleted.id).toBe("agent-stream-alice");

			const aliceAfterDelete = yield* Effect.result(
				agentStreamFetchFx({
					where: {
						id: "agent-stream-alice",
					},
					scope: {
						userId: alice.id,
					},
				}),
			);
			const foreignDelete = yield* Effect.result(
				agentStreamDeleteFx({
					where: {
						id: "agent-stream-bob",
					},
					scope: {
						userId: alice.id,
					},
				}),
			);
			const bobStillThere = yield* agentStreamFetchFx({
				where: {
					id: "agent-stream-bob",
				},
				scope: {
					userId: bob.id,
				},
			});

			expectTaggedErrorFn(aliceAfterDelete, {
				tag: "NotFoundErrorFx",
			});
			expectTaggedErrorFn(foreignDelete, {
				tag: "NotFoundErrorFx",
			});
			expect(bobStillThere.id).toBe("agent-stream-bob");
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
