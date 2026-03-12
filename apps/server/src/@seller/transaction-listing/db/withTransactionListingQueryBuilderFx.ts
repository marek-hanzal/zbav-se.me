import { Effect } from "effect";
import { sql } from "kysely";
import type { withTransactionListingSourceSelectFx } from "~/@seller/transaction-listing/db/withTransactionListingSourceSelectFx";
import type { TransactionListingFilterSchema } from "~/@seller/transaction-listing/schema/TransactionListingFilterSchema";

export namespace withTransactionListingQueryBuilderFx {
	export interface Props<
		TSelect extends
			withTransactionListingSourceSelectFx.Select = withTransactionListingSourceSelectFx.Select,
	> {
		select: TSelect;
		where?: TransactionListingFilterSchema.Type;
	}

	export type Callback = <TSelect extends withTransactionListingSourceSelectFx.Select>(
		props: Props<TSelect>,
	) => TSelect;
}

export const withTransactionListingQueryBuilderFx = Effect.fn(
	"withTransactionListingQueryBuilderFx",
)(function* <TSelect extends withTransactionListingSourceSelectFx.Select>({
	select,
	where,
}: withTransactionListingQueryBuilderFx.Props<TSelect>) {
	let query = select;

	if (!where) {
		return yield* Effect.succeed(select);
	}

	if (where.id) {
		query = query.where("l.id", "=", where.id) as TSelect;
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("l.id", "in", where.idIn) as TSelect;
	}

	if (where.fulltext) {
		const fulltext = where.fulltext;

		query = query.where((eb) =>
			eb.or([
				eb("l.title", "like", `%${fulltext}%`),
			]),
		) as TSelect;
	}

	if (where.userId) {
		query = query.where("l.userId", "=", where.userId) as TSelect;
	}

	if (where.active !== undefined) {
		query = query.where(({ exists, not, selectFrom }) => {
			const unreadSelect = selectFrom("inbox as i")
				.select("i.id")
				.whereRef("i.userId", "=", "l.userId")
				.where("i.family", "=", "transaction")
				.where("i.type", "=", "buyer-message")
				.where("i.archivedAt", "is", null)
				.where(
					(eb) =>
						sql<boolean>`${eb.ref("i.reference")} @> ARRAY[${eb.ref("l.id")}]::text[]`,
				);

			return where.active ? exists(unreadSelect) : not(exists(unreadSelect));
		}) as TSelect;
	}

	return yield* Effect.succeed(query);
});
