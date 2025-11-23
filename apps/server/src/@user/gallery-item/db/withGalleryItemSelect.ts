import { jsonObjectFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import type { GalleryItemSortSchema } from "~/@user/gallery-item/schema/GalleryItemSortSchema";
import { withUploadSelect } from "~/@user/upload/db/withUploadSelect";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withGalleryItemSelect {
	export interface Props {
		database: WithDatabase;
		sort?: GalleryItemSortSchema.Type[];
	}
	export type Select = ReturnType<typeof withGalleryItemSelect>;
}

export const withGalleryItemSelect = ({ database, sort }: withGalleryItemSelect.Props) => {
	let query = database.selectFrom("gallery_item as gi").select([
		"gi.id",
		"gi.galleryId",
		"gi.uploadId",
		"gi.sort",
		(eb) =>
			jsonObjectFrom(
				withUploadSelect({
					database,
				})
					.whereRef("u.id", "=", eb.ref("gi.uploadId"))
					.limit(1),
			)
				.$notNull()
				.as("upload"),
	]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("sort", () => query.orderBy("gi.sort", item.direction))
			.with("createdAt", () => query.orderBy("gi.createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
