import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { agentUsageCreateFx } from "~/user/agent/server/fx/agentUsageCreateFx";

describe("agentUsageCreateFx", () => {
	it("creates scoped agent usage rows with timestamps", async () => {
		const database = await testabase("agentUsageCreateFx-contract");

		return Effect.gen(function* () {
			const { seller } = yield* createUsersFx({});
			const now = new Date("2026-01-01T00:00:00.000Z");

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("agent_thread")
					.values({
						id: "thread-a",
						userId: seller.id,
						createdAt: now,
						updatedAt: now,
						archivedAt: null,
					})
					.execute(),
			);

			yield* agentUsageCreateFx({
				userId: seller.id,
				threadId: "thread-a",
				requests: 1,
				input: 1,
				output: 2,
				total: 3,
			});

			yield* agentUsageCreateFx({
				userId: seller.id,
				threadId: "thread-a",
				requests: 2,
				input: 4,
				output: 5,
				total: 9,
			});

			const rows = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("agent_usage")
					.select([
						"id",
						"createdAt",
						"requests",
						"input",
						"output",
						"total",
						"threadId",
					])
					.where("userId", "=", seller.id)
					.orderBy("createdAt", "asc")
					.execute(),
			);

			expect(rows).toHaveLength(2);
			expect(rows[0]?.createdAt).toBeInstanceOf(Date);
			expect(rows[1]?.createdAt).toBeInstanceOf(Date);
			expect(rows[0]?.requests).toBe(1);
			expect(rows[1]?.requests).toBe(2);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
