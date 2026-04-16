import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import type { withTransactionSourceSelectFx } from "~/seller/transaction/server/db/withTransactionSourceSelectFx";
import type { TransactionFilterSchema } from "~/seller/transaction/server/schema/TransactionFilterSchema";

export namespace withTransactionQueryBuilderFx {
	export interface Props<
		TSelect extends withTransactionSourceSelectFx.Select = withTransactionSourceSelectFx.Select,
	> {
		select: TSelect;
		where?: TransactionFilterSchema.Type;
	}

	export type Callback = <TSelect extends withTransactionSourceSelectFx.Select>(
		props: Props<TSelect>,
	) => TSelect;
}

export const withTransactionQueryBuilderFx = Effect.fn("withTransactionQueryBuilderFx")(function* <
	TSelect extends withTransactionSourceSelectFx.Select,
>({ select, where }: withTransactionQueryBuilderFx.Props<TSelect>) {
	let query = select;

	if (!where) {
		return yield* Effect.succeed(select);
	}

	if (where.id) {
		query = query.where("lt.id", "=", where.id) as TSelect;
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("lt.id", "in", where.idIn) as TSelect;
	}

	if (where.userId) {
		query = query.where("l.userId", "=", where.userId) as TSelect;
	}

	if (where.listingId) {
		query = query.where("lt.listingId", "=", where.listingId) as TSelect;
	}

	query = match(where.activity)
		.with("unread", () => {
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
							return sql<boolean>`${eb.ref("i.reference")} @> ARRAY[${eb.ref("lt.id")}]::text[]`;
						}),
				);
			}) as TSelect;
		})
		.with("archived", () => {
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
								return sql<boolean>`${eb.ref("i.reference")} @> ARRAY[${eb.ref("lt.id")}]::text[]`;
							}),
					),
				);
			}) as TSelect;
		})
		.with(undefined, () => {
			return query;
		})
		.exhaustive();

	if (where.status) {
		query = query.where("lt.status", "=", where.status) as TSelect;
	}

	if (where.statusIn && where.statusIn.length > 0) {
		query = query.where("lt.status", "in", where.statusIn) as TSelect;
	}

	return yield* Effect.succeed(query);
});
