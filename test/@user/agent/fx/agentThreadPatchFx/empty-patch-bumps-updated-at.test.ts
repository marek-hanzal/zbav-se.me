import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { agentThreadPatchFx } from "~/user-agent/fx/agentThreadPatchFx";

describe("agentThreadPatchFx", () => {
	it("bumps updatedAt for an empty patch", async () => {
		const database = await testabaseFn("agentThreadPatchFx-empty-patch");

		return Effect.gen(function* () {
			const { seller } = yield* createUsersFx({});
			const originalDate = new Date("2026-01-01T00:00:00.000Z");

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("agent_thread")
					.values({
						id: "agent-thread-patch-empty",
						userId: seller.id,
						createdAt: originalDate,
						updatedAt: originalDate,
						archivedAt: null,
					})
					.execute(),
			);

			const thread = yield* agentThreadPatchFx({
				query: {
					where: {
						id: "agent-thread-patch-empty",
					},
				},
				patch: {},
				scope: {
					userId: seller.id,
				},
			});

			expect(thread.id).toBe("agent-thread-patch-empty");
			expect(thread.createdAt).toEqual(originalDate);
			expect(thread.updatedAt.getTime()).toBeGreaterThan(originalDate.getTime());
			expect(thread.archivedAt).toBeNull();
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
