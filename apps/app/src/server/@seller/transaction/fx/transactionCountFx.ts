import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withTransactionCollectionSelectFx } from "~/server/@seller/transaction/db/withTransactionCollectionSelectFx";
import { withTransactionQueryBuilderFx } from "~/server/@seller/transaction/db/withTransactionQueryBuilderFx";
import type { TransactionCountQuerySchema } from "~/server/@seller/transaction/schema/TransactionCountQuerySchema";
import type { TransactionFilterSchema } from "~/server/@seller/transaction/schema/TransactionFilterSchema";

export namespace transactionCountFx {
	export interface Props extends TransactionCountQuerySchema.Type {
		scope: TransactionFilterSchema.Type;
	}
}

export const transactionCountFx = Effect.fn("transactionCountFx")(function* ({
	filter,
	where,
	scope,
}: transactionCountFx.Props) {
	return yield* withCountFx({
		selectFx: withTransactionCollectionSelectFx({}),
		filter,
		where,
		scope,
		queryFx: withTransactionQueryBuilderFx,
	});
});

export type transactionCountFx = ReturnType<typeof transactionCountFx>;
