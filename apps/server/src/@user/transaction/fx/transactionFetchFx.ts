import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withTransactionQueryBuilder } from "~/app/transaction/db/withTransactionQueryBuilder";
import { withTransactionSelectFx } from "~/app/transaction/db/withTransactionSelectFx";
import type { TransactionQuerySchema } from "~/app/transaction/schema/TransactionQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
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
	const database = yield* DatabaseContextFx;
	const user = yield* UserContextFx;

	return yield* withFetchFx({
		resource: "transaction",
		select: yield* withTransactionSelectFx({
			database,
			sort,
		}),
		output: TransactionSchema,
		filter,
		where: {
			...where,
			userId: user.id,
		},
		query(query) {
			return withTransactionQueryBuilder({
				meta,
				...query,
			});
		},
	});
});

export type transactionFetchFx = ReturnType<typeof transactionFetchFx>;
