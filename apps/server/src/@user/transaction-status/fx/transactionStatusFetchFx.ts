import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withTransactionStatusQueryBuilder } from "~/app/transaction-status/db/withTransactionStatusQueryBuilder";
import { withTransactionStatusSelect } from "~/app/transaction-status/db/withTransactionStatusSelect";
import type { TransactionStatusQuerySchema } from "~/app/transaction-status/schema/TransactionStatusQuerySchema";
import { TransactionStatusSchema } from "~/app/transaction-status/schema/TransactionStatusSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";

export namespace transactionStatusFetchFx {
	export interface Props {
		query: Omit<TransactionStatusQuerySchema.Type, "cursor">;
	}
}

export const transactionStatusFetchFx = ({
	query,
}: transactionStatusFetchFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const data = yield* Effect.tryPromise(async () => {
			const { filter, where, sort } = query;

			return withFetch({
				select: withTransactionStatusSelect({
					database,
					sort,
				}),
				output: TransactionStatusSchema,
				filter,
				where,
				query: withTransactionStatusQueryBuilder,
			});
		});

		if (!data) {
			return yield* new NotFoundError({
				resource: "transaction-status",
				resourceId: "(query)",
				message: "Listing transaction status not found",
			});
		}

		return data;
	});
};

export type transactionStatusFetchFx = ReturnType<typeof transactionStatusFetchFx>;
