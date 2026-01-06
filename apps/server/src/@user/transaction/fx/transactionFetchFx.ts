import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withTransactionQueryBuilderFx } from "~/app/transaction/db/withTransactionQueryBuilderFx";
import { withTransactionSelectFx } from "~/app/transaction/db/withTransactionSelectFx";
import type { TransactionQuerySchema } from "~/app/transaction/schema/TransactionQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { TransactionSchema } from "../schema/TransactionSchema";

export namespace transactionFetchFx {
	export type Props = TransactionQuerySchema.Type;
}

export const transactionFetchFx = Effect.fn("transactionFetchFx")(function* ({
	filter,
	where,
	sort,
	meta,
}: transactionFetchFx.Props) {
	const user = yield* UserContextFx;

	return yield* withFetchFx({
		resource: "transaction",
		select: yield* withTransactionSelectFx({
			sort,
		}),
		output: TransactionSchema,
		filter,
		where: {
			...where,
			userId: user.id,
		},
		queryFx(query) {
			return withTransactionQueryBuilderFx({
				meta,
				...query,
			});
		},
	});
});

export type transactionFetchFx = ReturnType<typeof transactionFetchFx>;
