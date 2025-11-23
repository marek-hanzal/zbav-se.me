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
	let query = database.selectFrom("gallery_item as gal_item").select([
		"gal_item.id",
		"gal_item.galleryId",
		"gal_item.uploadId",
		"gal_item.sort",
		(eb) =>
			jsonObjectFrom(
				withUploadSelect({
					database,
				})
					.whereRef("u.id", "=", eb.ref("gal_item.uploadId"))
					.limit(1),
			)
				.$notNull()
				.as("upload"),
	]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("sort", () => query.orderBy("gal_item.sort", item.direction))
			.with("createdAt", () => query.orderBy("gal_item.createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
