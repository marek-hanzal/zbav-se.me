import { Effect } from "effect";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import { withGallerySelectFx } from "~/app/gallery/db/withGallerySelectFx";
import type { LocationDbSchema } from "~/app/location/schema/LocationDbSchema";
import { withTransactionCollectionSelectFx } from "~/app/transaction/db/withTransactionCollectionSelectFx";
import type { TransactionSortSchema } from "~/app/transaction/schema/TransactionSortSchema";

export namespace withTransactionSelectFx {
	export interface Props {
		sort?: TransactionSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withTransactionSelectFx>>;
}

export const withTransactionSelectFx = Effect.fn("withTransactionSelectFx")(function* ({
	sort,
}: withTransactionSelectFx.Props) {
	const transactionCollectionSelect = yield* withTransactionCollectionSelectFx({});

	const gallerySelect = yield* withGallerySelectFx({});

	let query = transactionCollectionSelect
		.clearSelect()
		.selectAll("lt")
		.select([
			"l.title",
			"l.price",
			"l.priceType",
			"l.currency",
			(eb) => sql<LocationDbSchema.Type>`to_jsonb(${eb.table("loc")}.*)`.as("location"),
			(eb) =>
				jsonObjectFrom(gallerySelect.where("gal.id", "=", eb.ref("l.galleryId")).limit(1))
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
							.when("pending")
							.then(10)
							.when("dispute")
							.then(15)
							.when("open")
							.then(20)
							.when("resolved")
							.then(30)
							.when("rejected")
							.then(40)
							.when("expired")
							.then(50)
							.when("success")
							.then(60)
							.when("closed")
							.then(70)
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
});
