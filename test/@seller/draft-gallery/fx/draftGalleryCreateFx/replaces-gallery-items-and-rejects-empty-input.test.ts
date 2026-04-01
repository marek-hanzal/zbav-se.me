import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { draftCreateFx } from "~/seller/draft/server/fx/draftCreateFx";
import { draftGalleryCreateFx } from "~/seller/draft-gallery/server/fx/draftGalleryCreateFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";
import { uploadCreateFx } from "~/user/upload/server/fx/uploadCreateFx";

describe("draftGalleryCreateFx", () => {
	it("replaces gallery items and rejects empty upload input", async () => {
		const database = await testabase("draftGalleryCreateFx-replace");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const { user } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "draft-gallery-user@test.cz",
						name: "Draft Gallery User",
						password: "12345678",
					},
				}),
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
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
