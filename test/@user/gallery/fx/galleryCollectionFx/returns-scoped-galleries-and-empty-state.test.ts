import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { galleryCollectionFx } from "~/user/gallery/server/fx/galleryCollectionFx";
import { galleryCountFx } from "~/user/gallery/server/fx/galleryCountFx";
import { galleryInsertFx } from "~/user/gallery/server/fx/galleryInsertFx";

describe("galleryCollectionFx", () => {
	it("returns scoped galleries and stays consistent with count and empty state", async () => {
		const database = await testabase("galleryCollectionFx-contract");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const { seller, buyer, stranger } = yield* createUsersFx({
				api,
				slug: "gallery-collection-contract",
			});

			const sellerFirst = yield* galleryInsertFx({
				userId: seller.id,
			});
			const sellerSecond = yield* galleryInsertFx({
				userId: seller.id,
			});
			yield* galleryInsertFx({
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
			expect(sellerCount.total).toBe(2);
			expect(sellerCount.where).toBe(2);
			expect(sellerCount.filter).toBe(2);
			expect(typeof sellerCount.total).toBe("number");
			expect(strangerCollection).toEqual([]);
			expect(strangerCount.total).toBe(0);
			expect(strangerCount.isEmpty).toBe(true);
			expect(typeof strangerCount.total).toBe("number");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
