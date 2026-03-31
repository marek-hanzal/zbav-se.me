import { Effect } from "effect";
import type { withTransactionEntrySelectFx } from "~/user/transaction-entry/server/db/withTransactionEntrySelectFx";
import type { TransactionEntryFilterSchema } from "~/user/transaction-entry/server/schema/TransactionEntryFilterSchema";

export namespace withTransactionEntryQueryBuilderFx {
	export interface Props<TSelect extends withTransactionEntrySelectFx.Select> {
		userId: string;
		select: TSelect;
		where?: TransactionEntryFilterSchema.Type;
	}
}

export const withTransactionEntryQueryBuilderFx = Effect.fn("withTransactionEntryQueryBuilderFx")(
	function* <TSelect extends withTransactionEntrySelectFx.Select>({
		userId,
		select,
		where,
	}: withTransactionEntryQueryBuilderFx.Props<TSelect>) {
		let query = select.where((eb) =>
			eb.exists((eb) =>
				eb
					.selectFrom("transaction_user as tu")
					.select("tu.userId")
					.whereRef("tu.transactionId", "=", "te.transactionId")
					.where("tu.userId", "=", userId),
			),
		) as TSelect;

		if (!where) {
			return yield* Effect.succeed(query);
		}

		if (where.id) {
			query = query.where("te.id", "=", where.id) as TSelect;
		}

		if (where.idIn?.length) {
			query = query.where("te.id", "in", where.idIn) as TSelect;
		}

		if (where.transactionId) {
			query = query.where("te.transactionId", "=", where.transactionId) as TSelect;
		}

		if (where.userId) {
			query = query.where("te.userId", "=", where.userId) as TSelect;
		}

		if (where.kind) {
			query = query.where("te.kind", "=", where.kind) as TSelect;
		}

		if (where.kindIn?.length) {
			query = query.where("te.kind", "in", where.kindIn) as TSelect;
		}

		return yield* Effect.succeed(query);
	},
);
