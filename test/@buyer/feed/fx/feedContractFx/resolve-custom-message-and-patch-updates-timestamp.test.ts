import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { feedCreateFx } from "~/buyer-feed/fx/feedCreateFx";
import { feedPatchFx } from "~/buyer-feed/fx/feedPatchFx";
import { feedResolveFx } from "~/buyer-feed/fx/feedResolveFx";
import { expectTaggedErrorFn } from "~/test/common/fx/expectTaggedErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("feed contract", () => {
	it("supports custom resolve denial message and advances updatedAt on patch", async () => {
		const database = await testabaseFn("feed-contract-resolve-patch");

		return Effect.gen(function* () {
			const { seller: owner, stranger } = yield* createUsersFx({});

			const feed = yield* feedCreateFx({
				userId: owner.id,
				type: "search",
				name: "Original Feed",
				query: {
					where: {
						fulltext: [
							"old-title",
						],
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
							fulltext: [
								"new-title",
							],
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
			const foreignResolve = yield* Effect.result(
				feedResolveFx({
					userId: stranger.id,
					feedId: feed.id,
					message: "Custom deny message",
				}),
			);

			expect(patched.name).toBe("Patched Feed");
			expect(patched.query.where?.fulltext).toEqual([
				"new-title",
			]);
			expect(afterPatch.updatedAt.getTime()).toBeGreaterThanOrEqual(
				beforePatch.updatedAt.getTime(),
			);
			expectTaggedErrorFn(foreignResolve, {
				tag: "AccessDeniedErrorFx",
				message: "Custom deny message",
			});
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
