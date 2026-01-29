import { Effect } from "effect";
import type { withTransactionStatusSelectFx } from "~/@session/transaction-status/db/withTransactionStatusSelectFx";
import type { TransactionStatusFilterSchema } from "~/@session/transaction-status/schema/TransactionStatusFilterSchema";

export namespace withTransactionStatusQueryBuilderFx {
	export interface Props {
		select: withTransactionStatusSelectFx.Select;
		where?: TransactionStatusFilterSchema.Type;
	}

	export type Callback = (props: Props) => withTransactionStatusSelectFx.Select;
}

export const withTransactionStatusQueryBuilderFx = Effect.fn("withTransactionStatusQueryBuilderFx")(
	function* ({ select, where }: withTransactionStatusQueryBuilderFx.Props) {
		let query = select;

		if (!where) {
			return yield* Effect.succeed(select);
		}

		if (where.id) {
			query = query.where("lts.id", "=", where.id);
		}

		if (where.idIn && where.idIn.length > 0) {
			query = query.where("lts.id", "in", where.idIn);
		}

		if (where.transactionId) {
			query = query.where("lts.transactionId", "=", where.transactionId);
		}

		if (where.status) {
			query = query.where("lts.status", "=", where.status);
		}

		if (where.statusIn && where.statusIn.length > 0) {
			query = query.where("lts.status", "in", where.statusIn);
		}

		if (where.side) {
			query = query.where("lts.side", "=", where.side);
		}

		return yield* Effect.succeed(query);
	},
);
