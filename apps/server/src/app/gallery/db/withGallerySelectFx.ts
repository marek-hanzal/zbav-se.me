import { Effect } from "effect";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { withGallerySourceSelectFx } from "~/app/gallery/db/withGallerySourceSelectFx";
import { withGalleryItemSelectFx } from "~/app/gallery-item/db/withGalleryItemSelectFx";

export namespace withGallerySelectFx {
	export interface Props extends withGallerySourceSelectFx.Props {}

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
				direction: "asc",
			},
		],
	});

	return sourceSelect.select([
		"gal.id",
		(eb) =>
			jsonArrayFrom(
				galleryItemSelect.whereRef("gal_item.galleryId", "=", eb.ref("gal.id")),
			).as("items"),
	]);
});
