import { Effect } from "effect";
import { DateServiceFx } from "@/lib/common/date";
import { getLoggerFx } from "@/lib/common/log";
import type { DraftTableSchema } from "~/server/database/@table/DraftTableSchema";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { galleryItemInsertFx } from "~/user/gallery-item/server/fx/galleryItemInsertFx";
import { resourceLimitEnsureFx } from "~/user/resource-limit/server/fx/resourceLimitEnsureFx";
import type { UploadSchema } from "~/user/upload/server/schema/UploadSchema";
import type { DraftPatchSchema } from "../schema/DraftPatchSchema";
import type { DraftWhereSchema } from "../schema/DraftWhereSchema";
import { draftFetchFx } from "./draftFetchFx";

export namespace draftPatchFx {
	export interface Props extends DraftPatchSchema.Type {
		userId: string;
		scope: DraftWhereSchema.Type;
	}
}

export const draftPatchFx = Effect.fn("draftPatchFx")(function* ({
	userId,
	patch: { locationId, uploadIds, ...patch },
	query,
	scope,
}: draftPatchFx.Props) {
	const logger = yield* getLoggerFx("draftPatchFx");
	logger.trace("draftPatchFx", {
		patch: {
			...patch,
			locationId,
			uploadIds,
		},
		query,
		scope,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const dateService = yield* DateServiceFx;

			const draft = yield* draftFetchFx({
				...query,
				userId,
				scope,
			});

			const extras: Partial<DraftTableSchema.Type> = {};

			logger.trace("draft", {
				draftId: draft.id,
			});

			if (
				patch.priceType === "ask" ||
				patch.priceType === "free" ||
				patch.priceType === "haulaway"
			) {
				patch.price = 0;
			}

			if (uploadIds && uploadIds.length > 0) {
				yield* resourceLimitEnsureFx({
					count: uploadIds.length,
					resource: "listing.gallery.count",
					userId,
				});

				/**
				 * Delete old items, except those already
				 */
				yield* dbFx(async (kysely) => {
					return kysely
						.deleteFrom("gallery_item as gi")
						.where("gi.galleryId", "=", draft.galleryId)
						.where((eb) => {
							return eb.exists(
								eb
									.selectFrom("gallery as g")
									.select("g.id")
									.whereRef("g.id", "=", "gi.galleryId")
									.where("g.userId", "=", userId),
							);
						})
						.execute();
				});

				yield* dbFx(async (kysely) => {
					return kysely
						.updateTable("upload")
						.set({
							access: "public",
						})
						.where("userId", "=", userId)
						.where("id", "in", uploadIds)
						.execute();
				});

				const withUpload = yield* dbFx(async (kysely) => {
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

				/**
				 * This is a hack how to manually reorder uploaded images to
				 * draft, so they preserve user's image order.
				 */
				patch.withImageUrl = ((
					withUpload: Pick<UploadSchema.Type, "id" | "url">[],
					uploadIds: string[],
				) => {
					const urlById = new Map(
						withUpload.map((row) => [
							row.id,
							row.url,
						]),
					);

					return uploadIds.flatMap((uploadId) => {
						const imageUrl = urlById.get(uploadId);

						return imageUrl
							? [
									imageUrl,
								]
							: [];
					});
				})(withUpload, uploadIds);

				let sort = 0;
				for (const uploadId of uploadIds) {
					yield* galleryItemInsertFx({
						galleryId: draft.galleryId,
						uploadId,
						sort,
						userId,
						check: false,
					});
					sort++;
				}

				patch.withUploadIds = uploadIds;
			}

			yield* dbFx(async (kysely) => {
				return kysely
					.updateTable("draft")
					.set({
						...patch,
						...extras,
						userId,
						locationId,
						updatedAt: dateService.now().toJSDate(),
					})
					.where("id", "=", draft.id)
					.execute();
			});

			logger.trace("patched", {
				draftId: draft.id,
			});

			if (patch.categoryId && draft.categoryId !== patch.categoryId) {
				yield* dbFx(async (kysely) => {
					return Promise.all([
						kysely
							.deleteFrom("draft_attr_decimal")
							.where("draftId", "=", draft.id)
							.execute(),
						kysely
							.deleteFrom("draft_attr_enum_multi")
							.where("draftId", "=", draft.id)
							.execute(),
						kysely
							.deleteFrom("draft_attr_enum_single")
							.where("draftId", "=", draft.id)
							.execute(),
						kysely
							.deleteFrom("draft_attr_number")
							.where("draftId", "=", draft.id)
							.execute(),
						kysely
							.deleteFrom("draft_attr_text")
							.where("draftId", "=", draft.id)
							.execute(),
					]);
				});
			}

			if (locationId) {
				const { geo: withLocation } = yield* dbFx(async (kysely) => {
					return kysely
						.selectFrom("location")
						.select("geo")
						.where("id", "=", locationId)
						.executeTakeFirstOrThrow();
				});

				yield* dbFx(async (kysely) => {
					return kysely
						.updateTable("draft")
						.set({
							withLocation,
						})
						.where("id", "=", draft.id)
						.execute();
				});

				logger.trace("locationId", {
					draftId: draft.id,
					locationId,
					withLocation,
				});
			}

			return yield* draftFetchFx({
				userId,
				where: {
					id: draft.id,
				},
				scope: {},
			});
		}),
	);
});

export type draftPatchFx = ReturnType<typeof draftPatchFx>;
