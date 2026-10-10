import { Effect } from "effect";
import { transactionFetchFx } from "~/buyer-transaction/fx/transactionFetchFx";
import type { TransactionPatchSchema } from "~/buyer-transaction/schema/TransactionPatchSchema";
import type { TransactionWhereSchema } from "~/buyer-transaction/schema/TransactionWhereSchema";
import { dbFx } from "~/database/fx/dbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { TransactionContextFx } from "~/user-transaction/context/TransactionContextFx";

export namespace transactionPatchFx {
	export interface Props extends TransactionPatchSchema.Type {
		userId: string;
		scope: TransactionWhereSchema.Type;
	}
}

export const transactionPatchFx = Effect.fn("transactionPatchFx")(function* ({
	userId,
	patch,
	query,
	scope,
}: transactionPatchFx.Props) {
	const logger = yield* getLoggerFx("transactionPatchFx", "transaction");
	logger.trace("transactionPatchFx", {
		userId,
		patch,
		query,
		scope,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const dateContext = yield* DateServiceFx;
			const config = yield* TransactionContextFx;

			const transaction = yield* transactionFetchFx({
				...query,
				scope,
			});

			const now = dateContext.nowFn();

			yield* dbFx(async (kysely) => {
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
