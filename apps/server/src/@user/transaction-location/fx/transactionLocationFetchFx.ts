import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withTransactionLocationQueryBuilder } from "~/@user/transaction-location/db/withTransactionLocationQueryBuilder";
import { withTransactionLocationSelect } from "~/@user/transaction-location/db/withTransactionLocationSelect";
import type { TransactionLocationQuerySchema } from "~/@user/transaction-location/schema/TransactionLocationQuerySchema";
import { TransactionLocationSchema } from "~/@user/transaction-location/schema/TransactionLocationSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";

export namespace transactionLocationFetchFx {
	export interface Props {
		query: Omit<TransactionLocationQuerySchema.Type, "cursor">;
	}
}

export const transactionLocationFetchFx = ({
	query,
}: transactionLocationFetchFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const data = yield* Effect.tryPromise(async () => {
			const { filter, where, sort } = query;

			return withFetch({
				select: withTransactionLocationSelect({
					database,
					sort,
				}),
				output: TransactionLocationSchema,
				filter,
				where,
				query: withTransactionLocationQueryBuilder,
			});
		});

		if (!data) {
			return yield* new NotFoundError({
				resource: "transaction-location",
				resourceId: "(query)",
				message: "Listing transaction location not found",
			});
		}

		return data;
	});
};

export type transactionLocationFetchFx = ReturnType<
	typeof transactionLocationFetchFx
>;
