import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import type { TransactionFilterSchema } from "~/@common/transaction/schema/TransactionFilterSchema";
import type { TransactionQuerySchema } from "~/@common/transaction/schema/TransactionQuerySchema";
import { withTransactionQueryBuilderFx } from "~/@seller-user/transaction/db/withTransactionQueryBuilderFx";
import { withTransactionSelectFx } from "~/@seller-user/transaction/db/withTransactionSelectFx";

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
	yield* Effect.annotateLogsScoped({
		"transactionFetchFx.filter": filter,
		"transactionFetchFx.where": where,
		"transactionFetchFx.scope": scope,
		"transactionFetchFx.sort": sort,
	});

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
