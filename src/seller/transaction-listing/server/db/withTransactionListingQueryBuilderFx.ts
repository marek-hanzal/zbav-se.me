import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import type { withTransactionListingSourceSelectFx } from "~/seller/transaction-listing/server/db/withTransactionListingSourceSelectFx";
import type { TransactionListingFilterSchema } from "~/seller/transaction-listing/server/schema/TransactionListingFilterSchema";

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
	const openStatuses = [
		"interest",
		"trade",
		"resolved",
		"dispute",
	] as const;
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

	query = match(where.flow)
		.with("attention", () => {
			return query.where((eb) => {
				return eb.exists(
					eb
						.selectFrom("activity as i")
						.select("i.id")
						.whereRef("i.userId", "=", "l.userId")
						.where("i.family", "=", "transaction")
						.where("i.type", "=", "buyer-message")
						.where("i.archivedAt", "is", null)
						.where((eb) => {
							return sql<boolean>`${eb.ref("i.reference")} @> ARRAY[${eb.ref("l.id")}]::text[]`;
						}),
				);
			}) as TSelect;
		})
		.with("resolved", () => {
			return query.where((eb) => {
				return eb.not(
					eb.exists(
						eb
							.selectFrom("activity as i")
							.select("i.id")
							.whereRef("i.userId", "=", "l.userId")
							.where("i.family", "=", "transaction")
							.where("i.type", "=", "buyer-message")
							.where("i.archivedAt", "is", null)
							.where((eb) => {
								return sql<boolean>`${eb.ref("i.reference")} @> ARRAY[${eb.ref("l.id")}]::text[]`;
							}),
					),
				);
			}) as TSelect;
		})
		.with("archived", () => {
			return query.where((eb) => {
				return eb.not(
					eb.exists(
						eb
							.selectFrom("transaction as lt")
							.select("lt.id")
							.whereRef("lt.listingId", "=", "l.id")
							.where("lt.status", "in", openStatuses),
					),
				);
			}) as TSelect;
		})
		.with(undefined, () => {
			return query;
		})
		.exhaustive();

	return yield* Effect.succeed(query);
});
