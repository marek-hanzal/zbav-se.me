import { Effect } from "effect";
import { sql } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { withGallerySourceSelectFx } from "~/public/gallery/server/db/withGallerySourceSelectFx";
import { withGalleryItemSelectFx } from "~/public/gallery-item/server/db/withGalleryItemSelectFx";
import type { GalleryItemSchema } from "~/public/gallery-item/server/schema/GalleryItemSchema";

export namespace withGallerySelectFx {
	export interface Props extends withGallerySourceSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withGallerySelectFx>>;
}

export const withGallerySelectFx = Effect.fn("withGallerySelectFx")(function* ({
	sort,
}: withGallerySelectFx.Props) {
	const sourceSelect = yield* withGallerySourceSelectFx({
		sort,
	});

	const galleryItemSelect = yield* withGalleryItemSelectFx({
		sort: [
			{
				field: "sort",
				order: "asc",
			},
		],
	});

	return sourceSelect.select([
		"gal.id",
		(eb) => {
			return sql<Date>`${eb.ref("gal.createdAt")}`.as("createdAt");
		},
		(eb) => {
			return jsonArrayFrom(
				galleryItemSelect.whereRef("gal_item.galleryId", "=", eb.ref("gal.id")),
			)
				.$castTo<GalleryItemSchema.Type[]>()
				.as("items");
		},
	]);
});
