import { withCollectionFx } from "@use-pico/common/collection";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { withTransactionCollectionSelectFx } from "~/app/transaction/db/withTransactionCollectionSelectFx";
import { withTransactionQueryBuilderFx } from "~/app/transaction/db/withTransactionQueryBuilderFx";
import type { TransactionFilterSchema } from "~/app/transaction/schema/TransactionFilterSchema";
import type { TransactionQuerySchema } from "~/app/transaction/schema/TransactionQuerySchema";

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
