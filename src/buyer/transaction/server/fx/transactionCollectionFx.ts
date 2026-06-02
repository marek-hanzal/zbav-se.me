import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withTransactionSelectFx } from "~/buyer/transaction/server/db/withTransactionSelectFx";
import type { TransactionQuerySchema } from "~/buyer/transaction/server/schema/TransactionQuerySchema";
import type { TransactionWhereSchema } from "../schema/TransactionWhereSchema";

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
	const logger = yield* getLoggerFx("transactionCollectionFx", "transaction");
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
