import { Effect } from "effect";
import { match } from "ts-pattern";
import type { TransactionListingSortSchema } from "~/@seller/transaction-listing/schema/TransactionListingSortSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace withTransactionListingSourceSelectFx {
	export interface Props {
		sort?: TransactionListingSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<
		ReturnType<typeof withTransactionListingSourceSelectFx>
	>;
}

export const withTransactionListingSourceSelectFx = Effect.fn(
	"withTransactionListingSourceSelectFx",
)(function* ({ sort }: withTransactionListingSourceSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely
		.selectFrom("listing as l")
		.where(({ exists, selectFrom }) =>
			exists(
				selectFrom("transaction as lt")
					.select("lt.id")
					.whereRef("lt.listingId", "=", "l.id"),
			),
		);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("l.createdAt", item.order))
			.exhaustive();
	}

	return query;
});
