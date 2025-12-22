import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import { withGallerySelect } from "~/app/gallery/db/withGallerySelect";
import type { LocationDbSchema } from "~/app/location/schema/LocationDbSchema";
import { withTransactionCollectionSelect } from "~/app/transaction/db/withTransactionCollectionSelect";
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
	let query = withTransactionCollectionSelect({
		database,
		sort: [],
	})
		.clearSelect()
		.selectAll("lt")
		.select([
			"l.title",
			"l.price",
			"l.priceType",
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
			(eb) => eb.ref("status.latestStatus").$notNull().as("status"),
		]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("status", () =>
				query.orderBy(
					(eb) =>
						eb
							.case(eb.ref("status.latestStatus"))
							.when("request")
							.then(10)
							.when("accepted")
							.then(20)
							.when("success")
							.then(30)
							.when("rejected")
							.then(40)
							.else(999)
							.end(),
					item.direction,
				),
			)
			.with("createdAt", () => query.orderBy("lt.createdAt", item.direction))
			.with("updatedAt", () => query.orderBy("lt.updatedAt", item.direction))
			.with("expiresAt", () => query.orderBy("lt.expiresAt", item.direction))
			.exhaustive();
	}

	return query;
};
