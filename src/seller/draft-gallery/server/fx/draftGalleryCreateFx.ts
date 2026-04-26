import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { getLoggerFx } from "@/lib/common/log";
import { draftResolveFx } from "~/seller/draft/server/fx/draftResolveFx";
import type { DraftGalleryCreateSchema } from "~/seller/draft-gallery/server/schema/DraftGalleryCreateSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { InvalidRequestErrorFx } from "~/server/error/InvalidRequestErrorFx";
import { galleryFetchFx } from "~/user/gallery/server/fx/galleryFetchFx";
import { galleryItemInsertFx } from "~/user/gallery-item/server/fx/galleryItemInsertFx";

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
	const logger = yield* getLoggerFx("draftGalleryCreateFx");
	const dateContext = yield* DateContextFx;
	logger.trace("draftGalleryCreateFx", {
		userId,
		draftId,
		uploadIds,
	});

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

			const withUpload = yield* tryDbFx(async () => {
				return kysely
					.selectFrom("upload")
					.select([
						"id",
						"url",
					])
					.where("userId", "=", userId)
					.where("id", "in", uploadIds)
					.orderBy("createdAt", "asc")
					.execute();
			});

			const urlById = new Map(
				withUpload.map((row) => [
					row.id,
					row.url,
				]),
			);

			const withImageUrl = uploadIds.flatMap((uploadId) => {
				const imageUrl = urlById.get(uploadId);
				return imageUrl
					? [
							imageUrl,
						]
					: [];
			});
			const withUploadIds = uploadIds.filter((uploadId) => urlById.has(uploadId));

			yield* tryDbFx(async () => {
				return kysely
					.updateTable("draft")
					.set({
						withImageUrl,
						withUploadIds,
						updatedAt: dateContext.now().toJSDate(),
					})
					.where("id", "=", draftId)
					.where("userId", "=", userId)
					.execute();
			});

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
