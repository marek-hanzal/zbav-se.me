import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withTransactionQueryBuilderFx } from "~/client/@buyer/transaction/server/db/withTransactionQueryBuilderFx";
import { withTransactionSelectFx } from "~/client/@buyer/transaction/server/db/withTransactionSelectFx";
import type { TransactionFilterSchema } from "~/client/@buyer/transaction/server/schema/TransactionFilterSchema";
import type { TransactionQuerySchema } from "~/client/@buyer/transaction/server/schema/TransactionQuerySchema";

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
