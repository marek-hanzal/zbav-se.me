import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionLogQueryBuilder } from "../db/withTransactionLogQueryBuilder";
import { withTransactionLogSelect } from "../db/withTransactionLogSelect";
import type { TransactionLogQuerySchema } from "~/app/transaction-log/schema/TransactionLogQuerySchema";
import { TransactionLogSchema } from "../schema/TransactionLogSchema";

export namespace transactionLogCollectionFx {
	export interface Props {
		query: TransactionLogQuerySchema.Type;
	}
}

export const transactionLogCollectionFx = ({
	query: { filter, where, cursor, sort },
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
				query(query) {
					return withTransactionLogQueryBuilder({
						...query,
					});
				},
			});
		});
	});
};

export type transactionLogCollectionFx = ReturnType<typeof transactionLogCollectionFx>;
