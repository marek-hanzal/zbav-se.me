import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { feedCreateFx } from "~/buyer/feed/server/fx/feedCreateFx";
import { feedDeleteFx } from "~/buyer/feed/server/fx/feedDeleteFx";
import { feedFetchFx } from "~/buyer/feed/server/fx/feedFetchFx";
import { feedPatchFx } from "~/buyer/feed/server/fx/feedPatchFx";
import { feedResolveFx } from "~/buyer/feed/server/fx/feedResolveFx";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("feedLifecycleFx", () => {
	it("resolves for owner, rejects foreign access, and deletes feed cleanly", async () => {
		const database = await testabase("feedLifecycle-access");

		return Effect.gen(function* () {
			const owner = yield* leaseTestUserFx({});
			const stranger = yield* leaseTestUserFx({});

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

			expectTaggedErrorFx(foreignResolution, {
				tag: "AccessDeniedErrorFx",
				message: "You are not allowed to access this feed",
			});

			const foreignPatch = yield* Effect.either(
				feedPatchFx({
					scope: {
						userId: stranger.id,
					},
					query: {
						where: {
							id: feed.id,
						},
					},
					patch: {
						name: "Foreign patch attempt",
					},
				}),
			);
			const foreignDelete = yield* Effect.either(
				feedDeleteFx({
					scope: {
						userId: stranger.id,
					},
					where: {
						id: feed.id,
					},
				}),
			);

			expectTaggedErrorFx(foreignPatch, {
				tag: "NotFoundErrorFx",
			});
			expectTaggedErrorFx(foreignDelete, {
				tag: "NotFoundErrorFx",
			});

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

			expectTaggedErrorFx(missing, {
				tag: "NotFoundErrorFx",
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
