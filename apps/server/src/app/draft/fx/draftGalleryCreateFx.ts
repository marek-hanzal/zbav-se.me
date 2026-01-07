import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import type { DraftGalleryCreateSchema } from "~/@user/draft/schema/DraftGalleryCreateSchema";
import { draftResolveFx } from "~/app/draft/fx/draftResolveFx";
import { galleryFetchFx } from "~/app/gallery/fx/galleryFetchFx";
import { galleryItemCreateFx } from "~/app/gallery-item/fx/galleryItemCreateFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";

export namespace draftGalleryCreateFx {
	export interface Props extends DraftGalleryCreateSchema.Type {
		userId: string;
	}
}

export const draftGalleryCreateFx = Effect.fn("draftGalleryCreateFx")(function* ({
	userId,
	draftId,
	uploadIds,
}: draftGalleryCreateFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;

			if (uploadIds.length === 0) {
				return yield* new InvalidRequestError({
					message: "At least one upload is required",
				});
			}

			const draft = yield* draftResolveFx({
				userId,
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
					userId,
					galleryId: draft.galleryId,
					uploadId,
					sort,
				});
				sort++;
			}

			return yield* galleryFetchFx({
				where: {
					id: draft.galleryId,
				},
				scope: {
					userId,
				},
			});
		}),
	);
});

export type draftGalleryCreateFx = ReturnType<typeof draftGalleryCreateFx>;

