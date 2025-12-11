import { withCollection } from "@use-pico/common/collection";
import { Effect } from "effect";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionQueryBuilder } from "../db/withTransactionQueryBuilder";
import { withTransactionSelect } from "../db/withTransactionSelect";
import type { TransactionQuerySchema } from "../schema/TransactionQuerySchema";
import { TransactionSchema } from "../schema/TransactionSchema";

export namespace transactionCollectionFx {
	export interface Props {
		query: TransactionQuerySchema.Type;
	}
}

export const transactionCollectionFx = ({
	query: { filter, where, cursor, sort, meta },
}: transactionCollectionFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		return yield* Effect.tryPromise(async () => {
			return withCollection({
				select: withTransactionSelect({
					database,
					sort,
				}),
				output: TransactionSchema,
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
	});
};

export type transactionCollectionFx = ReturnType<typeof transactionCollectionFx>;
