import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import type { TransactionFilterSchema } from "~/@common/transaction/schema/TransactionFilterSchema";
import type { TransactionQuerySchema } from "~/@common/transaction/schema/TransactionQuerySchema";
import { withTransactionCollectionSelectFx } from "~/@seller-user/transaction/db/withTransactionCollectionSelectFx";
import { withTransactionQueryBuilderFx } from "~/@seller-user/transaction/db/withTransactionQueryBuilderFx";
import { withTraceFx } from "~/effect/withTraceFx";

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
	yield* withTraceFx({
		fx: "transactionCollectionFx",
		input: {
			filter,
			where,
			scope,
			cursor,
			sort,
		},
	});

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
