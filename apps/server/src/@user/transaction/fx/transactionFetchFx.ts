import { withFetchFx } from "@use-pico/common/fetch";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { withTransactionQueryBuilderFx } from "~/app/transaction/db/withTransactionQueryBuilderFx";
import { withTransactionSelectFx } from "~/app/transaction/db/withTransactionSelectFx";
import type { TransactionFilterSchema } from "~/app/transaction/schema/TransactionFilterSchema";
import type { TransactionQuerySchema } from "~/app/transaction/schema/TransactionQuerySchema";
import type { UserContextFx } from "~/auth/fx/UserContextFx";

export namespace transactionFetchFx {
	export interface Props extends TransactionQuerySchema.Type {
		scope: TransactionFilterSchema.Type;
	}
}

export const transactionFetchFx = Effect.fn("transactionFetchFx")(function* ({
	filter,
	where,
	scope,
	sort,
	meta,
}: transactionFetchFx.Props) {
	return yield* withFetchFx({
		resource: "transaction",
		selectFx: withTransactionSelectFx({
			sort,
		}),
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

export type transactionFetchFx = ReturnType<typeof transactionFetchFx>;

type _NoUser = AssertNever<Extract<Effect.Effect.Context<transactionFetchFx>, UserContextFx>>;
