import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { TransactionStatusSchema } from "~/@user/transaction-status/schema/TransactionStatusSchema";
import { withTransactionStatusQueryBuilderFx } from "~/app/transaction-status/db/withTransactionStatusQueryBuilderFx";
import { withTransactionStatusSelectFx } from "~/app/transaction-status/db/withTransactionStatusSelectFx";
import type { TransactionStatusQuerySchema } from "~/app/transaction-status/schema/TransactionStatusQuerySchema";

export namespace transactionStatusFetchFx {
	export type Props = TransactionStatusQuerySchema.Type;
}

export const transactionStatusFetchFx = Effect.fn("transactionStatusFetchFx")(function* ({
	filter,
	where,
	sort,
}: transactionStatusFetchFx.Props) {
	return yield* withFetchFx({
		resource: "transaction-status",
		select: yield* withTransactionStatusSelectFx({
			sort,
		}),
		output: TransactionStatusSchema,
		filter,
		where,
		queryFx: withTransactionStatusQueryBuilderFx,
	});
});

export type transactionStatusFetchFx = ReturnType<typeof transactionStatusFetchFx>;
