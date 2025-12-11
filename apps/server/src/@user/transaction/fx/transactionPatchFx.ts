import { Effect } from "effect";
import { DateTime } from "luxon";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { AccessDeniedError } from "~/error/AccessDeniedError";
import { NotFoundError } from "~/error/NotFoundError";
import { TransactionContextFx } from "./TransactionContextFx";
import { transactionFetchFx } from "./transactionFetchFx";

export namespace transactionPatchFx {
	export interface Props {
		transactionId: string;
	}
}

export const transactionPatchFx = ({ transactionId }: transactionPatchFx.Props) => {
	return withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;
			const user = yield* UserContextFx;
			const config = yield* TransactionContextFx;

			const transaction = yield* Effect.tryPromise(async () => {
				return database
					.selectFrom("transaction as lt")
					.innerJoin("listing as l", "l.id", "lt.listingId")
					.select([
						"lt.userId",
						"l.userId as listingUserId",
					])
					.where("lt.id", "=", transactionId)
					.executeTakeFirst();
			});

			if (!transaction) {
				return yield* new NotFoundError({
					resource: "transaction",
					resourceId: transactionId,
					message: "Transaction not found",
				});
			}

			if (transaction.userId !== user.id && transaction.listingUserId !== user.id) {
				return yield* new AccessDeniedError({
					message: "You are not allowed to modify this transaction",
				});
			}

			const now = DateTime.now();

			yield* Effect.tryPromise(async () => {
				return database
					.updateTable("transaction")
					.set({
						updatedAt: now.toJSDate(),
						expiresAt: now
							.plus({
								days: config.extend,
							})
							.toJSDate(),
					})
					.where("id", "=", transactionId)
					.returningAll()
					.executeTakeFirstOrThrow();
			});

			return yield* transactionFetchFx({
				query: {
					where: {
						id: transactionId,
					},
				},
			});
		}),
	);
};

export type transactionPatchFx = ReturnType<typeof transactionPatchFx>;
