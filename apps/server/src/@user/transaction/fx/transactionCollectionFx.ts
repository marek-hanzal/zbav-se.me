import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withTransactionCollectionSelectFx } from "~/app/transaction/db/withTransactionCollectionSelectFx";
import { withTransactionQueryBuilderFx } from "~/app/transaction/db/withTransactionQueryBuilderFx";
import type { TransactionQuerySchema } from "~/app/transaction/schema/TransactionQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";

export namespace transactionCollectionFx {
	export type Props = TransactionQuerySchema.Type;
}

export const transactionCollectionFx = Effect.fn("transactionCollectionFx")(function* ({
	filter,
	where,
	cursor,
	sort,
	meta,
}: transactionCollectionFx.Props) {
	const user = yield* UserContextFx;

	return yield* withCollectionFx({
		selectFx: withTransactionCollectionSelectFx({
			sort,
		}),
		cursor: cursor ?? {
			page: 0,
			size: 10,
		},
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

export type transactionCollectionFx = ReturnType<typeof transactionCollectionFx>;
