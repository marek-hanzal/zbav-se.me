import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";
import { withTransactionLogQueryBuilder } from "../db/withTransactionLogQueryBuilder";
import { withTransactionLogSelect } from "../db/withTransactionLogSelect";
import type { TransactionLogQuerySchema } from "../schema/TransactionLogQuerySchema";
import { TransactionLogSchema } from "../schema/TransactionLogSchema";

export namespace transactionLogFetchFx {
	export interface Props {
		query: Omit<TransactionLogQuerySchema.Type, "cursor">;
	}
}

export const transactionLogFetchFx = ({ query }: transactionLogFetchFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const data = yield* Effect.tryPromise(async () => {
			const { filter, where, sort } = query;

			return withFetch({
				select: withTransactionLogSelect({
					database,
					sort,
				}),
				output: TransactionLogSchema,
				filter,
				where,
				query: withTransactionLogQueryBuilder,
			});
		});

		if (!data) {
			return yield* new NotFoundError({
				resource: "transaction-log",
				resourceId: "(query)",
				message: "Listing transaction log not found",
			});
		}

		return data;
	});
};

export type transactionLogFetchFx = ReturnType<typeof transactionLogFetchFx>;
