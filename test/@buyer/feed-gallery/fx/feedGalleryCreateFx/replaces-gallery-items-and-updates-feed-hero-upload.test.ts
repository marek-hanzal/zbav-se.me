import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { feedCreateFx } from "~/buyer/feed/server/fx/feedCreateFx";
import { feedFetchFx } from "~/buyer/feed/server/fx/feedFetchFx";
import { feedGalleryCreateFx } from "~/buyer/feed-gallery/server/fx/feedGalleryCreateFx";
import { testUploadUrl } from "~/test/common/fn/testUploadUrl";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { uploadCreateFx } from "~/user/upload/server/fx/uploadCreateFx";

describe("feedGalleryCreateFx", () => {
	it("replaces gallery items and updates feed hero upload to the first item", async () => {
		const database = await testabase("feedGalleryCreateFx-replace");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});
			const stranger = yield* leaseTestUserFx({});

			const feed = yield* feedCreateFx({
				userId: user.id,
				type: "search",
				name: "Gallery feed",
				query: {},
			});

			const firstUpload = yield* uploadCreateFx({
				userId: user.id,
				url: testUploadUrl("feed-gallery-1.jpg"),
			});
			const secondUpload = yield* uploadCreateFx({
				userId: user.id,
				url: testUploadUrl("feed-gallery-2.jpg"),
			});
			const thirdUpload = yield* uploadCreateFx({
				userId: user.id,
				url: testUploadUrl("feed-gallery-3.jpg"),
			});
			const strangerUpload = yield* uploadCreateFx({
				userId: stranger.id,
				url: testUploadUrl("feed-gallery-stranger.jpg"),
			});

			const firstGallery = yield* feedGalleryCreateFx({
				userId: user.id,
				feedId: feed.id,
				uploadIds: [
					firstUpload.id,
					secondUpload.id,
				],
			});

			expect(firstGallery.items.map((item) => item.uploadId)).toEqual([
				firstUpload.id,
				secondUpload.id,
			]);

			const replacedGallery = yield* feedGalleryCreateFx({
				userId: user.id,
				feedId: feed.id,
				uploadIds: [
					thirdUpload.id,
				],
			});

			expect(replacedGallery.items.map((item) => item.uploadId)).toEqual([
				thirdUpload.id,
			]);
			expect(replacedGallery.items).toHaveLength(1);

			const storedItems = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("gallery_item")
					.select([
						"uploadId",
						"sort",
					])
					.where("galleryId", "=", feed.id)
					.orderBy("sort", "asc")
					.execute(),
			);

			expect(storedItems).toEqual([
				{
					uploadId: thirdUpload.id,
					sort: 0,
				},
			]);

			const fetchedFeed = yield* feedFetchFx({
				scope: {
					userId: user.id,
				},
				where: {
					id: feed.id,
				},
			});

			expect(fetchedFeed.uploadId).toBe(thirdUpload.id);

			const foreignAttempt = yield* Effect.either(
				feedGalleryCreateFx({
					userId: stranger.id,
					feedId: feed.id,
					uploadIds: [
						strangerUpload.id,
					],
				}),
			);

			expectTaggedErrorFx(foreignAttempt, {
				tag: "NotFoundErrorFx",
			});

			const itemsAfterForeignAttempt = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("gallery_item")
					.select([
						"uploadId",
						"sort",
					])
					.where("galleryId", "=", feed.id)
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
