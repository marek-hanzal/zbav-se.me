import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import { withGallerySelect } from "~/@user/gallery/db/withGallerySelect";
import type { ListingMetaSchema } from "~/@user/listing/schema/ListingMetaSchema";
import type { ListingSortSchema } from "~/@user/listing/schema/ListingSortSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withListingSelect {
	export interface Props {
		database: WithDatabase;
		userId: string;
		sort: ListingSortSchema.Type[] | undefined;
		meta: ListingMetaSchema.Type | undefined;
	}

	export type Select = ReturnType<typeof withListingSelect>;
}

export const withListingSelect = ({ database, userId, sort, meta }: withListingSelect.Props) => {
	let query = database
		.selectFrom("listing as l")
		.innerJoin("location as loc", "loc.id", "l.locationId")
		.innerJoin("category as cat", "cat.id", "l.categoryId")
		.selectAll("l")
		.select((eb) => [
			sql`to_jsonb(${eb.table("loc")}.*)`.as("location"),

			sql`to_jsonb(${eb.table("cat")}.*)`.as("category"),

			jsonObjectFrom(
				withGallerySelect({
					database,
					sort: undefined,
				})
					.where(
						"gal.id",
						"in",
						eb
							.selectFrom("listing_gallery as lg")
							.select("lg.galleryId")
							.whereRef("lg.listingId", "=", "l.id")
							.orderBy("lg.createdAt", "desc")
							.limit(1),
					)
					.limit(1),
			)
				.$notNull()
				.as("gallery"),

			eb
				.exists(
					eb
						.selectFrom("listing_cart as lc")
						.select(sql`1`.as("true"))
						.whereRef("lc.listingId", "=", "l.id")
						.where("lc.userId", "=", userId),
				)
				.$castTo<boolean>()
				.as("isInCart"),

			eb
				.exists(
					eb
						.selectFrom("listing_ignore as li")
						.select(sql`1`.as("true"))
						.whereRef("li.listingId", "=", "l.id")
						.where("li.userId", "=", userId),
				)
				.$castTo<boolean>()
				.as("isIgnored"),

			eb
				.exists(
					eb
						.selectFrom("listing_flag as lf")
						.select(sql`1`.as("true"))
						.whereRef("lf.listingId", "=", "l.id")
						.where("lf.userId", "=", userId),
				)
				.$castTo<boolean>()
				.as("hasFlag"),

			eb
				.exists(
					eb
						.selectFrom("listing_transaction as lt")
						.innerJoin(
							"listing_transaction_status as lts",
							"lts.listingTransactionId",
							"lt.id",
						)
						.select(sql`1`.as("true"))
						.whereRef("lt.listingId", "=", "l.id")
						.where("lt.userId", "=", userId)
						.where("lts.status", "in", [
							"request",
							"accepted",
						])
						.where((eb) =>
							eb(
								"lts.id",
								"=",
								eb
									.selectFrom("listing_transaction_status as lts2")
									.select("lts2.id")
									.whereRef("lts2.listingTransactionId", "=", "lt.id")
									.orderBy("lts2.createdAt", "desc")
									.limit(1),
							),
						),
				)
				.$castTo<boolean>()
				.as("hasTransaction"),
		]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("price", () => query.orderBy("l.price", item.direction))
			.with("condition", () => query.orderBy("l.condition", item.direction))
			.with("age", () => query.orderBy("l.age", item.direction))
			.with("createdAt", () => query.orderBy("l.createdAt", item.direction))
			.with("updatedAt", () => query.orderBy("l.updatedAt", item.direction))
			.with("expiresAt", () => query.orderBy("l.expiresAt", item.direction))
			.with("geo", () => {
				if (!meta?.latLon) {
					return query;
				}
				const { lon, lat } = meta.latLon;

				return query.orderBy(
					(eb) =>
						sql`${eb.ref("loc.geo")} <-> ST_SetSRID(ST_MakePoint(${eb.val(
							lon,
						)}, ${eb.val(lat)}), 4326)`,
					item.direction,
				);
			})
			.exhaustive();
	}

	return query;
};
