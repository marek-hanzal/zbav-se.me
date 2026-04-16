import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withTransactionCollectionSelectFx } from "~/seller/transaction/server/db/withTransactionCollectionSelectFx";
import { withTransactionQueryBuilderFx } from "~/seller/transaction/server/db/withTransactionQueryBuilderFx";
import type { TransactionFilterSchema } from "~/seller/transaction/server/schema/TransactionFilterSchema";
import type { TransactionQuerySchema } from "~/seller/transaction/server/schema/TransactionQuerySchema";

export namespace transactionCollectionFx {
	export interface Props extends TransactionQuerySchema.Type {
		scope: TransactionFilterSchema.Type;
	}
}

export const transactionCollectionFx = Effect.fn("transactionCollectionFx")(function* ({
	filter,
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
		filter,
		where,
		scope,
		cursor,
		limit,
		sort,
	});

	return yield* withCollectionFx({
		selectFx: withTransactionCollectionSelectFx({
			sort,
		}),
		cursor,
		limit,
		filter,
		where,
		scope,
		queryFx: withTransactionQueryBuilderFx,
	});
});

export type transactionCollectionFx = ReturnType<typeof transactionCollectionFx>;
