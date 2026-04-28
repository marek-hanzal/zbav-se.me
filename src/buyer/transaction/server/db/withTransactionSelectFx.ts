import { Effect } from "effect";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { withTransactionSourceSelectFx } from "~/buyer/transaction/server/db/withTransactionSourceSelectFx";
import type { TransactionSortSchema } from "~/buyer/transaction/server/schema/TransactionSortSchema";
import { TransactionEntryDirectionEnumSchema } from "~/user/transaction-entry/server/schema/TransactionEntryDirectionEnumSchema";
import type { TransactionEntrySchema } from "~/user/transaction-entry/server/schema/TransactionEntrySchema";

export namespace withTransactionSelectFx {
	export interface Props {
		sort?: TransactionSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withTransactionSelectFx>>;
}

export const withTransactionSelectFx = Effect.fn("withTransactionSelectFx")(function* ({
	sort,
}: withTransactionSelectFx.Props) {
	const transactionSourceSelect = yield* withTransactionSourceSelectFx({
		sort,
	});

	return transactionSourceSelect
		.selectAll("lt")
		.select("l.withImageUrl")
		.select((eb) => eb.val("not yet").as("title"))
		.select((eb) => {
			const lastActivitySelect = eb
				.selectFrom("transaction_entry as te")
				.whereRef("te.transactionId", "=", "lt.id")
				.orderBy("te.createdAt", "desc")
				.limit(1);

			return [
				eb.fn
					.coalesce(
						lastActivitySelect.select("te.createdAt").$asScalar(),
						eb.ref("lt.updatedAt"),
					)
					.as("lastAt"),
				jsonObjectFrom(
					lastActivitySelect
						.selectAll("te")
						.select(eb.ref("l.id").as("listingId"))
						.select((eb) => {
							return eb
								.case()
								.when("te.userId", "is", null)
								.then(TransactionEntryDirectionEnumSchema.enum.system)
								.when("te.userId", "=", eb.ref("lt.userId"))
								.then(TransactionEntryDirectionEnumSchema.enum.out)
								.else(TransactionEntryDirectionEnumSchema.enum.in)
								.end()
								.as("direction");
						}),
				)
					.$notNull()
					.$castTo<TransactionEntrySchema.Type>()
					.as("entry"),
				eb.fn
					.coalesce(
						eb
							.selectFrom("activity as i")
							.select(sql<number>`count(*)::int`.as("unread"))
							.whereRef("i.userId", "=", "lt.userId")
							.where("i.family", "=", "transaction")
							.where("i.type", "=", "seller-message")
							.where("i.archivedAt", "is", null)
							.where((eb) => {
								return sql<boolean>`${eb.ref("i.reference")} @> ARRAY[${eb.ref("lt.id")}]::text[]`;
							}),
						sql.lit(0),
					)
					.as("unread"),
				eb.ref("lt.status").$notNull().as("status"),
			];
		});
});
