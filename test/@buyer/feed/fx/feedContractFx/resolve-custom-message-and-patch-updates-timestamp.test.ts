import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { feedCreateFx } from "~/buyer/feed/server/fx/feedCreateFx";
import { feedPatchFx } from "~/buyer/feed/server/fx/feedPatchFx";
import { feedResolveFx } from "~/buyer/feed/server/fx/feedResolveFx";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("feed contract", () => {
	it("supports custom resolve denial message and advances updatedAt on patch", async () => {
		const database = await testabase("feed-contract-resolve-patch");

		return Effect.gen(function* () {
			const { seller: owner, stranger } = yield* createUsersFx({});

			const feed = yield* feedCreateFx({
				userId: owner.id,
				type: "search",
				name: "Original Feed",
				query: {
					where: {
						// title: "old-title",
					},
				},
			});
			const beforePatch = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("feed")
					.select("updatedAt")
					.where("id", "=", feed.id)
					.executeTakeFirstOrThrow(),
			);

			const patched = yield* feedPatchFx({
				scope: {
					userId: owner.id,
				},
				query: {
					where: {
						id: feed.id,
					},
				},
				patch: {
					name: "Patched Feed",
					query: {
						where: {
							// title: "new-title",
						},
					},
				},
			});
			const afterPatch = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("feed")
					.select("updatedAt")
					.where("id", "=", feed.id)
					.executeTakeFirstOrThrow(),
			);
			const foreignResolve = yield* Effect.either(
				feedResolveFx({
					userId: stranger.id,
					feedId: feed.id,
					message: "Custom deny message",
				}),
			);

			expect(patched.name).toBe("Patched Feed");
			// expect(patched.query.where?.title).toBe("new-title");
			expect(afterPatch.updatedAt.getTime()).toBeGreaterThanOrEqual(
				beforePatch.updatedAt.getTime(),
			);
			expectTaggedErrorFx(foreignResolve, {
				tag: "NotFoundErrorFx",
				message: "Resource not found",
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
