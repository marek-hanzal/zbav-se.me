import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { testUploadUrl } from "~/test/common/fn/testUploadUrl";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { galleryInsertFx } from "~/user/gallery/server/fx/galleryInsertFx";
import { galleryItemCollectionFx } from "~/user/gallery-item/server/fx/galleryItemCollectionFx";
import { galleryItemCountFx } from "~/user/gallery-item/server/fx/galleryItemCountFx";
import { galleryItemFetchFx } from "~/user/gallery-item/server/fx/galleryItemFetchFx";
import { galleryItemInsertFx } from "~/user/gallery-item/server/fx/galleryItemInsertFx";
import { uploadCreateFx } from "~/user/upload/server/fx/uploadCreateFx";

describe("galleryItemCollectionFx", () => {
	it("filters by gallery, owner scope and ids while keeping count consistent", async () => {
		const database = await testabase("galleryItemCollectionFx-contract");

		return Effect.gen(function* () {
			const { seller, buyer, stranger } = yield* createUsersFx({});

			const sellerFirstUpload = yield* uploadCreateFx({
				access: "private",
				userId: seller.id,
				url: testUploadUrl("gallery-item-collection-1.jpg"),
			});
			const sellerSecondUpload = yield* uploadCreateFx({
				access: "private",
				userId: seller.id,
				url: testUploadUrl("gallery-item-collection-2.jpg"),
			});
			const buyerUpload = yield* uploadCreateFx({
				access: "private",
				userId: buyer.id,
				url: testUploadUrl("gallery-item-collection-3.jpg"),
			});

			const sellerGallery = yield* galleryInsertFx({
				access: "private",
				userId: seller.id,
			});
			const buyerGallery = yield* galleryInsertFx({
				access: "private",
				userId: buyer.id,
			});

			const sellerLaterItem = yield* galleryItemInsertFx({
				galleryId: sellerGallery.id,
				sort: 2,
				uploadId: sellerSecondUpload.id,
				userId: seller.id,
			});
			const sellerEarlierItem = yield* galleryItemInsertFx({
				galleryId: sellerGallery.id,
				sort: 1,
				uploadId: sellerFirstUpload.id,
				userId: seller.id,
			});
			yield* galleryItemInsertFx({
				galleryId: buyerGallery.id,
				sort: 1,
				uploadId: buyerUpload.id,
				userId: buyer.id,
			});

			const sellerItems = yield* galleryItemCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					galleryId: sellerGallery.id,
				},
				sort: [
					{
						field: "sort",
						order: "asc",
					},
				],
			});
			const filteredByIds = yield* galleryItemCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					galleryId: sellerGallery.id,
					idIn: [
						sellerLaterItem.id,
						"missing-gallery-item-id",
					],
				},
			});
			const sellerCount = yield* galleryItemCountFx({
				scope: {
					userId: seller.id,
				},
				where: {
					galleryId: sellerGallery.id,
				},
			});
			const fetched = yield* galleryItemFetchFx({
				scope: {
					userId: seller.id,
				},
				where: {
					id: sellerEarlierItem.id,
				},
			});
			const strangerItems = yield* galleryItemCollectionFx({
				scope: {
					userId: stranger.id,
				},
				where: {
					galleryId: sellerGallery.id,
				},
			});
			const buyerOwnItems = yield* galleryItemCollectionFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					galleryId: buyerGallery.id,
				},
			});

			expect(sellerItems.map((item) => item.id)).toEqual([
				sellerEarlierItem.id,
				sellerLaterItem.id,
			]);
			expect(sellerItems.map((item) => item.upload.id)).toEqual([
				sellerFirstUpload.id,
				sellerSecondUpload.id,
			]);
			expect(filteredByIds).toHaveLength(1);
			expect(filteredByIds[0]?.id).toBe(sellerLaterItem.id);
			expect(sellerCount).toBe(2);
			expect(fetched.id).toBe(sellerEarlierItem.id);
			expect(fetched.upload.id).toBe(sellerFirstUpload.id);
			expect(strangerItems).toEqual([]);
			expect(buyerOwnItems).toHaveLength(1);
			expect(buyerOwnItems[0]?.upload.id).toBe(buyerUpload.id);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
