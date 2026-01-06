import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import type { FeedGalleryCreateSchema } from "~/@user/feed/schema/FeedGalleryCreateSchema";
import { galleryCreateFx } from "~/@user/gallery/fx/galleryCreateFx";
import { galleryFetchFx } from "~/@user/gallery/fx/galleryFetchFx";
import { feedPatchFx } from "~/app/feed/fx/feedPatchFx";
import { feedResolveFx } from "~/app/feed/fx/feedResolveFx";
import { galleryItemCreateFx } from "~/app/gallery-item/fx/galleryItemCreateFx";
import type { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";

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
			const database = yield* DatabaseContextFx;

			const feed = yield* feedResolveFx({
				feedId,
				userId,
				message: "You are not allowed to create a gallery for this feed",
			});

			if (uploadIds.length === 0) {
				return yield* new InvalidRequestError({
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

			yield* Effect.promise(async () => {
				return database
					.deleteFrom("gallery_item")
					.where("galleryId", "=", gallery.id)
					.execute();
			});

			let sort = 0;
			for (const uploadId of uploadIds) {
				yield* galleryItemCreateFx({
					galleryId: gallery.id,
					uploadId,
					sort,
					userId,
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
			});
		}),
	);
});

export type feedGalleryCreateFx = ReturnType<typeof feedGalleryCreateFx>;

type _NoUser = AssertNever<Extract<Effect.Effect.Context<feedGalleryCreateFx>, UserContextFx>>;
