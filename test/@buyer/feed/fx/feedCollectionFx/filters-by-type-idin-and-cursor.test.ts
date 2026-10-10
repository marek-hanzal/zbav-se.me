import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { feedCollectionFx } from "~/buyer-feed/fx/feedCollectionFx";
import { feedCountFx } from "~/buyer-feed/fx/feedCountFx";
import { feedCreateFx } from "~/buyer-feed/fx/feedCreateFx";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("feedCollectionFx", () => {
	it("filters by type and idIn, paginates with cursor and keeps count scoped", async () => {
		const database = await testabaseFn("feedCollectionFx-contract");

		return Effect.gen(function* () {
			const { seller: owner, stranger } = yield* createUsersFx({});

			const searchFeed = yield* feedCreateFx({
				userId: owner.id,
				type: "search",
				name: "Search Feed",
				query: {
					where: {
						// title: "macbook",
					},
				},
			});
			const userFeed = yield* feedCreateFx({
				userId: owner.id,
				type: "user",
				name: "User Feed",
				query: {},
			});
			yield* feedCreateFx({
				userId: stranger.id,
				type: "search",
				name: "Stranger Feed",
				query: {},
			});

			const byType = yield* feedCollectionFx({
				scope: {
					userId: owner.id,
				},
				where: {
					type: "search",
				},
			});
			const byIds = yield* feedCollectionFx({
				scope: {
					userId: owner.id,
				},
				where: {
					idIn: [
						userFeed.id,
						"missing-feed-id",
					],
				},
			});
			const firstPage = yield* feedCollectionFx({
				scope: {
					userId: owner.id,
				},
				sort: [
					{
						field: "createdAt",
						order: "asc",
					},
				],
				cursor: {
					page: 0,
					size: 1,
				},
			});
			const secondPage = yield* feedCollectionFx({
				scope: {
					userId: owner.id,
				},
				sort: [
					{
						field: "createdAt",
						order: "asc",
					},
				],
				cursor: {
					page: 1,
					size: 1,
				},
			});
			const count = yield* feedCountFx({
				scope: {
					userId: owner.id,
				},
				where: {
					type: "search",
				},
			});

			expect(byType).toHaveLength(1);
			expect(byType[0]?.id).toBe(searchFeed.id);
			expect(byIds).toHaveLength(1);
			expect(byIds[0]?.id).toBe(userFeed.id);
			expect(firstPage).toHaveLength(1);
			expect(secondPage).toHaveLength(1);
			expect(firstPage[0]?.id).not.toBe(secondPage[0]?.id);
			expect(count).toBe(1);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
