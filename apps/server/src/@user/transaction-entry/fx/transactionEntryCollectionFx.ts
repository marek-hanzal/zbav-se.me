import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withTransactionEntryQueryBuilderFx } from "~/@user/transaction-entry/db/withTransactionEntryQueryBuilderFx";
import { withTransactionEntrySelectFx } from "~/@user/transaction-entry/db/withTransactionEntrySelectFx";
import type { TransactionEntryFilterSchema } from "~/@user/transaction-entry/schema/TransactionEntryFilterSchema";
import type { TransactionEntryQuerySchema } from "~/@user/transaction-entry/schema/TransactionEntryQuerySchema";

export namespace transactionEntryCollectionFx {
	export interface Props extends TransactionEntryQuerySchema.Type {
		userId: string;
		scope?: TransactionEntryFilterSchema.Type;
	}
}

export const transactionEntryCollectionFx = Effect.fn("transactionEntryCollectionFx")(function* ({
	userId,
	cursor,
	filter,
	where,
	scope,
	sort,
}: transactionEntryCollectionFx.Props) {
	return yield* withCollectionFx({
		selectFx: withTransactionEntrySelectFx({
			sort,
		}),
		cursor: cursor ?? {
			page: 0,
			size: 30,
		},
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
