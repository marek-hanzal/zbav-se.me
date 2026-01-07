import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { DateTime } from "luxon";
import type { TransactionPatchSchema } from "~/@user/transaction/schema/TransactionPatchSchema";
import { TransactionContextFx } from "~/app/transaction/context/TransactionContextFx";
import { transactionFetchFx } from "~/app/transaction/fx/transactionFetchFx";
import type { TransactionFilterSchema } from "~/app/transaction/schema/TransactionFilterSchema";
import type { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
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
			const database = yield* DatabaseContextFx;
			const config = yield* TransactionContextFx;

			const transaction = yield* transactionFetchFx({
				...query,
				scope,
			});

			const now = updatedAt ?? DateTime.now();

			yield* Effect.promise(async () => {
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

type _NoUser = AssertNever<Extract<Effect.Effect.Context<transactionPatchFx>, UserContextFx>>;
