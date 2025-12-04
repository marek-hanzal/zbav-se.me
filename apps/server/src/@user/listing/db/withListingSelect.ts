import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { withGallerySelect } from "~/@user/gallery/db/withGallerySelect";
import { withListingCollectionSelect } from "~/@user/listing/db/withListingCollectionSelect";
import type { CategoryDbSchema } from "~/app/category/schema/CategoryDbSchema";
import type { LocationDbSchema } from "~/app/location/schema/LocationDbSchema";

export namespace withListingSelect {
	export interface Props extends withListingCollectionSelect.Props {
		userId: string;
	}

	export type Select = ReturnType<typeof withListingSelect>;
}

export const withListingSelect = ({ database, userId, sort, meta }: withListingSelect.Props) => {
	return withListingCollectionSelect({
		database,
		sort,
		meta,
	})
		.selectAll("l")
		.select((eb) => [
			sql<LocationDbSchema.Type>`to_jsonb(${eb.table("loc")}.*)`.as("location"),
			sql<CategoryDbSchema.Type>`to_jsonb(${eb.table("cat")}.*)`.as("category"),

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
				.selectFrom("listing_transaction as lt")
				.innerJoin("listing_transaction_status as lts", "lts.listingTransactionId", "lt.id")
				.select("lt.id as transactionId")
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
				)
				.as("transactionId"),
		]);
};
