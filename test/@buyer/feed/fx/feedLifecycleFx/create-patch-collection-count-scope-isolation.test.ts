import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { feedCollectionFx } from "~/buyer/feed/server/fx/feedCollectionFx";
import { feedCountFx } from "~/buyer/feed/server/fx/feedCountFx";
import { feedCreateFx } from "~/buyer/feed/server/fx/feedCreateFx";
import { feedFetchFx } from "~/buyer/feed/server/fx/feedFetchFx";
import { feedPatchFx } from "~/buyer/feed/server/fx/feedPatchFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("feedLifecycleFx", () => {
	it("creates, patches, collects and counts feeds while respecting owner scope", async () => {
		const database = await testabase("feedLifecycle-scope");
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

			const { user: owner } = yield* signUp("feed-owner@test.cz", "Feed Owner");
			const { user: stranger } = yield* signUp("feed-stranger@test.cz", "Feed Stranger");

			const firstFeed = yield* feedCreateFx({
				userId: owner.id,
				type: "search",
				name: "MacBooks",
				query: {
					where: {
						title: "macbook",
					},
				},
			});

			yield* feedCreateFx({
				userId: owner.id,
				type: "user",
				name: "Owner Feed",
				query: {},
			});

			yield* feedCreateFx({
				userId: stranger.id,
				type: "search",
				name: "Stranger Feed",
				query: {},
			});

			const patched = yield* feedPatchFx({
				scope: {
					userId: owner.id,
				},
				query: {
					where: {
						id: firstFeed.id,
					},
				},
				patch: {
					name: "Updated MacBooks",
					query: {
						where: {
							title: "macbook pro",
						},
					},
				},
			});

			const patchedQuery = patched.query;

			expect(patched.name).toBe("Updated MacBooks");
			expect(patchedQuery.where?.title).toBe("macbook pro");

			const foreignPatch = yield* Effect.either(
				feedPatchFx({
					scope: {
						userId: stranger.id,
					},
					query: {
						where: {
							id: firstFeed.id,
						},
					},
					patch: {
						name: "Foreign Patch Attempt",
					},
				}),
			);

			expect(foreignPatch._tag).toBe("Left");

			const fetched = yield* feedFetchFx({
				scope: {
					userId: owner.id,
				},
				where: {
					id: firstFeed.id,
				},
			});

			expect(fetched.name).toBe("Updated MacBooks");

			const collection = yield* feedCollectionFx({
				scope: {
					userId: owner.id,
				},
			});

			expect(collection).toHaveLength(2);
			expect(collection.every((item) => item.userId === owner.id)).toBe(true);

			const count = yield* feedCountFx({
				scope: {
					userId: owner.id,
				},
			});

			expect(count.where).toBe(2);

			const foreignFetch = yield* Effect.either(
				feedFetchFx({
					scope: {
						userId: stranger.id,
					},
					where: {
						id: firstFeed.id,
					},
				}),
			);

			expect(foreignFetch._tag).toBe("Left");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
