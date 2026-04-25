import { Effect } from "effect";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { withGalleryItemSourceSelectFx } from "~/public/gallery-item/server/db/withGalleryItemSourceSelectFx";
import { withUploadSelectFx } from "~/public/upload/server/db/withUploadSelectFx";
import type { UploadSchema } from "~/public/upload/server/schema/UploadSchema";

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
		(eb) => {
			return sql<Date>`${eb.ref("gal_item.createdAt")}`.as("createdAt");
		},
		(eb) => {
			return jsonObjectFrom(
				uploadSelect.whereRef("u.id", "=", eb.ref("gal_item.uploadId")).limit(1),
			)
				.$notNull()
				.$castTo<UploadSchema.Type>()
				.as("upload");
		},
	]);
});
