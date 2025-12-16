import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import { withGallerySelect } from "~/app/gallery/db/withGallerySelect";
import type { LocationDbSchema } from "~/app/location/schema/LocationDbSchema";
import type { TransactionSortSchema } from "~/app/transaction/schema/TransactionSortSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withTransactionSelect {
	export interface Props {
		database: WithDatabase;
		sort: TransactionSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withTransactionSelect>;
}

export const withTransactionSelect = ({ database, sort }: withTransactionSelect.Props) => {
	let query = database
		.selectFrom("transaction as lt")
		.innerJoin("listing as l", "lt.listingId", "l.id")
		.innerJoin("location as loc", "l.locationId", "loc.id")
		.selectAll("lt")
		.select([
			"l.title",
			"l.price",
			"l.currency",
			(eb) => sql<LocationDbSchema.Type>`to_jsonb(${eb.table("loc")}.*)`.as("location"),
			(eb) =>
				jsonObjectFrom(
					withGallerySelect({
						database,
						sort: undefined,
					})
						.where("gal.id", "=", eb.ref("l.galleryId"))
						.limit(1),
				)
					.$notNull()
					.as("gallery"),
		]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("lt.createdAt", item.direction))
			.with("updatedAt", () => query.orderBy("lt.updatedAt", item.direction))
			.with("expiresAt", () => query.orderBy("lt.expiresAt", item.direction))
			.exhaustive();
	}

	return query;
};
