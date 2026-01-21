import { Effect } from "effect";
import type { TransactionListingFilterSchema } from "../schema/TransactionListingFilterSchema";
import type { withTransactionListingCollectionSelectFx } from "./withTransactionListingCollectionSelectFx";

export namespace withTransactionListingQueryBuilderFx {
	export interface Props<
		TSelect extends
			withTransactionListingCollectionSelectFx.Select = withTransactionListingCollectionSelectFx.Select,
	> {
		select: TSelect;
		where?: TransactionListingFilterSchema.Type;
	}

	export type Callback = <TSelect extends withTransactionListingCollectionSelectFx.Select>(
		props: Props<TSelect>,
	) => TSelect;
}

export const withTransactionListingQueryBuilderFx = Effect.fn(
	"withTransactionListingQueryBuilderFx",
)(function* <TSelect extends withTransactionListingCollectionSelectFx.Select>({
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

	return yield* Effect.succeed(query);
});
