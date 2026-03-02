import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withTransactionQueryBuilderFx } from "~/@buyer/transaction/db/withTransactionQueryBuilderFx";
import { withTransactionSelectFx } from "~/@buyer/transaction/db/withTransactionSelectFx";
import type { TransactionFilterSchema } from "~/@common/transaction/schema/TransactionFilterSchema";
import type { TransactionQuerySchema } from "~/@common/transaction/schema/TransactionQuerySchema";
import { withTraceFx } from "~/effect/withTraceFx";

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
	yield* withTraceFx({
		fx: "transactionFetchFx",
		input: {
			filter,
			where,
			scope,
			sort,
		},
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
