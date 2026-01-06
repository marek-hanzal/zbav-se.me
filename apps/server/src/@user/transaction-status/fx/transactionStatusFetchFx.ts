import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { TransactionStatusSchema } from "~/@user/transaction-status/schema/TransactionStatusSchema";
import { withTransactionStatusQueryBuilder } from "~/app/transaction-status/db/withTransactionStatusQueryBuilder";
import { withTransactionStatusSelect } from "~/app/transaction-status/db/withTransactionStatusSelect";
import type { TransactionStatusQuerySchema } from "~/app/transaction-status/schema/TransactionStatusQuerySchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace transactionStatusFetchFx {
	export type Props = TransactionStatusQuerySchema.Type;
}

export const transactionStatusFetchFx = Effect.fn("transactionStatusFetchFx")(function* ({
	filter,
	where,
	sort,
}: transactionStatusFetchFx.Props) {
	const database = yield* DatabaseContextFx;

	return yield* withFetchFx({
		resource: "transaction-status",
		select: withTransactionStatusSelect({
			database,
			sort,
		}),
		output: TransactionStatusSchema,
		filter,
		where,
		query: withTransactionStatusQueryBuilder,
	});
});

export type transactionStatusFetchFx = ReturnType<typeof transactionStatusFetchFx>;
