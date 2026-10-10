import { Effect } from "effect";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { selectFx } from "~/database-query/fx/selectFx";
import type { GallerySortSchema } from "~/public-gallery/schema/GallerySortSchema";
import type { GalleryWhereSchema } from "~/public-gallery/schema/GalleryWhereSchema";
import { withGalleryItemSelectFx } from "~/public-gallery-item/db/withGalleryItemSelectFx";
import type { GalleryItemSchema } from "~/public-gallery-item/schema/GalleryItemSchema";

export namespace withGallerySelectFx {
	export interface Props {
		sort?: GallerySortSchema.Type[];
	}
}

export const withGallerySelectFx = Effect.fn("withGallerySelectFx")(function* ({
	sort,
}: withGallerySelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let select = kysely.selectFrom("gallery as gal").where("gal.access", "=", "public");

	for (const item of sort ?? []) {
		select = match(item.field)
			.with("createdAt", () => select.orderBy("gal.createdAt", item.order))
			.exhaustive();
	}

	const { select: galleryItemSelect } = yield* withGalleryItemSelectFx({
		sort: [
			{
				field: "sort",
				order: "asc",
			},
		],
	});

	return selectFx({
		select: select.select([
			"gal.id",
			"gal.createdAt",
			(eb) => {
				return jsonArrayFrom(
					galleryItemSelect.whereRef("gal_item.galleryId", "=", eb.ref("gal.id")),
				)
					.$castTo<GalleryItemSchema.Type[]>()
					.as("items");
			},
		]),
		queryFx(select, where: GalleryWhereSchema.Type) {
			return Effect.gen(function* () {
				let query = select;

				if (!where) {
					return yield* Effect.succeed(select);
				}

				if (where.id) {
					query = query.where("gal.id", "=", where.id);
				}

				if (where.idIn && where.idIn.length > 0) {
					query = query.where("gal.id", "in", where.idIn);
				}

				return yield* Effect.succeed(query);
			});
		},
	});
});
