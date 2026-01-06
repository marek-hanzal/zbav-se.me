import { Effect } from "effect";
import { match } from "ts-pattern";
import type { TransactionMetaSchema } from "~/@user/transaction/schema/TransactionMetaSchema";
import type { withTransactionCollectionSelectFx } from "~/app/transaction/db/withTransactionCollectionSelectFx";
import type { TransactionFilterSchema } from "~/app/transaction/schema/TransactionFilterSchema";

export namespace withTransactionQueryBuilderFx {
	export interface Props<
		TSelect extends
			withTransactionCollectionSelectFx.Select = withTransactionCollectionSelectFx.Select,
	> {
		select: TSelect;
		where?: TransactionFilterSchema.Type;
		meta?: TransactionMetaSchema.Type;
	}

	export type Callback = <TSelect extends withTransactionCollectionSelectFx.Select>(
		props: Props<TSelect>,
	) => TSelect;
}

/**
 * Standalone query builder that applies all filters from TransactionQuerySchema.
 * Generic to support extended select types (e.g. collection selects returning IDs only).
 */
export const withTransactionQueryBuilderFx = Effect.fn("withTransactionQueryBuilderFx")(function* <
	TSelect extends withTransactionCollectionSelectFx.Select,
>({ select, where, meta }: withTransactionQueryBuilderFx.Props<TSelect>) {
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
		const userSide = meta?.side;

		query = query.where((eb) => {
			const buyerCondition = eb("lt.userId", "=", userId);
			const sellerCondition = eb.exists((eb) =>
				eb
					.selectFrom("listing as l")
					.select("l.id")
					.whereRef("l.id", "=", "lt.listingId")
					.where("l.userId", "=", userId),
			);

			return match(userSide)
				.with("buyer", () => {
					return buyerCondition;
				})
				.with("seller", () => {
					return sellerCondition;
				})
				.with(undefined, () => {
					return eb.or([
						buyerCondition,
						sellerCondition,
					]);
				})
				.exhaustive();
		}) as TSelect;
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
