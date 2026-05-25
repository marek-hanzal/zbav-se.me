import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { getLoggerFx } from "@/lib/common/log";
import { transactionFetchFx } from "~/seller/transaction/server/fx/transactionFetchFx";
import type { TransactionFilterSchema } from "~/seller/transaction/server/schema/TransactionFilterSchema";
import type { TransactionPatchSchema } from "~/seller/transaction/server/schema/TransactionPatchSchema";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { TransactionContextFx } from "~/user/transaction/server/context/TransactionContextFx";

export namespace transactionPatchFx {
	export interface Props extends TransactionPatchSchema.Type {
		userId: string;
		scope: TransactionFilterSchema.Type;
	}
}

export const transactionPatchFx = Effect.fn("transactionPatchFx")(function* ({
	userId,
	patch,
	query,
	scope,
}: transactionPatchFx.Props) {
	const logger = yield* getLoggerFx("transactionPatchFx");
	logger.trace("transactionPatchFx", {
		userId,
		patch,
		query,
		scope,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const dateContext = yield* DateContextFx;
			const config = yield* TransactionContextFx;

			const transaction = yield* transactionFetchFx({
				...query,
				scope,
			});

			const now = dateContext.now();

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
