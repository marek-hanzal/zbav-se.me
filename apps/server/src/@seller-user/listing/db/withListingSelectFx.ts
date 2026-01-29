import { Effect } from "effect";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { withListingSourceSelectFx } from "~/@seller-user/listing/db/withListingSourceSelectFx";
import { withGallerySelectFx } from "~/@user/gallery/db/withGallerySelectFx";
import type { ListingDeliveryEnumSchema } from "~/database/@enum/ListingDeliveryEnumSchema";
import type { ThumbEnumSchema } from "~/database/@enum/ThumbEnumSchema";
import type { CategoryTableSchema } from "~/database/@table/CategoryTableSchema";
import type { LocationTableSchema } from "~/database/@table/LocationTableSchema";

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
			.innerJoin("transaction_status as lts", (join) =>
				join
					.onRef("lts.transactionId", "=", "lt.id")
					.on((eb) =>
						eb(
							"lts.id",
							"=",
							eb
								.selectFrom("transaction_status as lts2")
								.select("lts2.id")
								.whereRef("lts2.transactionId", "=", "lt.id")
								.orderBy("lts2.createdAt", "desc")
								.limit(1),
						),
					),
			)
			.select("lt.id")
			.whereRef("lt.listingId", "=", "l.id")
			.where("lt.userId", "=", userId)
			.where("lts.status", "in", [
				"pending",
				"open",
				"rejected",
				"resolved",
				"success",
			])
			.orderBy("lts.createdAt", "desc")
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
