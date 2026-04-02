import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { draftCreateFx } from "~/seller/draft/server/fx/draftCreateFx";
import { draftGalleryCreateFx } from "~/seller/draft-gallery/server/fx/draftGalleryCreateFx";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { uploadCreateFx } from "~/user/upload/server/fx/uploadCreateFx";

describe("draftGalleryCreateFx", () => {
	it("replaces gallery items and rejects empty upload input", async () => {
		const database = await testabase("draftGalleryCreateFx-replace");
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

			const { user } = yield* signUp("draft-gallery-user@test.cz", "Draft Gallery User");
			const { user: stranger } = yield* signUp(
				"draft-gallery-stranger@test.cz",
				"Draft Gallery Stranger",
			);

			const firstUpload = yield* uploadCreateFx({
				userId: user.id,
				url: "https://cdn.zbav-se.me/draft-gallery-1.jpg",
			});
			const secondUpload = yield* uploadCreateFx({
				userId: user.id,
				url: "https://cdn.zbav-se.me/draft-gallery-2.jpg",
			});
			const thirdUpload = yield* uploadCreateFx({
				userId: user.id,
				url: "https://cdn.zbav-se.me/draft-gallery-3.jpg",
			});
			const strangerUpload = yield* uploadCreateFx({
				userId: stranger.id,
				url: "https://cdn.zbav-se.me/draft-gallery-stranger.jpg",
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

			expect(emptyResult._tag).toBe("Left");

			const foreignAttempt = yield* Effect.either(
				draftGalleryCreateFx({
					userId: stranger.id,
					draftId: draft.id,
					uploadIds: [
						strangerUpload.id,
					],
				}),
			);

			expect(foreignAttempt._tag).toBe("Left");

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
