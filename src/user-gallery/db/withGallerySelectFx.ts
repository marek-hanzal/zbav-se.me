import { Effect } from "effect";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { selectFn } from "~/database-query/fn/selectFn";
import type { GallerySortSchema } from "~/user-gallery/schema/GallerySortSchema";
import type { GalleryWhereSchema } from "~/user-gallery/schema/GalleryWhereSchema";
import { withGalleryItemSelectFx } from "~/user-gallery-item/db/withGalleryItemSelectFx";

export namespace withGallerySelectFx {
	export interface Props {
		sort?: GallerySortSchema.Type[];
	}
}

export const withGallerySelectFx = Effect.fn("withGallerySelectFx")(function* ({
	sort,
}: withGallerySelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let select = kysely.selectFrom("gallery as gal");

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

	return selectFn({
		select: select.select([
			"gal.id",
			(ebFn) => {
				return jsonArrayFrom(
					galleryItemSelect.whereRef("gal_item.galleryId", "=", ebFn.ref("gal.id")),
				).as("items");
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

				if (where.userId) {
					query = query.where("gal.userId", "=", where.userId);
				}

				if (where.access) {
					query = query.where("gal.access", "=", where.access);
				}

				return yield* Effect.succeed(query);
			});
		},
	});
});
