import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withTransactionStatusQueryBuilderFx } from "~/@session/transaction-status/db/withTransactionStatusQueryBuilderFx";
import { withTransactionStatusSelectFx } from "~/@session/transaction-status/db/withTransactionStatusSelectFx";
import type { TransactionStatusFilterSchema } from "~/@session/transaction-status/schema/TransactionStatusFilterSchema";
import type { TransactionStatusQuerySchema } from "~/@session/transaction-status/schema/TransactionStatusQuerySchema";
import { traceLogFx } from "~/effect/traceLogFx";

export namespace transactionStatusFetchFx {
	export interface Props extends TransactionStatusQuerySchema.Type {
		scope: TransactionStatusFilterSchema.Type;
	}
}

export const transactionStatusFetchFx = Effect.fn("transactionStatusFetchFx")(function* ({
	filter,
	where,
	scope,
	sort,
}: transactionStatusFetchFx.Props) {
	yield* traceLogFx({
		level: "trace",
		message: "transactionStatusFetchFx",
		input: {
			filter,
			where,
			scope,
			sort,
		},
	});

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
