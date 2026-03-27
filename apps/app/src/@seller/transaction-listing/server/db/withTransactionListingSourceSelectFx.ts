import { Effect } from "effect";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import type { TransactionEntryDirectionEnumSchema } from "~/@user/transaction-entry/server/schema/TransactionEntryDirectionEnumSchema";
import type { TransactionEntrySchema } from "~/@user/transaction-entry/server/schema/TransactionEntrySchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";

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
			const lastActivitySelect = eb
				.selectFrom("transaction_entry as te")
				.innerJoin("transaction as lt", "lt.id", "te.transactionId")
				.whereRef("lt.listingId", "=", "l.id")
				.orderBy("te.createdAt", "desc")
				.limit(1);

			return [
				jsonObjectFrom(
					lastActivitySelect.selectAll("te").select((eb) =>
						sql<TransactionEntryDirectionEnumSchema.Type>`case
							when ${eb.ref("te.userId")} is null then 'system'
							when ${eb.ref("te.userId")} = ${eb.ref("l.userId")} then 'out'
							else 'in'
						end`.as("direction"),
					),
				)
					.$notNull()
					.$castTo<TransactionEntrySchema.Type>()
					.as("entry"),
				lastActivitySelect.select("te.createdAt").$asScalar().$notNull().as("lastAt"),
			];
		})
		.where(({ exists, selectFrom }) =>
			exists(
				selectFrom("transaction as lt")
					.select("lt.id")
					.whereRef("lt.listingId", "=", "l.id"),
			),
		);
});
