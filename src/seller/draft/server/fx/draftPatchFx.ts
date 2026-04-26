import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { getLoggerFx } from "@/lib/common/log";
import { draftFetchFx } from "~/seller/draft/server/fx/draftFetchFx";
import type { DraftFilterSchema } from "~/seller/draft/server/schema/DraftFilterSchema";
import type { DraftPatchSchema } from "~/seller/draft/server/schema/DraftPatchSchema";
import type { DraftTableSchema } from "~/server/database/@table/DraftTableSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { galleryItemInsertFx } from "~/user/gallery-item/server/fx/galleryItemInsertFx";

export namespace draftPatchFx {
	export interface Scope extends DraftFilterSchema.Type {
		userId: string;
	}

	export interface Props extends DraftPatchSchema.Type {
		userId: string;
		scope: Scope;
	}
}

export const draftPatchFx = Effect.fn("draftPatchFx")(function* ({
	userId,
	patch: { uploadIds, ...patch },
	query,
	scope,
}: draftPatchFx.Props) {
	const logger = yield* getLoggerFx("draftPatchFx");
	logger.trace("draftPatchFx", {
		patch,
		query,
		scope,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;

			const draft = yield* draftFetchFx({
				...query,
				scope,
			});

			const extra: Partial<DraftTableSchema.Type> = {};

			if (uploadIds) {
				yield* tryDbFx(async () => {
					return kysely
						.deleteFrom("gallery_item")
						.where("galleryId", "=", draft.galleryId)
						.execute();
				});

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

				const withUpload =
					uploadIds.length > 0
						? yield* tryDbFx(async () => {
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
							})
						: [];

				const urlById = new Map(
					withUpload.map((row) => [
						row.id,
						row.url,
					]),
				);

				extra.withImageUrl = uploadIds.flatMap((uploadId) => {
					const imageUrl = urlById.get(uploadId);
					return imageUrl
						? [
								imageUrl,
							]
						: [];
				});
				extra.withUploadIds = uploadIds.filter((uploadId) => urlById.has(uploadId));
			}

			yield* tryDbFx(async () => {
				return kysely
					.updateTable("draft")
					.set({
						...patch,
						...extra,
						updatedAt: dateContext.now().toJSDate(),
					})
					.where("id", "=", draft.id)
					.execute();
			});

			return yield* draftFetchFx({
				where: {
					id: draft.id,
				},
				scope,
			});
		}),
	);
});

export type draftPatchFx = ReturnType<typeof draftPatchFx>;
