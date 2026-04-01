import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withTransactionCollectionSelectFx } from "~/buyer/transaction/server/db/withTransactionCollectionSelectFx";
import { withTransactionQueryBuilderFx } from "~/buyer/transaction/server/db/withTransactionQueryBuilderFx";
import type { TransactionFilterSchema } from "~/buyer/transaction/server/schema/TransactionFilterSchema";
import type { TransactionQuerySchema } from "~/buyer/transaction/server/schema/TransactionQuerySchema";

export namespace transactionCollectionFx {
	export interface Props extends TransactionQuerySchema.Type {
		scope: TransactionFilterSchema.Type;
	}
}

export const transactionCollectionFx = Effect.fn("transactionCollectionFx")(function* ({
	filter,
	where,
	scope,
	cursor,
	sort,
}: transactionCollectionFx.Props) {
	const logger = yield* getLoggerFx("transactionCollectionFx");
	logger.debug("transactionCollectionFx", {
		filter,
		where,
		scope,
		cursor,
		sort,
	});

	return yield* withCollectionFx({
		selectFx: withTransactionCollectionSelectFx({
			sort,
		}),
		cursor: cursor ?? {
			page: 0,
			size: 10,
		},
		filter,
		where,
		scope,
		queryFx: withTransactionQueryBuilderFx,
	});
});

export type transactionCollectionFx = ReturnType<typeof transactionCollectionFx>;
