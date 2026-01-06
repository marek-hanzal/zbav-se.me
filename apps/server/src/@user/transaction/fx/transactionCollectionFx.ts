import { withCollectionFx } from "@use-pico/common/collection";
import { EntitySchema } from "@use-pico/common/schema";
import { Effect } from "effect";
import { withTransactionCollectionSelectFx } from "~/app/transaction/db/withTransactionCollectionSelectFx";
import { withTransactionQueryBuilder } from "~/app/transaction/db/withTransactionQueryBuilder";
import type { TransactionQuerySchema } from "~/app/transaction/schema/TransactionQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

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
	const database = yield* DatabaseContextFx;
	const user = yield* UserContextFx;

	return yield* withCollectionFx({
		select: yield* withTransactionCollectionSelectFx({
			database,
			sort,
		}),
		output: EntitySchema,
		cursor: cursor ?? {
			page: 0,
			size: 10,
		},
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

export type transactionCollectionFx = ReturnType<typeof transactionCollectionFx>;
