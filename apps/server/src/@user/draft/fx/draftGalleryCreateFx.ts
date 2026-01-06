import { Effect } from "effect";
import { draftResolveFx } from "~/@user/draft/fx/draftResolveFx";
import { galleryFetchFx } from "~/@user/gallery/fx/galleryFetchFx";
import { galleryItemCreateFx } from "~/app/gallery-item/fx/galleryItemCreateFx";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";

export namespace draftGalleryCreateFx {
	export interface Props {
		draftId: string;
		uploadIds: string[];
	}
}

export const draftGalleryCreateFx = Effect.fn("draftGalleryCreateFx")(function* ({
	draftId,
	uploadIds,
}: draftGalleryCreateFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;
			const user = yield* UserContextFx;

			if (uploadIds.length === 0) {
				return yield* new InvalidRequestError({
					message: "At least one upload is required",
				});
			}

			const draft = yield* draftResolveFx({
				draftId,
				message: "You are not allowed to create a gallery for this draft",
			});

			yield* Effect.promise(async () => {
				return database
					.deleteFrom("gallery_item")
					.where("galleryId", "=", draft.galleryId)
					.execute();
			});

			let sort = 0;
			for (const uploadId of uploadIds) {
				yield* galleryItemCreateFx({
					galleryId: draft.galleryId,
					uploadId,
					sort,
					userId: user.id,
				});
				sort++;
			}

			return yield* galleryFetchFx({
				where: {
					id: draft.galleryId,
				},
			});
		}),
	);
});

export type draftGalleryCreateFx = ReturnType<typeof draftGalleryCreateFx>;
