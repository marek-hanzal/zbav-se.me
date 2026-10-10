import { Effect } from "effect";
import { withCollectionFx } from "~/database-query/fx/withCollectionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withTransactionSelectFx } from "~/seller-transaction/db/withTransactionSelectFx";
import type { TransactionQuerySchema } from "~/seller-transaction/schema/TransactionQuerySchema";
import type { TransactionWhereSchema } from "~/seller-transaction/schema/TransactionWhereSchema";

export namespace transactionCollectionFx {
	export interface Props extends TransactionQuerySchema.Type {
		scope: TransactionWhereSchema.Type;
	}
}

export const transactionCollectionFx = Effect.fn("transactionCollectionFx")(function* ({
	where,
	scope,
	cursor = {
		page: 0,
		size: 10,
	},
	limit,
	sort,
}: transactionCollectionFx.Props) {
	const logger = yield* getLoggerFx("transactionCollectionFx");
	logger.trace("transactionCollectionFx", {
		where,
		scope,
		cursor,
		limit,
		sort,
	});

	return yield* withCollectionFx({
		selectFx: withTransactionSelectFx({
			sort,
		}),
		cursor,
		limit,
		where,
		scope,
	});
});

export type transactionCollectionFx = ReturnType<typeof transactionCollectionFx>;
