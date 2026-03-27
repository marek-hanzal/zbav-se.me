import { Effect } from "effect";
import { draftResolveFx } from "~/@seller/draft/server/fx/draftResolveFx";
import type { DraftGalleryCreateSchema } from "~/@seller/draft-gallery/server/schema/DraftGalleryCreateSchema";
import { galleryFetchFx } from "~/@user/gallery/server/fx/galleryFetchFx";
import { galleryItemInsertFx } from "~/@user/gallery-item/server/fx/galleryItemInsertFx";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { InvalidRequestErrorFx } from "~/server/error/InvalidRequestErrorFx";

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
			const { kysely } = yield* KyselyContextFx;

			if (uploadIds.length === 0) {
				return yield* new InvalidRequestErrorFx({
					message: "At least one upload is required",
				});
			}

			const draft = yield* draftResolveFx({
				userId,
				draftId,
				message: "You are not allowed to create a gallery for this draft",
			});

			yield* tryDbFx(async () =>
				kysely
					.deleteFrom("gallery_item")
					.where("galleryId", "=", draft.galleryId)
					.execute(),
			);

			let sort = 0;
			for (const uploadId of uploadIds) {
				yield* galleryItemInsertFx({
					userId,
					galleryId: draft.galleryId,
					uploadId,
					sort,
					check: false,
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
