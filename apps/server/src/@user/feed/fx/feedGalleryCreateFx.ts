import { NotFoundErrorFx } from "@use-pico/common/error";
import { Effect } from "effect";
import { feedPatchFx } from "~/@user/feed/fx/feedPatchFx";
import { feedResolveFx } from "~/@user/feed/fx/feedResolveFx";
import { galleryFetchFx } from "~/@user/gallery/fx/galleryFetchFx";
import { galleryItemCreateFx } from "~/@user/gallery-item/fx/galleryItemCreateFx";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";

export namespace feedGalleryCreateFx {
	export interface Props {
		feedId: string;
		uploadIds: string[];
	}
}

export const feedGalleryCreateFx = Effect.fn("feedGalleryCreateFx")(function* ({
	feedId,
	uploadIds,
}: feedGalleryCreateFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;
			const user = yield* UserContextFx;

			const feed = yield* feedResolveFx({
				feedId,
				message: "You are not allowed to create a gallery for this feed",
			});

			if (uploadIds.length === 0) {
				return yield* new InvalidRequestError({
					message: "At least one upload is required",
				});
			}

			{
				const gallery = yield* Effect.promise(async () => {
					return database
						.selectFrom("gallery")
						.selectAll()
						.where("id", "=", feed.id)
						.where("userId", "=", user.id)
						.executeTakeFirst();
				});

				if (!gallery) {
					yield* Effect.promise(async () => {
						return database
							.insertInto("gallery")
							.values({
								id: feed.id,
								userId: user.id,
								createdAt: new Date(),
							})
							.execute();
					});
				}
			}

			const gallery = yield* galleryFetchFx({
				where: {
					id: feed.id,
				},
			});

			if (!gallery) {
				return yield* new NotFoundErrorFx({
					resource: "gallery",
					resourceId: feed.id,
					message: "Gallery not found after creation",
				});
			}

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
