import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { galleryCollectionFx } from "~/user-gallery/fx/galleryCollectionFx";
import { galleryCountFx } from "~/user-gallery/fx/galleryCountFx";
import { galleryInsertFx } from "~/user-gallery/fx/galleryInsertFx";

describe("galleryCollectionFx", () => {
	it("returns scoped galleries and stays consistent with count and empty state", async () => {
		const database = await testabaseFn("galleryCollectionFx-contract");

		return Effect.gen(function* () {
			const { seller, buyer, stranger } = yield* createUsersFx({});

			const sellerFirst = yield* galleryInsertFx({
				access: "private",
				userId: seller.id,
			});
			const sellerSecond = yield* galleryInsertFx({
				access: "private",
				userId: seller.id,
			});
			yield* galleryInsertFx({
				access: "private",
				userId: buyer.id,
			});

			const sellerCollection = yield* galleryCollectionFx({
				scope: {
					userId: seller.id,
				},
				cursor: {
					page: 0,
					size: 10,
				},
			});
			const sellerCount = yield* galleryCountFx({
				scope: {
					userId: seller.id,
				},
			});
			const strangerCollection = yield* galleryCollectionFx({
				scope: {
					userId: stranger.id,
				},
				cursor: {
					page: 0,
					size: 10,
				},
			});
			const strangerCount = yield* galleryCountFx({
				scope: {
					userId: stranger.id,
				},
			});

			expect(sellerCollection).toHaveLength(2);
			expect(sellerCollection.map((gallery) => gallery.id).sort()).toEqual(
				[
					sellerFirst.id,
					sellerSecond.id,
				].sort(),
			);
			expect(sellerCount).toBe(2);
			expect(strangerCollection).toEqual([]);
			expect(strangerCount).toBe(0);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
