import { Effect } from "effect";
import { feedResolveFx } from "~/@user/feed/fx/feedResolveFx";
import { galleryFetchFx } from "~/@user/gallery/fx/galleryFetchFx";
import { galleryItemCreateFx } from "~/@user/gallery-item/fx/galleryItemCreateFx";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";
import { NotFoundError } from "~/error/NotFoundError";

export namespace feedGalleryCreateFx {
	export interface Props {
		feedId: string;
		uploadIds: string[];
	}
}

export const feedGalleryCreateFx = ({ feedId, uploadIds }: feedGalleryCreateFx.Props) => {
	return withTransactionFx(
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
				const gallery = yield* Effect.tryPromise(async () => {
					return database
						.selectFrom("gallery")
						.selectAll()
						.where("id", "=", feed.id)
						.where("userId", "=", user.id)
						.executeTakeFirst();
				});

				if (!gallery) {
					yield* Effect.tryPromise(async () => {
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
				query: {
					where: {
						id: feed.id,
					},
				},
			});

			if (!gallery) {
				return yield* new NotFoundError({
					resource: "gallery",
					resourceId: feed.id,
					message: "Gallery not found after creation",
				});
			}

			let sort = 0;
			for (const uploadId of uploadIds) {
				yield* galleryItemCreateFx({
					galleryId: gallery.id,
					uploadId,
					sort,
				});
				sort++;
			}

			return yield* galleryFetchFx({
				query: {
					where: {
						id: gallery.id,
					},
				},
			});
		}),
	);
};

export type feedGalleryCreateFx = ReturnType<typeof feedGalleryCreateFx>;
