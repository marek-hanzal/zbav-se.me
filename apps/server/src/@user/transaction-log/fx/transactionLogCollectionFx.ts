import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withTransactionLogQueryBuilder } from "~/app/transaction-log/db/withTransactionLogQueryBuilder";
import { withTransactionLogSelect } from "~/app/transaction-log/db/withTransactionLogSelect";
import type { TransactionLogQuerySchema } from "~/@user/transaction-log/schema/TransactionLogQuerySchema";
import { TransactionLogSchema } from "~/@user/transaction-log/schema/TransactionLogSchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace transactionLogCollectionFx {
	export interface Props {
		query: TransactionLogQuerySchema.Type;
	}
}

export const transactionLogCollectionFx = ({
	query: { cursor, filter, where, sort },
}: transactionLogCollectionFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		return yield* Effect.tryPromise(async () => {
			return withCollection({
				select: withTransactionLogSelect({
					database,
					sort,
				}),
				output: TransactionLogSchema,
				cursor: cursor ?? {
					page: 0,
					size: 10,
				},
				filter,
				where: {
					...where,
					userId: user.id,
				},
				query: withTransactionLogQueryBuilder,
			});
		});
	});
};

export type transactionLogCollectionFx = ReturnType<
	typeof transactionLogCollectionFx
>;
