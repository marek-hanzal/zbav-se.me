import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { TransactionCountQuerySchema } from "~/@common/transaction/schema/TransactionCountQuerySchema";
import type { TransactionFilterSchema } from "~/@common/transaction/schema/TransactionFilterSchema";
import { withTransactionCollectionSelectFx } from "~/@seller-user/transaction/db/withTransactionCollectionSelectFx";
import { withTransactionQueryBuilderFx } from "~/@seller-user/transaction/db/withTransactionQueryBuilderFx";
import { withTraceFx } from "~/effect/withTraceFx";

export namespace transactionCountFx {
	export interface Props extends TransactionCountQuerySchema.Type {
		scope: TransactionFilterSchema.Type;
	}
}

export const transactionCountFx = Effect.fn("transactionCountFx")(function* ({
	filter,
	where,
	scope,
}: transactionCountFx.Props) {
	yield* withTraceFx({
		fx: "transactionCountFx",
		input: {
			filter,
			where,
			scope,
		},
	});

	return yield* withCountFx({
		selectFx: withTransactionCollectionSelectFx({}),
		filter,
		where,
		scope,
		queryFx: withTransactionQueryBuilderFx,
	});
});

export type transactionCountFx = ReturnType<typeof transactionCountFx>;
