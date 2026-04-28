import { Effect } from "effect";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import { selectFx } from "@/lib/common/select";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { withGalleryItemSelectFx } from "~/user/gallery-item/server/db/withGalleryItemSelectFx";
import type { GalleryFilterSchema } from "../schema/GalleryFilterSchema";
import type { GallerySortSchema } from "../schema/GallerySortSchema";

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

	return selectFx({
		select: select.select([
			"gal.id",
			(eb) => {
				return jsonArrayFrom(
					galleryItemSelect.whereRef("gal_item.galleryId", "=", eb.ref("gal.id")),
				).as("items");
			},
		]),
		queryFx(select, where: GalleryFilterSchema.Type) {
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
