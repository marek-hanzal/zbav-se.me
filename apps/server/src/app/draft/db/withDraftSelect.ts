import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import type { CategoryDbSchema } from "~/app/category/schema/CategoryDbSchema";
import { withDraftCollectionSelect } from "~/app/draft/db/withDraftCollectionSelect";
import { withGallerySelect } from "~/app/gallery/db/withGallerySelect";
import type { ListingDeliveryEnumSchema } from "~/app/listing/schema/ListingDeliveryEnumSchema";
import type { LocationDbSchema } from "~/app/location/schema/LocationDbSchema";

export namespace withDraftSelect {
	export interface Props extends withDraftCollectionSelect.Props {}

	export type Select = ReturnType<typeof withDraftSelect>;
}

export const withDraftSelect = ({ database, sort }: withDraftSelect.Props) => {
	return withDraftCollectionSelect({
		database,
		sort,
	})
		.selectAll("d")
		.select((eb) => [
			sql<LocationDbSchema.Type | null>`to_jsonb(${eb.table("loc")}.*)`.as("location"),
			sql<CategoryDbSchema.Type | null>`to_jsonb(${eb.table("cat")}.*)`.as("category"),
			sql<ListingDeliveryEnumSchema.Type[] | null>`to_jsonb(${eb.ref("d.delivery")})`.as(
				"delivery",
			),
			sql<string[] | null>`to_jsonb(${eb.ref("d.pros")})`.as("pros"),
			sql<string[] | null>`to_jsonb(${eb.ref("d.cons")})`.as("cons"),

			jsonObjectFrom(
				withGallerySelect({
					database,
					sort: undefined,
				})
					.where("gal.id", "=", eb.ref("d.galleryId"))
					.limit(1),
			)
				.$notNull()
				.as("gallery"),
		]);
};
