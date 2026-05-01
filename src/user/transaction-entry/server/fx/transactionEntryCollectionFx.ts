import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withTransactionEntrySelectFx } from "../db/withTransactionEntrySelectFx";
import type { TransactionEntryFilterSchema } from "../schema/TransactionEntryFilterSchema";
import type { TransactionEntryQuerySchema } from "../schema/TransactionEntryQuerySchema";

export namespace transactionEntryCollectionFx {
	export interface Props extends TransactionEntryQuerySchema.Type {
		userId: string;
		scope?: TransactionEntryFilterSchema.Type;
	}
}

export const transactionEntryCollectionFx = Effect.fn("transactionEntryCollectionFx")(function* ({
	userId,
	cursor = {
		page: 0,
		size: 30,
	},
	filter,
	where,
	scope,
	sort,
	limit,
}: transactionEntryCollectionFx.Props) {
	const logger = yield* getLoggerFx("transactionEntryCollectionFx", "transaction-entry");
	logger.trace("transactionEntryCollectionFx", {
		userId,
		cursor,
		filter,
		where,
		scope,
		sort,
		limit,
	});

	return yield* withCollectionFx({
		selectFx: withTransactionEntrySelectFx({
			userId,
			sort,
		}),
		cursor,
		filter,
		where,
		scope,
		limit,
	});
});

export type transactionEntryCollectionFx = ReturnType<typeof transactionEntryCollectionFx>;
