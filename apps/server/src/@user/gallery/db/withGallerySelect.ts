import { jsonArrayFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import { withGalleryItemSelect } from "~/@user/gallery-item/db/withGalleryItemSelect";
import type { WithDatabase } from "~/database/WithDatabase";
import type { GallerySortSchema } from "../schema/GallerySortSchema";

export namespace withGallerySelect {
	export interface Props {
		database: WithDatabase;
		sort?: GallerySortSchema.Type[];
	}
	export type Select = ReturnType<typeof withGallerySelect>;
}

export const withGallerySelect = ({ database, sort }: withGallerySelect.Props) => {
	let query = database.selectFrom("gallery as gal").select([
		"gal.id",
		(eb) =>
			jsonArrayFrom(
				withGalleryItemSelect({
					database,
					sort: [
						{
							field: "sort",
							direction: "asc",
						},
					],
				}).whereRef("gal_item.galleryId", "=", eb.ref("gal.id")),
			).as("items"),
	]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("gal.createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
