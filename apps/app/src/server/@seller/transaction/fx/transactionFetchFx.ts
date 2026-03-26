import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withTransactionQueryBuilderFx } from "~/server/@seller/transaction/db/withTransactionQueryBuilderFx";
import { withTransactionSelectFx } from "~/server/@seller/transaction/db/withTransactionSelectFx";
import type { TransactionFilterSchema } from "~/server/@seller/transaction/schema/TransactionFilterSchema";
import type { TransactionQuerySchema } from "~/server/@seller/transaction/schema/TransactionQuerySchema";

export namespace transactionFetchFx {
	export interface Props extends TransactionQuerySchema.Type {
		scope: TransactionFilterSchema.Type;
	}
}

export const transactionFetchFx = Effect.fn("transactionFetchFx")(function* ({
	filter,
	where,
	scope,
	sort,
}: transactionFetchFx.Props) {
	return yield* withFetchFx({
		resource: "transaction",
		selectFx: withTransactionSelectFx({
			sort,
		}),
		filter,
		where,
		scope,
		queryFx: withTransactionQueryBuilderFx,
	});
});

export type transactionFetchFx = ReturnType<typeof transactionFetchFx>;
