import { Effect } from "effect";
import { draftResolveFx } from "~/app/draft/fx/draftResolveFx";
import type { DraftGalleryCreateSchema } from "~/app/draft/schema/DraftGalleryCreateSchema";
import { galleryFetchFx } from "~/app/gallery/fx/galleryFetchFx";
import { galleryItemCreateFx } from "~/app/gallery-item/fx/galleryItemCreateFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
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
			const { kysely } = yield* KyselyContextFx;

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
				return kysely
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
