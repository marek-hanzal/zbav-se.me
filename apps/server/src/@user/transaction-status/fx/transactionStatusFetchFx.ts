import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withTransactionStatusQueryBuilderFx } from "~/app/transaction-status/db/withTransactionStatusQueryBuilderFx";
import { withTransactionStatusSelectFx } from "~/app/transaction-status/db/withTransactionStatusSelectFx";
import type { TransactionStatusFilterSchema } from "~/app/transaction-status/schema/TransactionStatusFilterSchema";
import type { TransactionStatusQuerySchema } from "~/app/transaction-status/schema/TransactionStatusQuerySchema";

export namespace transactionStatusFetchFx {
	export interface Props extends TransactionStatusQuerySchema.Type {
		scope?: TransactionStatusFilterSchema.Type;
	}
}

export const transactionStatusFetchFx = Effect.fn("transactionStatusFetchFx")(function* ({
	filter,
	where,
	scope,
	sort,
}: transactionStatusFetchFx.Props) {
	return yield* withFetchFx({
		resource: "transaction-status",
		selectFx: withTransactionStatusSelectFx({
			sort,
		}),
		filter,
		where,
		scope,
		queryFx: withTransactionStatusQueryBuilderFx,
	});
});

export type transactionStatusFetchFx = ReturnType<typeof transactionStatusFetchFx>;
