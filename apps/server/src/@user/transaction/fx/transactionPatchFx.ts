import { Effect } from "effect";
import { DateTime } from "luxon";
import { transactionFetchFx } from "~/@user/transaction/fx/transactionFetchFx";
import type { TransactionPatchSchema } from "~/@user/transaction/schema/TransactionPatchSchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { TransactionContextFx } from "./TransactionContextFx";

export namespace transactionPatchFx {
	export type Props = TransactionPatchSchema.Type;
}

export const transactionPatchFx = ({ patch, query }: transactionPatchFx.Props) => {
	return withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;
			const config = yield* TransactionContextFx;

			const transaction = yield* transactionFetchFx({
				query,
			});

			const now = DateTime.now();

			yield* Effect.tryPromise(async () => {
				return database
					.updateTable("transaction")
					.set({
						...patch,
						updatedAt: now.toJSDate(),
						expiresAt: now
							.plus({
								days: config.extend,
							})
							.toJSDate(),
					})
					.where("id", "=", transaction.id)
					.executeTakeFirst();
			});

			return yield* transactionFetchFx({
				query: {
					where: {
						id: transaction.id,
					},
				},
			});
		}),
	);
};

export type transactionPatchFx = ReturnType<typeof transactionPatchFx>;
