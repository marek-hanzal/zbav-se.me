import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import { transactionFetchFx } from "~/client/@buyer/transaction/server/fx/transactionFetchFx";
import type { TransactionFilterSchema } from "~/client/@buyer/transaction/server/schema/TransactionFilterSchema";
import type { TransactionPatchSchema } from "~/client/@buyer/transaction/server/schema/TransactionPatchSchema";
import { TransactionContextFx } from "~/client/@user/transaction/server/context/TransactionContextFx";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

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
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;
			const config = yield* TransactionContextFx;

			const transaction = yield* transactionFetchFx({
				...query,
				scope,
			});

			const now = dateContext.now();

			yield* tryDbFx(async () =>
				kysely
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
					.executeTakeFirst(),
			);

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
