import { Effect } from "effect";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { withListingSourceSelectFx } from "~/buyer/listing/server/db/withListingSourceSelectFx";
import type { CategoryRestrictionEnumSchema } from "~/common/category/enum/CategoryRestrictionEnumSchema";
import type { ListingDeliveryEnumSchema } from "~/common/listing/enum/ListingDeliveryEnumSchema";
import type { ThumbEnumSchema } from "~/common/listing/enum/ThumbEnumSchema";
import type { CategoryTableSchema } from "~/server/database/@table/CategoryTableSchema";
import type { LocationTableSchema } from "~/server/database/@table/LocationTableSchema";
import { withGallerySelectFx } from "~/user/gallery/server/db/withGallerySelectFx";

export namespace withListingSelectFx {
	export interface Props extends withListingSourceSelectFx.Props {
		userId: string;
	}

	export type Select = ReturnType<typeof withListingSelectFx>;
}

export const withListingSelectFx = Effect.fn("withListingSelectFx")(function* ({
	userId,
	sort,
	meta,
}: withListingSelectFx.Props) {
	const listingSourceSelect = yield* withListingSourceSelectFx({
		sort,
		meta,
	});

	const gallerySelect = yield* withGallerySelectFx({});

	return listingSourceSelect.selectAll("l").select((eb) => [
		sql<
			CategoryRestrictionEnumSchema.Type[]
		>`coalesce(${eb.ref("cat.restrictions")}, '{}'::category_restriction_enum[]) || COALESCE(array[${eb.ref("l.restriction")}], '{}'::category_restriction_enum[])`.as(
			"restrictions",
		),
		sql<LocationTableSchema.Type>`to_jsonb(${eb.table("loc")}.*)`.as("location"),
		sql<CategoryTableSchema.Type>`to_jsonb(${eb.table("cat")}.*)`.as("category"),
		sql<ListingDeliveryEnumSchema.Type[] | null>`to_jsonb(${eb.ref("l.delivery")})`.as(
			"delivery",
		),
		sql<string[] | null>`to_jsonb(${eb.ref("l.pros")})`.as("pros"),
		sql<string[] | null>`to_jsonb(${eb.ref("l.cons")})`.as("cons"),
		eb
			.case()
			.when(sql.lit(meta?.latLon != null))
			.then(
				sql`
                        ST_Distance(
                            ${eb.ref("loc.geo")},
                            ST_SetSRID(
                                ST_MakePoint(
                                    ${eb.val(meta?.latLon?.lon)},
                                    ${eb.val(meta?.latLon?.lat)}
                                ),
                                4326
                            )::geography
                        ) / 1000
		            `,
			)
			.else(null)
			.end()
			.$castTo<number | null>()
			.as("distance"),

		jsonObjectFrom(gallerySelect.where("gal.id", "=", eb.ref("l.galleryId")).limit(1))
			.$notNull()
			.as("gallery"),

		sql<boolean>`${eb.ref("l.userId")} = ${eb.val(userId)}`.as("my"),

		eb
			.exists(
				eb
					.selectFrom("favourite as f")
					.select(sql`1`.as("true"))
					.whereRef("f.listingId", "=", "l.id")
					.where("f.userId", "=", userId),
			)
			.$castTo<boolean>()
			.as("isFavourite"),

		eb
			.exists(
				eb
					.selectFrom("ignore as i")
					.select(sql`1`.as("true"))
					.whereRef("i.listingId", "=", "l.id")
					.where("i.userId", "=", userId),
			)
			.$castTo<boolean>()
			.as("isIgnored"),

		eb
			.exists(
				eb
					.selectFrom("flag as f")
					.select(sql`1`.as("true"))
					.whereRef("f.listingId", "=", "l.id")
					.where("f.userId", "=", userId),
			)
			.$castTo<boolean>()
			.as("hasFlag"),

		eb
			.selectFrom("transaction as lt")
			.select("lt.id")
			.whereRef("lt.listingId", "=", "l.id")
			.where("lt.userId", "=", userId)
			.where("lt.status", "in", [
				"interest",
				"trade",
				"rejected",
				"resolved",
				"success",
			])
			.orderBy("lt.statusUpdatedAt", "desc")
			.orderBy("lt.id", "desc")
			.limit(1)
			.as("transactionId"),

		eb
			.selectFrom("thumb as fb")
			.select("fb.type")
			.whereRef("fb.listingId", "=", "l.id")
			.where("fb.userId", "=", userId)
			.limit(1)
			.$castTo<ThumbEnumSchema.Type | null>()
			.as("thumb"),
	]);
});
