import { Effect } from "effect";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { TransactionEntryDirectionEnumSchema } from "~/user/transaction-entry/server/schema/TransactionEntryDirectionEnumSchema";
import type { TransactionEntrySchema } from "~/user/transaction-entry/server/schema/TransactionEntrySchema";

export namespace withTransactionListingSourceSelectFx {
	export type Select = Effect.Effect.Success<
		ReturnType<typeof withTransactionListingSourceSelectFx>
	>;
}

export const withTransactionListingSourceSelectFx = Effect.fn(
	"withTransactionListingSourceSelectFx",
)(function* () {
	const { kysely } = yield* KyselyContextFx;

	return kysely
		.selectFrom("listing as l")
		.selectAll("l")
		.select((eb) => {
			/**
			 * Pick the latest seller-visible timeline entry for listing-level previews.
			 *
			 * Buyer text written while a transaction is still in `interest` is a private
			 * buyer-side buffer. The seller dashboard groups transactions by listing, so if
			 * this aggregate used the raw latest entry, buffered buyer text would leak into
			 * the list before the seller opens the trade. Non-text entries stay visible so
			 * status records like `status-interest` can still explain that the listing needs
			 * seller attention.
			 */
			const lastActivitySelect = eb
				.selectFrom("transaction_entry as te")
				.innerJoin("transaction as lt", "lt.id", "te.transactionId")
				.whereRef("lt.listingId", "=", "l.id")
				.where((eb) => {
					return eb.or([
						eb("te.kind", "!=", "text"),
						eb("lt.status", "!=", "interest"),
					]);
				})
				.orderBy("te.createdAt", "desc")
				.limit(1);

			return [
				jsonObjectFrom(
					lastActivitySelect.selectAll("te").select((eb) => {
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
				lastActivitySelect.select("te.createdAt").$asScalar().$notNull().as("lastAt"),
			];
		})
		.where(({ exists, selectFrom }) => {
			return exists(
				selectFrom("transaction as lt")
					.select("lt.id")
					.whereRef("lt.listingId", "=", "l.id"),
			);
		});
});
