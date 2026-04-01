import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { feedCreateFx } from "~/buyer/feed/server/fx/feedCreateFx";
import { feedDeleteFx } from "~/buyer/feed/server/fx/feedDeleteFx";
import { feedFetchFx } from "~/buyer/feed/server/fx/feedFetchFx";
import { feedResolveFx } from "~/buyer/feed/server/fx/feedResolveFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("feedLifecycleFx", () => {
	it("resolves for owner, rejects foreign access, and deletes feed cleanly", async () => {
		const database = await testabase("feedLifecycle-access");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const signUp = (email: string, name: string) =>
				Effect.promise(() =>
					api.signUpEmail({
						body: {
							email,
							name,
							password: "12345678",
						},
					}),
				);

			const { user: owner } = yield* signUp("feed-owner-2@test.cz", "Feed Owner");
			const { user: stranger } = yield* signUp("feed-stranger-2@test.cz", "Feed Stranger");

			const feed = yield* feedCreateFx({
				userId: owner.id,
				type: "search",
				name: "To Delete",
				query: {},
			});

			const resolved = yield* feedResolveFx({
				userId: owner.id,
				feedId: feed.id,
			});

			expect(resolved.id).toBe(feed.id);

			const foreignResolution = yield* Effect.either(
				feedResolveFx({
					userId: stranger.id,
					feedId: feed.id,
				}),
			);

			expect(foreignResolution._tag).toBe("Left");

			const deleted = yield* feedDeleteFx({
				scope: {
					userId: owner.id,
				},
				where: {
					id: feed.id,
				},
			});

			expect(deleted.id).toBe(feed.id);

			const missing = yield* Effect.either(
				feedFetchFx({
					scope: {
						userId: owner.id,
					},
					where: {
						id: feed.id,
					},
				}),
			);

			expect(missing._tag).toBe("Left");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
