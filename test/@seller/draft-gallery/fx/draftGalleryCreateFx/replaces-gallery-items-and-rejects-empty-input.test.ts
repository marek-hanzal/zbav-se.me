import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { draftCreateFx } from "~/seller/draft/server/fx/draftCreateFx";
import { draftGalleryCreateFx } from "~/seller/draft-gallery/server/fx/draftGalleryCreateFx";
import { testUploadUrl } from "~/test/common/fn/testUploadUrl";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { uploadCreateFx } from "~/user/upload/server/fx/uploadCreateFx";

describe("draftGalleryCreateFx", () => {
	it("replaces gallery items and rejects empty upload input", async () => {
		const database = await testabase("draftGalleryCreateFx-replace");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});
			const stranger = yield* leaseTestUserFx({});

			const firstUpload = yield* uploadCreateFx({
				userId: user.id,
				url: testUploadUrl("draft-gallery-1.jpg"),
			});
			const secondUpload = yield* uploadCreateFx({
				userId: user.id,
				url: testUploadUrl("draft-gallery-2.jpg"),
			});
			const thirdUpload = yield* uploadCreateFx({
				userId: user.id,
				url: testUploadUrl("draft-gallery-3.jpg"),
			});
			const strangerUpload = yield* uploadCreateFx({
				userId: stranger.id,
				url: testUploadUrl("draft-gallery-stranger.jpg"),
			});

			const draft = yield* draftCreateFx({
				userId: user.id,
				title: "Draft gallery",
				uploadIds: [
					firstUpload.id,
					secondUpload.id,
				],
			});

			const replacedGallery = yield* draftGalleryCreateFx({
				userId: user.id,
				draftId: draft.id,
				uploadIds: [
					thirdUpload.id,
				],
			});

			expect(replacedGallery.items.map((item) => item.uploadId)).toEqual([
				thirdUpload.id,
			]);

			const storedItems = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("gallery_item")
					.select([
						"uploadId",
						"sort",
					])
					.where("galleryId", "=", draft.galleryId)
					.orderBy("sort", "asc")
					.execute(),
			);

			expect(storedItems).toEqual([
				{
					uploadId: thirdUpload.id,
					sort: 0,
				},
			]);

			const emptyResult = yield* Effect.either(
				draftGalleryCreateFx({
					userId: user.id,
					draftId: draft.id,
					uploadIds: [],
				}),
			);

			expectTaggedErrorFx(emptyResult, {
				tag: "InvalidRequestErrorFx",
				message: "At least one upload is required",
			});

			const itemsAfterEmptyAttempt = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("gallery_item")
					.select([
						"uploadId",
						"sort",
					])
					.where("galleryId", "=", draft.galleryId)
					.orderBy("sort", "asc")
					.execute(),
			);

			expect(itemsAfterEmptyAttempt).toEqual([
				{
					uploadId: thirdUpload.id,
					sort: 0,
				},
			]);

			const foreignAttempt = yield* Effect.either(
				draftGalleryCreateFx({
					userId: stranger.id,
					draftId: draft.id,
					uploadIds: [
						strangerUpload.id,
					],
				}),
			);

			expectTaggedErrorFx(foreignAttempt, {
				tag: "AccessDeniedErrorFx",
				message: "You are not allowed to create a gallery for this draft",
			});

			const itemsAfterForeignAttempt = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("gallery_item")
					.select([
						"uploadId",
						"sort",
					])
					.where("galleryId", "=", draft.galleryId)
					.orderBy("sort", "asc")
					.execute(),
			);

			expect(itemsAfterForeignAttempt).toEqual([
				{
					uploadId: thirdUpload.id,
					sort: 0,
				},
			]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
