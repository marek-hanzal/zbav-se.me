import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { feedCreateFx } from "~/buyer/feed/server/fx/feedCreateFx";
import { feedFetchFx } from "~/buyer/feed/server/fx/feedFetchFx";
import { feedGalleryCreateFx } from "~/buyer/feed-gallery/server/fx/feedGalleryCreateFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";
import { uploadCreateFx } from "~/user/upload/server/fx/uploadCreateFx";

describe("feedGalleryCreateFx", () => {
	it("replaces gallery items and updates feed hero upload to the first item", async () => {
		const database = await testabase("feedGalleryCreateFx-replace");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const { user } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "feed-gallery-user@test.cz",
						name: "Feed Gallery User",
						password: "12345678",
					},
				}),
			);

			const feed = yield* feedCreateFx({
				userId: user.id,
				type: "search",
				name: "Gallery feed",
				query: {},
			});

			const firstUpload = yield* uploadCreateFx({
				userId: user.id,
				url: "https://cdn.zbav-se.me/feed-gallery-1.jpg",
			});
			const secondUpload = yield* uploadCreateFx({
				userId: user.id,
				url: "https://cdn.zbav-se.me/feed-gallery-2.jpg",
			});
			const thirdUpload = yield* uploadCreateFx({
				userId: user.id,
				url: "https://cdn.zbav-se.me/feed-gallery-3.jpg",
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
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
