import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withTransactionEntryQueryBuilderFx } from "../db/withTransactionEntryQueryBuilderFx";
import { withTransactionEntrySelectFx } from "../db/withTransactionEntrySelectFx";
import type { TransactionEntryCountQuerySchema } from "../schema/TransactionEntryCountQuerySchema";
import type { TransactionEntryFilterSchema } from "../schema/TransactionEntryFilterSchema";

export namespace transactionEntryCountFx {
	export interface Props extends TransactionEntryCountQuerySchema.Type {
		userId: string;
		scope?: TransactionEntryFilterSchema.Type;
	}
}

export const transactionEntryCountFx = Effect.fn("transactionEntryCountFx")(function* ({
	userId,
	filter,
	where,
	scope,
}: transactionEntryCountFx.Props) {
	return yield* withCountFx({
		selectFx: withTransactionEntrySelectFx({
			userId,
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
