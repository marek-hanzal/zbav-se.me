import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";
import { withTransactionQueryBuilder } from "../db/withTransactionQueryBuilder";
import { withTransactionSelect } from "../db/withTransactionSelect";
import type { TransactionQuerySchema } from "../schema/TransactionQuerySchema";
import { TransactionSchema } from "../schema/TransactionSchema";

export namespace transactionFetchFx {
	export interface Props {
		query: Omit<TransactionQuerySchema.Type, "cursor">;
	}
}

export const transactionFetchFx = ({ query }: transactionFetchFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const data = yield* Effect.tryPromise(async () => {
			const { filter, where, sort, meta } = query;

			return withFetch({
				select: withTransactionSelect({
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

		if (!data) {
			return yield* new NotFoundError({
				resource: "transaction",
				resourceId: "(query)",
				message: "Transaction not found",
			});
		}

		return data;
	});
};

export type transactionFetchFx = ReturnType<typeof transactionFetchFx>;
