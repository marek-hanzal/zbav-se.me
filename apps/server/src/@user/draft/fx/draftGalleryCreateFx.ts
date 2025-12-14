import { Effect } from "effect";
import { draftPatchFx } from "~/@user/draft/fx/draftPatchFx";
import { draftResolveFx } from "~/@user/draft/fx/draftResolveFx";
import { draftGalleryCreateFx as draftGalleryLinkFx } from "~/@user/draft-gallery/fx/draftGalleryCreateFx";
import { galleryCreateFx } from "~/@user/gallery/fx/galleryCreateFx";
import { galleryFetchFx } from "~/@user/gallery/fx/galleryFetchFx";
import { galleryItemCreateFx } from "~/@user/gallery-item/fx/galleryItemCreateFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";
import { NotFoundError } from "~/error/NotFoundError";

export namespace draftGalleryCreateFx {
	export interface Props {
		draftId: string;
		uploadIds: string[];
	}
}

export const draftGalleryCreateFx = ({ draftId, uploadIds }: draftGalleryCreateFx.Props) => {
	return withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;

			if (uploadIds.length === 0) {
				return yield* new InvalidRequestError({
					message: "At least one upload is required",
				});
			}

			const draft = yield* draftResolveFx({
				draftId,
				message: "You are not allowed to create a gallery for this draft",
			});

			// Check if draft already has a gallery
			const existingDraftGallery = yield* Effect.tryPromise(async () => {
				return database
					.selectFrom("draft_gallery")
					.selectAll()
					.where("draftId", "=", draft.id)
					.executeTakeFirst();
			});

			let galleryId: string;

			if (existingDraftGallery) {
				galleryId = existingDraftGallery.galleryId;

				// Delete existing gallery items
				yield* Effect.tryPromise(async () => {
					return database
						.deleteFrom("gallery_item")
						.where("galleryId", "=", galleryId)
						.execute();
				});
			} else {
				// Create new gallery
				const gallery = yield* galleryCreateFx();
				galleryId = gallery.id;

				// Link gallery to draft
				yield* draftGalleryLinkFx({
					draftId: draft.id,
					galleryId: gallery.id,
				});
			}

			// Add gallery items
			let sort = 0;
			for (const uploadId of uploadIds) {
				yield* galleryItemCreateFx({
					galleryId,
					uploadId,
					sort,
				});
				sort++;
			}

			// Update draft with first upload as thumbnail
			yield* draftPatchFx({
				patch: {
					uploadId: uploadIds[0],
				},
				query: {
					where: {
						id: draft.id,
					},
				},
			});

			const gallery = yield* galleryFetchFx({
				where: {
					id: galleryId,
				},
			});

			if (!gallery) {
				return yield* new NotFoundError({
					resource: "gallery",
					resourceId: galleryId,
					message: "Gallery not found after creation",
				});
			}

			return gallery;
		}),
	);
};

export type draftGalleryCreateFx = ReturnType<typeof draftGalleryCreateFx>;
