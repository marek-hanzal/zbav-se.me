import { Effect } from "effect";
import type { withTransactionSourceSelectFx } from "~/@buyer-user/transaction/db/withTransactionSourceSelectFx";
import type { TransactionFilterSchema } from "~/@buyer-user/transaction/schema/TransactionFilterSchema";

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

/**
 * Standalone query builder that applies all filters from TransactionQuerySchema.
 * Generic to support extended select types (e.g. collection selects returning IDs only).
 */
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
		const userId = where.userId;

		query = query.where("lt.userId", "=", userId) as TSelect;
	}

	if (where.listingId) {
		query = query.where("lt.listingId", "=", where.listingId) as TSelect;
	}

	if (where.status) {
		const status = where.status;

		query = query.where((eb) => {
			return eb.exists((eb) =>
				eb
					.selectFrom("transaction_status as lts")
					.select("lts.id")
					.whereRef("lts.transactionId", "=", "lt.id")
					.where("lts.status", "=", status)
					.where((eb) => {
						return eb.not(
							eb.exists((eb) =>
								eb
									.selectFrom("transaction_status as lts2")
									.select("lts2.id")
									.whereRef("lts2.transactionId", "=", "lt.id")
									.whereRef("lts2.createdAt", ">", "lts.createdAt"),
							),
						);
					}),
			);
		}) as TSelect;
	}

	if (where.statusIn && where.statusIn.length > 0) {
		const statusIn = where.statusIn;

		query = query.where((eb) => {
			return eb.exists((eb) =>
				eb
					.selectFrom("transaction_status as lts")
					.select("lts.id")
					.whereRef("lts.transactionId", "=", "lt.id")
					.where("lts.status", "in", statusIn)
					.where((eb) => {
						return eb.not(
							eb.exists((eb) =>
								eb
									.selectFrom("transaction_status as lts2")
									.select("lts2.id")
									.whereRef("lts2.transactionId", "=", "lt.id")
									.whereRef("lts2.createdAt", ">", "lts.createdAt"),
							),
						);
					}),
			);
		}) as TSelect;
	}

	return yield* Effect.succeed(query);
});
