import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { galleryItemInsertFx } from "~/user/gallery-item/server/fx/galleryItemInsertFx";
import type { UploadSchema } from "~/user/upload/server/schema/UploadSchema";
import type { ListingPatchSchema } from "../schema/ListingPatchSchema";
import type { ListingWhereSchema } from "../schema/ListingWhereSchema";
import { listingFetchFx } from "./listingFetchFx";

export namespace listingPatchFx {
	export interface Props extends ListingPatchSchema.Type {
		userId: string;
		scope: ListingWhereSchema.Type;
	}
}

export const listingPatchFx = Effect.fn("listingPatchFx")(function* ({
	userId,
	patch: { locationId, uploadIds, ...patch },
	query,
	scope,
}: listingPatchFx.Props) {
	const logger = yield* getLoggerFx("listingPatchFx");
	logger.trace("listingPatchFx", {
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
			const { kysely } = yield* KyselyContextFx;

			const listing = yield* listingFetchFx({
				...query,
				userId,
				scope,
			});

			logger.trace("listing", {
				listingId: listing.id,
			});

			if (patch.priceType === "offer") {
				patch.price = null;
			}

			if (uploadIds && uploadIds.length > 0) {
				/**
				 * Delete old items, except those already
				 */
				yield* tryDbFx(async () => {
					return kysely
						.deleteFrom("gallery_item as gi")
						.where("gi.galleryId", "=", listing.galleryId)
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

				yield* tryDbFx(async () => {
					return kysely
						.updateTable("upload")
						.set({
							access: "public",
						})
						.where("userId", "=", userId)
						.where("id", "in", uploadIds)
						.execute();
				});

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

				/**
				 * This is a hack how to manually reorder uploaded images to
				 * listing, so they preserve user's image order.
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
						galleryId: listing.galleryId,
						uploadId,
						sort,
						userId,
						check: false,
					});
					sort++;
				}

				patch.withUploadIds = uploadIds;
			}

			yield* tryDbFx(async () => {
				return kysely
					.updateTable("listing")
					.set({
						...patch,
						userId,
						locationId,
					})
					.where("id", "=", listing.id)
					.execute();
			});

			logger.trace("patched", {
				listingId: listing.id,
			});

			if (patch.categoryId && listing.categoryId !== patch.categoryId) {
				yield* tryDbFx(async () => {
					return Promise.all([
						kysely
							.deleteFrom("attr_decimal")
							.where("listingId", "=", listing.id)
							.execute(),
						kysely
							.deleteFrom("attr_enum_multi")
							.where("listingId", "=", listing.id)
							.execute(),
						kysely
							.deleteFrom("attr_enum_single")
							.where("listingId", "=", listing.id)
							.execute(),
						kysely
							.deleteFrom("attr_number")
							.where("listingId", "=", listing.id)
							.execute(),
						kysely
							.deleteFrom("attr_text")
							.where("listingId", "=", listing.id)
							.execute(),
					]);
				});
			}

			if (locationId) {
				const { geo: withLocation } = yield* tryDbFx(async () => {
					return kysely
						.selectFrom("location")
						.select("geo")
						.where("id", "=", locationId)
						.executeTakeFirstOrThrow();
				});

				yield* tryDbFx(async () => {
					return kysely
						.updateTable("listing")
						.set({
							withLocation,
						})
						.where("id", "=", listing.id)
						.execute();
				});

				logger.trace("locationId", {
					listingId: listing.id,
					locationId,
					withLocation,
				});
			}

			return yield* listingFetchFx({
				userId,
				where: {
					id: listing.id,
				},
				scope: {},
			});
		}),
	);
});

export type listingPatchFx = ReturnType<typeof listingPatchFx>;
