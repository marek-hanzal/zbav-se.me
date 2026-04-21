import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { agentThreadCreateSessionFx } from "~/user/agent/server/fx/agentThreadCreateSessionFx";

describe("agentThreadCreateSessionFx", () => {
	it("archives all user threads and creates a new active thread", async () => {
		const database = await testabase("agentThreadCreateSessionFx-flow");

		return Effect.gen(function* () {
			const { seller, stranger } = yield* createUsersFx({});
			const now = new Date("2026-01-01T00:00:00.000Z");

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("agent_thread")
					.values([
						{
							id: "agent-thread-session-active",
							userId: seller.id,
							createdAt: now,
							updatedAt: now,
							archivedAt: null,
						},
						{
							id: "agent-thread-session-archived",
							userId: seller.id,
							createdAt: now,
							updatedAt: now,
							archivedAt: now,
						},
						{
							id: "agent-thread-session-foreign",
							userId: stranger.id,
							createdAt: now,
							updatedAt: now,
							archivedAt: null,
						},
					])
					.execute(),
			);

			const thread = yield* agentThreadCreateSessionFx({
				userId: seller.id,
			});

			const rows = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("agent_thread")
					.select([
						"id",
						"userId",
						"archivedAt",
					])
					.orderBy("id", "asc")
					.execute(),
			);
			const sellerRows = rows.filter((row) => row.userId === seller.id);
			const activeSellerRows = sellerRows.filter((row) => row.archivedAt === null);

			expect(thread.userId).toBe(seller.id);
			expect(activeSellerRows).toEqual([
				{
					id: thread.id,
					userId: seller.id,
					archivedAt: null,
				},
			]);
			expect(
				rows.find((row) => row.id === "agent-thread-session-foreign")?.archivedAt,
			).toBeNull();
			expect(
				rows.find((row) => row.id === "agent-thread-session-active")?.archivedAt,
			).toBeInstanceOf(Date);
			expect(
				rows.find((row) => row.id === "agent-thread-session-archived")?.archivedAt,
			).toBeInstanceOf(Date);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
