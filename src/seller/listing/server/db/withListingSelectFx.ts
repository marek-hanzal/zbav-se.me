import { Effect } from "effect";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import type { CategoryRestrictionEnumSchema } from "~/common/category/enum/CategoryRestrictionEnumSchema";
import type { ListingDeliveryEnumSchema } from "~/common/listing/enum/ListingDeliveryEnumSchema";
import { withListingSourceSelectFx } from "~/seller/listing/server/db/withListingSourceSelectFx";
import type { CategoryTableSchema } from "~/server/database/@table/CategoryTableSchema";
import type { LocationTableSchema } from "~/server/database/@table/LocationTableSchema";
import { withGallerySelectFx } from "~/user/gallery/server/db/withGallerySelectFx";

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

	return listingSourceSelect.select((eb) => [
		"l.id",
		"l.price",
		"l.priceType",
		"l.currency",
		"l.condition",
		"l.age",
		"l.warranty",
		"l.status",
		"l.restriction",
		sql<
			CategoryRestrictionEnumSchema.Type[]
		>`array[${eb.ref("cat.restriction")}] || COALESCE(array[${eb.ref("l.restriction")}], '{}'::category_restriction_enum[])`.as(
			"restrictions",
		),
		"l.locationId",
		"l.categoryId",
		"l.galleryId",
		"l.draftId",
		"l.expiresAt",
		"l.title",
		"l.description",
		"l.createdAt",
		"l.updatedAt",
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
