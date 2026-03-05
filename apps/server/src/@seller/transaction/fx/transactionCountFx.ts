import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import type { TransactionCountQuerySchema } from "~/@common/transaction/schema/TransactionCountQuerySchema";
import type { TransactionFilterSchema } from "~/@common/transaction/schema/TransactionFilterSchema";
import { withTransactionCollectionSelectFx } from "~/@seller/transaction/db/withTransactionCollectionSelectFx";
import { withTransactionQueryBuilderFx } from "~/@seller/transaction/db/withTransactionQueryBuilderFx";
import { traceLogFx } from "~/effect/traceLogFx";

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
	yield* traceLogFx({
		level: "trace",
		message: "transactionCountFx",
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
