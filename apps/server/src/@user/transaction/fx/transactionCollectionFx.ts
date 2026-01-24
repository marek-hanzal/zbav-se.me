import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withTransactionCollectionSelectFx } from "~/@user/transaction/db/withTransactionCollectionSelectFx";
import { withTransactionQueryBuilderFx } from "~/@user/transaction/db/withTransactionQueryBuilderFx";
import type { TransactionFilterSchema } from "~/@user/transaction/schema/TransactionFilterSchema";
import type { TransactionQuerySchema } from "~/@user/transaction/schema/TransactionQuerySchema";

export namespace transactionCollectionFx {
	export interface Props extends TransactionQuerySchema.Type {
		scope: TransactionFilterSchema.Type;
	}
}

export const transactionCollectionFx = Effect.fn("transactionCollectionFx")(function* ({
	filter,
	where,
	scope,
	cursor,
	sort,
	meta,
}: transactionCollectionFx.Props) {
	return yield* withCollectionFx({
		selectFx: withTransactionCollectionSelectFx({
			sort,
		}),
		cursor: cursor ?? {
			page: 0,
			size: 10,
		},
		filter,
		where,
		scope,
		queryFx(query) {
			return withTransactionQueryBuilderFx({
				meta,
				...query,
			});
		},
	});
});

export type transactionCollectionFx = ReturnType<typeof transactionCollectionFx>;
