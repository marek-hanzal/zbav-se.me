import { Effect } from "effect";
import { DateTime } from "luxon";
import { TransactionContextFx } from "~/app/transaction/context/TransactionContextFx";
import { transactionFetchFx } from "~/app/transaction/fx/transactionFetchFx";
import type { TransactionFilterSchema } from "~/app/transaction/schema/TransactionFilterSchema";
import type { TransactionPatchSchema } from "~/app/transaction/schema/TransactionPatchSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace transactionPatchFx {
	export interface Props extends TransactionPatchSchema.Type {
		userId: string;
		updatedAt?: DateTime;
		scope: TransactionFilterSchema.Type;
	}
}

export const transactionPatchFx = Effect.fn("transactionPatchFx")(function* ({
	userId,
	patch,
	query,
	scope,
	updatedAt,
}: transactionPatchFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const kysely = yield* KyselyContextFx;
			const config = yield* TransactionContextFx;

			const transaction = yield* transactionFetchFx({
				...query,
				scope,
			});

			const now = updatedAt ?? DateTime.now();

			yield* Effect.promise(async () => {
				return kysely
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
				where: {
					id: transaction.id,
				},
				scope: {
					userId,
				},
			});
		}),
	);
});

export type transactionPatchFx = ReturnType<typeof transactionPatchFx>;
