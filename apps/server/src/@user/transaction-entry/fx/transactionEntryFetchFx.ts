import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withTransactionEntryQueryBuilderFx } from "~/@user/transaction-entry/db/withTransactionEntryQueryBuilderFx";
import { withTransactionEntrySelectFx } from "~/@user/transaction-entry/db/withTransactionEntrySelectFx";
import type { TransactionEntryFilterSchema } from "~/@user/transaction-entry/schema/TransactionEntryFilterSchema";
import type { TransactionEntryQuerySchema } from "~/@user/transaction-entry/schema/TransactionEntryQuerySchema";

export namespace transactionEntryFetchFx {
	export interface Props extends TransactionEntryQuerySchema.Type {
		userId: string;
		scope?: TransactionEntryFilterSchema.Type;
	}
}

export const transactionEntryFetchFx = Effect.fn("transactionEntryFetchFx")(function* ({
	userId,
	filter,
	where,
	scope,
	sort,
}: transactionEntryFetchFx.Props) {
	return yield* withFetchFx({
		resource: "transaction-entry",
		selectFx: withTransactionEntrySelectFx({
			userId,
			sort,
		}),
		filter,
		where,
		scope,
		queryFx(query) {
			return withTransactionEntryQueryBuilderFx({
				...query,
				userId,
			});
		},
	});
});
