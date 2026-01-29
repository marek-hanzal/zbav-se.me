import { Effect } from "effect";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { withListingSourceSelectFx } from "~/@seller-user/listing/db/withListingSourceSelectFx";
import { withGallerySelectFx } from "~/@user/gallery/db/withGallerySelectFx";
import type { ListingDeliveryEnumSchema } from "~/database/@enum/ListingDeliveryEnumSchema";
import type { CategoryTableSchema } from "~/database/@table/CategoryTableSchema";
import type { LocationTableSchema } from "~/database/@table/LocationTableSchema";

export namespace withListingSelectFx {
	export interface Props extends withListingSourceSelectFx.Props {
		//
	}

	export type Select = ReturnType<typeof withListingSelectFx>;
}

export const withListingSelectFx = Effect.fn("withListingSelectFx")(function* ({
	sort,
}: withListingSelectFx.Props) {
	const listingSourceSelect = yield* withListingSourceSelectFx({
		sort,
	});

	const gallerySelect = yield* withGallerySelectFx({});

	return listingSourceSelect.selectAll("l").select((eb) => [
		sql<LocationTableSchema.Type>`to_jsonb(${eb.table("loc")}.*)`.as("location"),
		sql<CategoryTableSchema.Type>`to_jsonb(${eb.table("cat")}.*)`.as("category"),
		sql<ListingDeliveryEnumSchema.Type[] | null>`to_jsonb(${eb.ref("l.delivery")})`.as(
			"delivery",
		),
		sql<string[] | null>`to_jsonb(${eb.ref("l.pros")})`.as("pros"),
		sql<string[] | null>`to_jsonb(${eb.ref("l.cons")})`.as("cons"),

		jsonObjectFrom(gallerySelect.where("gal.id", "=", eb.ref("l.galleryId")).limit(1))
			.$notNull()
			.as("gallery"),
	]);
});
