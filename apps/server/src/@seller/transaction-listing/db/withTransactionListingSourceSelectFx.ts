import { Effect } from "effect";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace withTransactionListingSourceSelectFx {
	export type Props = {};

	export type Select = Effect.Effect.Success<
		ReturnType<typeof withTransactionListingSourceSelectFx>
	>;
}

export const withTransactionListingSourceSelectFx = Effect.fn(
	"withTransactionListingSourceSelectFx",
)(function* (_props: withTransactionListingSourceSelectFx.Props) {
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
				jsonObjectFrom(lastActivitySelect.selectAll("te")).$notNull().as("entry"),
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
