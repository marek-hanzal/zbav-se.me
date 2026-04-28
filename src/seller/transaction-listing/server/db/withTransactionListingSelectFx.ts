import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import { withTransactionListingSourceSelectFx } from "~/seller/transaction-listing/server/db/withTransactionListingSourceSelectFx";
import type { TransactionListingSortSchema } from "~/seller/transaction-listing/server/schema/TransactionListingSortSchema";

export namespace withTransactionListingSelectFx {
	export interface Props {
		sort?: TransactionListingSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withTransactionListingSelectFx>>;
}

export const withTransactionListingSelectFx = Effect.fn("withTransactionListingSelectFx")(
	function* ({ sort }: withTransactionListingSelectFx.Props) {
		const sourceSelect = yield* withTransactionListingSourceSelectFx();

		let query = sourceSelect.select((eb) => {
			return [
				eb.ref("l.id").as("listingId"),
				eb.ref("l.galleryId").as("galleryId"),
				eb.ref("l.withImageUrl").as("withImageUrl"),
				sql<number>`(${eb
					.selectFrom("transaction as lt")
					.select(sql<number>`count(*)::int`.as("count"))
					.whereRef("lt.listingId", "=", "l.id")})`.as("count"),
				eb.fn
					.coalesce(
						eb
							.selectFrom("activity as i")
							.select((eb) =>
								sql<number>`count(distinct ${eb.ref("i.payload")} ->> 'transactionId')::int`.as(
									"unreadCount",
								),
							)
							.whereRef("i.userId", "=", "l.userId")
							.where("i.family", "=", "transaction")
							.where("i.type", "=", "buyer-message")
							.where("i.archivedAt", "is", null)
							.where(
								(eb) =>
									sql<boolean>`${eb.ref("i.reference")} @> ARRAY[${eb.ref("l.id")}]::text[]`,
							),
						eb.lit(0),
					)
					.as("unread"),
			];
		});

		for (const item of sort ?? []) {
			query = match(item.field)
				.with("createdAt", () => query.orderBy("l.createdAt", item.order))
				.with("lastAt", () => query.orderBy("lastAt", item.order))
				.exhaustive();
		}

		return query;
	},
);
