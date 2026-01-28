import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withTransactionCollectionSelectFx } from "~/@buyer-user/transaction/db/withTransactionCollectionSelectFx";
import { withTransactionQueryBuilderFx } from "~/@buyer-user/transaction/db/withTransactionQueryBuilderFx";
import type { TransactionFilterSchema } from "~/@buyer-user/transaction/schema/TransactionFilterSchema";
import type { TransactionQuerySchema } from "~/@buyer-user/transaction/schema/TransactionQuerySchema";

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
		queryFx: withTransactionQueryBuilderFx,
	});
});

export type transactionCollectionFx = ReturnType<typeof transactionCollectionFx>;
