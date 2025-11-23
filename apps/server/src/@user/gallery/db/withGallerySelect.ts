import { jsonArrayFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import type { WithDatabase } from "../../../database/WithDatabase";
import { withGalleryItemSelect } from "../../gallery-item/db/withGalleryItemSelect";
import type { GallerySortSchema } from "../schema/GallerySortSchema";

export namespace withGallerySelect {
	export interface Props {
		database: WithDatabase;
		sort?: GallerySortSchema.Type[];
	}
	export type Select = ReturnType<typeof withGallerySelect>;
}

export const withGallerySelect = ({ database, sort }: withGallerySelect.Props) => {
	let query = database.selectFrom("gallery as g").select([
		"g.id",
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
				}).whereRef("gi.galleryId", "=", eb.ref("g.id")),
			).as("items"),
	]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("g.createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
