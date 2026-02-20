import { Effect } from "effect";
import { feedPatchFx } from "~/@buyer-user/feed/fx/feedPatchFx";
import { feedResolveFx } from "~/@buyer-user/feed/fx/feedResolveFx";
import type { FeedGalleryCreateSchema } from "~/@buyer-user/feed-gallery/schema/FeedGalleryCreateSchema";
import { galleryCreateFx } from "~/@user/gallery/fx/galleryCreateFx";
import { galleryFetchFx } from "~/@user/gallery/fx/galleryFetchFx";
import { galleryItemInsertFx } from "~/@user/gallery-item/fx/galleryItemInsertFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { withTraceFx } from "~/effect/withTraceFx";
import { InvalidRequestErrorFx } from "~/error/InvalidRequestErrorFx";

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
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;

			const feed = yield* feedResolveFx({
				feedId,
				userId,
				message: "You are not allowed to create a gallery for this feed",
			});

			if (uploadIds.length === 0) {
				yield* withTraceFx({
					fx: "feedGalleryCreateFx",
					error: {
						message: "At least one upload is required",
					},
				});
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
						userId,
						id: feed.id,
					});
				}),
			);

			yield* tryDbFx(async () =>
				kysely.deleteFrom("gallery_item").where("galleryId", "=", gallery.id).execute(),
			);

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
