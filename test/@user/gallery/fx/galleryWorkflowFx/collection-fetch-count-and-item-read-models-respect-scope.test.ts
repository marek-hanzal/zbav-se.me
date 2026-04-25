import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { draftCreateFx } from "~/seller/draft/server/fx/draftCreateFx";
import { testUploadUrl } from "~/test/common/fn/testUploadUrl";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { galleryCollectionFx } from "~/user/gallery/server/fx/galleryCollectionFx";
import { galleryCountFx } from "~/user/gallery/server/fx/galleryCountFx";
import { galleryFetchFx } from "~/user/gallery/server/fx/galleryFetchFx";
import { galleryItemCollectionFx } from "~/user/gallery-item/server/fx/galleryItemCollectionFx";
import { galleryItemCountFx } from "~/user/gallery-item/server/fx/galleryItemCountFx";
import { galleryItemFetchFx } from "~/user/gallery-item/server/fx/galleryItemFetchFx";
import { uploadCreateFx } from "~/user/upload/server/fx/uploadCreateFx";

describe("gallery workflow", () => {
	it("gallery and gallery-item read models preserve item order for the owner", async () => {
		const database = await testabase("galleryWorkflowFx-owner");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});

			const firstUpload = yield* uploadCreateFx({
				access: "private",
				userId: seller.id,
				url: testUploadUrl("gallery-workflow-1.jpg"),
			});
			const secondUpload = yield* uploadCreateFx({
				access: "private",
				userId: seller.id,
				url: testUploadUrl("gallery-workflow-2.jpg"),
			});

			const draft = yield* draftCreateFx({
				userId: seller.id,
				title: "Gallery workflow draft",
				uploadIds: [
					firstUpload.id,
					secondUpload.id,
				],
			});

			const galleryCollection = yield* galleryCollectionFx({
				scope: {
					userId: seller.id,
				},
			});
			expect(galleryCollection.map((item) => item.id)).toContain(draft.galleryId);

			const gallery = yield* galleryFetchFx({
				scope: {
					userId: seller.id,
				},
				where: {
					id: draft.galleryId,
				},
			});
			expect(gallery.items.map((item) => item.uploadId)).toEqual([
				firstUpload.id,
				secondUpload.id,
			]);
			expect(gallery.items).toHaveLength(2);

			const firstGalleryItem = gallery.items[0];
			if (!firstGalleryItem) {
				throw new Error("Expected gallery to contain at least one item");
			}

			const galleryCount = yield* galleryCountFx({
				scope: {
					userId: seller.id,
				},
			});
			expect(galleryCount).toBe(1);

			const itemCollection = yield* galleryItemCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					galleryId: draft.galleryId,
				},
			});
			expect(itemCollection.map((item) => item.id)).toEqual(
				gallery.items.map((item) => item.id),
			);

			const itemCount = yield* galleryItemCountFx({
				scope: {
					userId: seller.id,
				},
				where: {
					galleryId: draft.galleryId,
				},
			});
			expect(itemCount).toBe(2);

			const firstItem = yield* galleryItemFetchFx({
				scope: {
					userId: seller.id,
				},
				where: {
					id: firstGalleryItem.id,
				},
			});
			expect(firstItem.uploadId).toBe(firstUpload.id);
			expect(firstItem.sort).toBe(0);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});

	it("gallery and gallery-item read models keep foreign users out", async () => {
		const database = await testabase("galleryWorkflowFx-foreign");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const stranger = yield* leaseTestUserFx({});

			const upload = yield* uploadCreateFx({
				access: "private",
				userId: seller.id,
				url: testUploadUrl("gallery-workflow-foreign.jpg"),
			});

			const draft = yield* draftCreateFx({
				userId: seller.id,
				title: "Gallery workflow foreign draft",
				uploadIds: [
					upload.id,
				],
			});

			const gallery = yield* galleryFetchFx({
				scope: {
					userId: seller.id,
				},
				where: {
					id: draft.galleryId,
				},
			});
			const firstGalleryItem = gallery.items[0];
			if (!firstGalleryItem) {
				throw new Error("Expected gallery to contain at least one item");
			}

			const strangerGalleryFetch = yield* Effect.either(
				galleryFetchFx({
					scope: {
						userId: stranger.id,
					},
					where: {
						id: draft.galleryId,
					},
				}),
			);
			const strangerItemFetch = yield* Effect.either(
				galleryItemFetchFx({
					scope: {
						userId: stranger.id,
					},
					where: {
						id: firstGalleryItem.id,
					},
				}),
			);
			const strangerGalleryCollection = yield* galleryCollectionFx({
				scope: {
					userId: stranger.id,
				},
			});
			const strangerGalleryCount = yield* galleryCountFx({
				scope: {
					userId: stranger.id,
				},
			});
			const strangerItemCollection = yield* galleryItemCollectionFx({
				scope: {
					userId: stranger.id,
				},
				where: {
					galleryId: draft.galleryId,
				},
			});
			const strangerItemCount = yield* galleryItemCountFx({
				scope: {
					userId: stranger.id,
				},
				where: {
					galleryId: draft.galleryId,
				},
			});

			expectTaggedErrorFx(strangerGalleryFetch, {
				tag: "NotFoundErrorFx",
			});
			expectTaggedErrorFx(strangerItemFetch, {
				tag: "NotFoundErrorFx",
			});
			expect(strangerGalleryCollection).toHaveLength(0);
			expect(strangerGalleryCount).toBe(0);
			expect(strangerItemCollection).toHaveLength(0);
			expect(strangerItemCount).toBe(0);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
