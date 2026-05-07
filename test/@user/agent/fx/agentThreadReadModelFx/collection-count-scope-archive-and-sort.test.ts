import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { agentThreadCollectionFx } from "~/user/agent/server/fx/agentThreadCollectionFx";
import { agentThreadCountFx } from "~/user/agent/server/fx/agentThreadCountFx";

type TestDatabase = Awaited<ReturnType<typeof testabase>>;

type AgentThreadSeedRow = {
	id: string;
	userId: string;
	createdAt: Date;
	updatedAt: Date;
	archivedAt: Date | null;
};

const seedAgentThreadsFx = (database: TestDatabase, rows: AgentThreadSeedRow[]) =>
	Effect.promise(() => database.kysely.insertInto("agent_thread").values(rows).execute());

describe("agentThread read model", () => {
	it("filters by user and archived state and keeps count aligned with collection order", async () => {
		const database = await testabase("agent-thread-read-model-contract");

		return Effect.gen(function* () {
			const { seller, stranger } = yield* createUsersFx({});

			yield* seedAgentThreadsFx(database, [
				{
					id: "agent-thread-active-older",
					userId: seller.id,
					createdAt: new Date("2026-02-01T10:00:00.000Z"),
					updatedAt: new Date("2026-02-01T10:00:00.000Z"),
					archivedAt: null,
				},
				{
					id: "agent-thread-active-newer",
					userId: seller.id,
					createdAt: new Date("2026-02-01T11:00:00.000Z"),
					updatedAt: new Date("2026-02-01T12:00:00.000Z"),
					archivedAt: null,
				},
				{
					id: "agent-thread-archived",
					userId: seller.id,
					createdAt: new Date("2026-02-01T09:00:00.000Z"),
					updatedAt: new Date("2026-02-01T09:30:00.000Z"),
					archivedAt: new Date("2026-02-01T13:00:00.000Z"),
				},
				{
					id: "agent-thread-foreign",
					userId: stranger.id,
					createdAt: new Date("2026-02-01T08:00:00.000Z"),
					updatedAt: new Date("2026-02-01T14:00:00.000Z"),
					archivedAt: null,
				},
			]);

			const activeThreads = yield* agentThreadCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					archivedAt: "active",
				},
				sort: [
					{
						field: "updatedAt",
						order: "desc",
					},
				],
			});
			const archivedThreads = yield* agentThreadCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					archivedAt: "archived",
				},
			});
			const anyThreadsByIdSubset = yield* agentThreadCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					idIn: [
						"agent-thread-active-older",
						"agent-thread-archived",
						"agent-thread-foreign",
					],
					archivedAt: "any",
				},
				sort: [
					{
						field: "createdAt",
						order: "asc",
					},
				],
			});
			const activeCount = yield* agentThreadCountFx({
				scope: {
					userId: seller.id,
				},
				where: {
					archivedAt: "active",
				},
			});
			const archivedCount = yield* agentThreadCountFx({
				scope: {
					userId: seller.id,
				},
				where: {
					archivedAt: "archived",
				},
			});

			expect(activeThreads.map((item) => item.id)).toEqual([
				"agent-thread-active-newer",
				"agent-thread-active-older",
			]);
			expect(archivedThreads.map((item) => item.id)).toEqual([
				"agent-thread-archived",
			]);
			expect(anyThreadsByIdSubset.map((item) => item.id)).toEqual([
				"agent-thread-archived",
				"agent-thread-active-older",
			]);
			expect(activeCount).toBe(activeThreads.length);
			expect(archivedCount).toBe(archivedThreads.length);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
