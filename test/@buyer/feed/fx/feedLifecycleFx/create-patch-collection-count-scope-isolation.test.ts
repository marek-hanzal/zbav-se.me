import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { feedCollectionFx } from "~/buyer-feed/fx/feedCollectionFx";
import { feedCountFx } from "~/buyer-feed/fx/feedCountFx";
import { feedCreateFx } from "~/buyer-feed/fx/feedCreateFx";
import { feedFetchFx } from "~/buyer-feed/fx/feedFetchFx";
import { feedPatchFx } from "~/buyer-feed/fx/feedPatchFx";
import { expectTaggedErrorFn } from "~/test/common/fx/expectTaggedErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("feedLifecycleFx", () => {
	it("creates, patches, collects and counts feeds while respecting owner scope", async () => {
		const database = await testabaseFn("feedLifecycle-scope");

		return Effect.gen(function* () {
			const owner = yield* leaseTestUserFx({});
			const stranger = yield* leaseTestUserFx({});

			const firstFeed = yield* feedCreateFx({
				userId: owner.id,
				type: "search",
				name: "MacBooks",
				query: {
					where: {
						fulltext: [
							"macbook",
						],
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
							fulltext: [
								"macbook pro",
							],
						},
					},
				},
			});

			expect(patched.name).toBe("Updated MacBooks");
			expect(patched.query.where?.fulltext).toEqual([
				"macbook pro",
			]);

			const foreignPatch = yield* Effect.result(
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

			expectTaggedErrorFn(foreignPatch, {
				tag: "NotFoundErrorFx",
			});

			const fetched = yield* feedFetchFx({
				scope: {
					userId: owner.id,
				},
				where: {
					id: firstFeed.id,
				},
			});

			expect(fetched.name).toBe("Updated MacBooks");
			expect(fetched.query.where?.fulltext).toEqual([
				"macbook pro",
			]);

			const collection = yield* feedCollectionFx({
				scope: {
					userId: owner.id,
				},
			});

			expect(collection).toHaveLength(3);
			expect(collection.every((item) => item.userId === owner.id)).toBe(true);

			const count = yield* feedCountFx({
				scope: {
					userId: owner.id,
				},
			});

			expect(count).toBe(3);

			const foreignFetch = yield* Effect.result(
				feedFetchFx({
					scope: {
						userId: stranger.id,
					},
					where: {
						id: firstFeed.id,
					},
				}),
			);

			expectTaggedErrorFn(foreignFetch, {
				tag: "NotFoundErrorFx",
			});
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
