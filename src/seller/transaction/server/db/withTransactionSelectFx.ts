import { Effect } from "effect";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { withTransactionSourceSelectFx } from "~/seller/transaction/server/db/withTransactionSourceSelectFx";
import type { TransactionSortSchema } from "~/seller/transaction/server/schema/TransactionSortSchema";
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
		.select([
			"l.withImageUrl",
		])
		.select((eb) => {
			/**
			 * Pick the latest seller-visible timeline entry for seller transaction previews.
			 *
			 * Buyer text written in `interest` belongs to the buyer-side buffer and must not
			 * appear in seller list/detail previews before the seller opens the trade. This
			 * keeps the preview aligned with the main transaction-entry visibility gate while
			 * still allowing non-text status entries to explain the current state.
			 */
			const lastActivitySelect = eb
				.selectFrom("transaction_entry as te")
				.whereRef("te.transactionId", "=", "lt.id")
				.where((eb) => {
					return eb.or([
						eb("te.kind", "!=", "text"),
						eb("lt.status", "!=", "interest"),
					]);
				})
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
						.select("l.id as listingId")
						.select((eb) => {
							return sql<TransactionEntryDirectionEnumSchema.Type>`case
                        when ${eb.ref("te.userId")} is null then ${TransactionEntryDirectionEnumSchema.enum.system}
                        when ${eb.ref("te.userId")} = ${eb.ref("l.userId")} then ${TransactionEntryDirectionEnumSchema.enum.out}
                        else ${TransactionEntryDirectionEnumSchema.enum.in}
                    end`.as("direction");
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
							.whereRef("i.userId", "=", "l.userId")
							.where("i.family", "=", "transaction")
							.where("i.type", "=", "buyer-message")
							.where("i.archivedAt", "is", null)
							.where((eb) => {
								return sql<boolean>`${eb.ref("i.reference")} @> ARRAY[${eb.ref("lt.id")}]::text[]`;
							}),
						eb.lit(0),
					)
					.as("unread"),
				eb.ref("lt.status").$notNull().as("status"),
			];
		});
});
