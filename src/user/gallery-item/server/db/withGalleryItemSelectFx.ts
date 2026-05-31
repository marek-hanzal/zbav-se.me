import { Effect } from "effect";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import { selectFx } from "@/lib/common/select";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { withUploadSelectFx } from "~/user/upload/server/db/withUploadSelectFx";
import type { GalleryItemSortSchema } from "../schema/GalleryItemSortSchema";
import { GalleryItemWhereSchema } from "../schema/GalleryItemWhereSchema";

export namespace withGalleryItemSelectFx {
	export interface Props {
		sort?: GalleryItemSortSchema.Type[];
	}
}

export const withGalleryItemSelectFx = Effect.fn("withGalleryItemSelectFx")(function* ({
	sort,
}: withGalleryItemSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let select = kysely.selectFrom("gallery_item as gal_item");

	for (const item of sort ?? []) {
		select = match(item.field)
			.with("sort", () => select.orderBy("gal_item.sort", item.order))
			.with("createdAt", () => select.orderBy("gal_item.createdAt", item.order))
			.exhaustive();
	}

	const { select: uploadSelect } = yield* withUploadSelectFx({});

	return selectFx({
		select: select.select([
			"gal_item.id",
			"gal_item.galleryId",
			"gal_item.uploadId",
			"gal_item.sort",
			(eb) => {
				return jsonObjectFrom(
					uploadSelect.whereRef("u.id", "=", eb.ref("gal_item.uploadId")).limit(1),
				)
					.$notNull()
					.as("upload");
			},
		]),
		queryFx(select, where: GalleryItemWhereSchema.Type) {
			return Effect.gen(function* () {
				let query = select;

				if (!where) {
					return yield* Effect.succeed(select);
				}

				if (where.id) {
					query = query.where("gal_item.id", "=", where.id);
				}

				if (where.idIn && where.idIn.length > 0) {
					query = query.where("gal_item.id", "in", where.idIn);
				}

				if (where.userId) {
					const userId = where.userId;
					query = query.where((eb) => {
						return eb.exists(
							eb
								.selectFrom("gallery as gal")
								.select("gal.id")
								.whereRef("gal.id", "=", "gal_item.galleryId")
								.where("gal.userId", "=", userId),
						);
					});
				}

				if (where.galleryId) {
					query = query.where("gal_item.galleryId", "=", where.galleryId);
				}

				return yield* Effect.succeed(query);
			});
		},
	});
});
