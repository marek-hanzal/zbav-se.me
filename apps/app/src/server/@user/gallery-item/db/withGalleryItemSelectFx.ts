import { Effect } from "effect";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { withGalleryItemSourceSelectFx } from "~/server/@user/gallery-item/db/withGalleryItemSourceSelectFx";
import { withUploadSelectFx } from "~/server/@user/upload/db/withUploadSelectFx";

export namespace withGalleryItemSelectFx {
	export interface Props extends withGalleryItemSourceSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withGalleryItemSelectFx>>;
}

export const withGalleryItemSelectFx = Effect.fn("withGalleryItemSelectFx")(function* ({
	sort,
}: withGalleryItemSelectFx.Props) {
	const sourceSelect = yield* withGalleryItemSourceSelectFx({
		sort,
	});

	const uploadSelect = yield* withUploadSelectFx({});

	return sourceSelect.select([
		"gal_item.id",
		"gal_item.galleryId",
		"gal_item.uploadId",
		"gal_item.sort",
		(eb) =>
			jsonObjectFrom(uploadSelect.whereRef("u.id", "=", eb.ref("gal_item.uploadId")).limit(1))
				.$notNull()
				.as("upload"),
	]);
});
