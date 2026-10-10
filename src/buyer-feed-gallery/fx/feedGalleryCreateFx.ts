import { Effect } from "effect";
import { feedPatchFx } from "~/buyer-feed/fx/feedPatchFx";
import { feedResolveFx } from "~/buyer-feed/fx/feedResolveFx";
import type { FeedGalleryCreateSchema } from "~/buyer-feed-gallery/schema/FeedGalleryCreateSchema";
import { dbFx } from "~/database/fx/dbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { InvalidRequestErrorFx } from "~/server-error/error/InvalidRequestErrorFx";
import { galleryCreateFx } from "~/user-gallery/fx/galleryCreateFx";
import { galleryFetchFx } from "~/user-gallery/fx/galleryFetchFx";
import { galleryItemInsertFx } from "~/user-gallery-item/fx/galleryItemInsertFx";

export namespace feedGalleryCreateFx {
	export interface Props extends FeedGalleryCreateSchema.Type {
		userId: string;
	}
}

export const feedGalleryCreateFx = Effect.fn("feedGalleryCreateFx")(function* ({
	userId,
	feedId,
	uploadIds,
}: feedGalleryCreateFx.Props) {
	const logger = yield* getLoggerFx("feedGalleryCreateFx");
	logger.trace("feedGalleryCreateFx", {
		userId,
		feedId,
		uploadIds,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const feed = yield* feedResolveFx({
				feedId,
				userId,
				message: "You are not allowed to create a gallery for this feed",
			});

			if (uploadIds.length === 0) {
				return yield* new InvalidRequestErrorFx({
					message: "At least one upload is required",
				});
			}

			const gallery = yield* galleryFetchFx({
				where: {
					id: feed.id,
				},
				scope: {
					userId,
				},
			}).pipe(
				Effect.catchTag("NotFoundErrorFx", () => {
					return galleryCreateFx({
						access: "private",
						userId,
						id: feed.id,
					});
				}),
			);

			yield* dbFx(async (kysely) => {
				kysely.deleteFrom("gallery_item").where("galleryId", "=", gallery.id).execute();
			});

			let sort = 0;
			for (const uploadId of uploadIds) {
				yield* galleryItemInsertFx({
					galleryId: gallery.id,
					uploadId,
					sort,
					userId,
					check: false,
				});
				sort++;
			}

			yield* feedPatchFx({
				patch: {
					uploadId: uploadIds[0],
				},
				query: {
					where: {
						id: feed.id,
					},
				},
				scope: {
					userId,
				},
			});

			return yield* galleryFetchFx({
				where: {
					id: gallery.id,
				},
				scope: {
					userId,
				},
			});
		}),
	);
});

export type feedGalleryCreateFx = ReturnType<typeof feedGalleryCreateFx>;
