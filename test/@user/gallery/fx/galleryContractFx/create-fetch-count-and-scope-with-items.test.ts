import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { testUploadUrl } from "~/test/common/fn/testUploadUrl";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { galleryCountFx } from "~/user/gallery/server/fx/galleryCountFx";
import { galleryCreateFx } from "~/user/gallery/server/fx/galleryCreateFx";
import { galleryFetchFx } from "~/user/gallery/server/fx/galleryFetchFx";
import { galleryItemInsertFx } from "~/user/gallery-item/server/fx/galleryItemInsertFx";
import { uploadCreateFx } from "~/user/upload/server/fx/uploadCreateFx";

describe("gallery contract fx", () => {
	it("creates a scoped gallery, fetches nested items in order, and keeps count isolated", async () => {
		const database = await testabase("gallery-contract-create-fetch-count");

		return Effect.gen(function* () {
			const { seller, buyer } = yield* createUsersFx({});

			const firstUpload = yield* uploadCreateFx({
				userId: seller.id,
				access: "private",
				url: testUploadUrl("gallery-contract-first.jpg"),
			});
			const secondUpload = yield* uploadCreateFx({
				userId: seller.id,
				access: "private",
				url: testUploadUrl("gallery-contract-second.jpg"),
			});
			const foreignUpload = yield* uploadCreateFx({
				userId: buyer.id,
				access: "private",
				url: testUploadUrl("gallery-contract-foreign.jpg"),
			});

			const created = yield* galleryCreateFx({
				access: "private",
				userId: seller.id,
			});

			yield* galleryItemInsertFx({
				galleryId: created.id,
				uploadId: secondUpload.id,
				sort: 1,
				userId: seller.id,
				check: false,
			});
			yield* galleryItemInsertFx({
				galleryId: created.id,
				uploadId: firstUpload.id,
				sort: 0,
				userId: seller.id,
				check: false,
			});

			const foreignGallery = yield* galleryCreateFx({
				access: "private",
				userId: buyer.id,
			});
			yield* galleryItemInsertFx({
				galleryId: foreignGallery.id,
				uploadId: foreignUpload.id,
				sort: 0,
				userId: buyer.id,
				check: false,
			});

			const fetched = yield* galleryFetchFx({
				scope: {
					userId: seller.id,
				},
				where: {
					id: created.id,
				},
			});
			const sellerCount = yield* galleryCountFx({
				scope: {
					userId: seller.id,
				},
			});
			const buyerCount = yield* galleryCountFx({
				scope: {
					userId: buyer.id,
				},
			});

			expect(created.items).toEqual([]);
			expect(fetched.id).toBe(created.id);
			expect(fetched.items.map((item) => item.uploadId)).toEqual([
				firstUpload.id,
				secondUpload.id,
			]);
			expect(fetched.items.map((item) => item.sort)).toEqual([
				0,
				1,
			]);
			expect(sellerCount).toBe(1);
			expect(buyerCount).toBe(1);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
