import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { agentThreadPatchFx } from "~/user/agent/server/fx/agentThreadPatchFx";

describe("agentThreadPatchFx", () => {
	it("bumps updatedAt for an empty patch", async () => {
		const database = await testabase("agentThreadPatchFx-empty-patch");

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
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
