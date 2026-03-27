import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withTransactionEntryQueryBuilderFx } from "../db/withTransactionEntryQueryBuilderFx";
import { withTransactionEntrySelectFx } from "../db/withTransactionEntrySelectFx";
import type { TransactionEntryFilterSchema } from "../schema/TransactionEntryFilterSchema";
import type { TransactionEntryQuerySchema } from "../schema/TransactionEntryQuerySchema";

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
			userId,
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
