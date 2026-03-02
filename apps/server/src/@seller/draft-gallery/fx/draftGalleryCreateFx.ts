import { Effect } from "effect";
import { draftResolveFx } from "~/@seller/draft/fx/draftResolveFx";
import type { DraftGalleryCreateSchema } from "~/@seller/draft-gallery/schema/DraftGalleryCreateSchema";
import { galleryFetchFx } from "~/@user/gallery/fx/galleryFetchFx";
import { galleryItemInsertFx } from "~/@user/gallery-item/fx/galleryItemInsertFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { withTraceFx } from "~/effect/withTraceFx";
import { InvalidRequestErrorFx } from "~/error/InvalidRequestErrorFx";

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
				yield* withTraceFx({
					fx: "draftGalleryCreateFx",
					error: {
						message: "At least one upload is required",
					},
				});
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
