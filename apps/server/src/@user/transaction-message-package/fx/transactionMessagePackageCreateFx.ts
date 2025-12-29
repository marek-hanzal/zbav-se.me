import { Effect } from "effect";
import { DateTime } from "luxon";
import { messagePackageCreateFx } from "~/@user/message-package/fx/messagePackageCreateFx";
import { TransactionContextFx } from "~/@user/transaction/fx/TransactionContextFx";
import { transactionStatusGateFx } from "~/@user/transaction/fx/transactionStatusGateFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import type { TransactionMessagePackageCreateSchema } from "../schema/TransactionMessagePackageCreateSchema";

export namespace transactionMessagePackageCreateFx {
	export interface Props extends TransactionMessagePackageCreateSchema.Type {}
}

export const transactionMessagePackageCreateFx = ({
	transactionId,
	link,
	number,
}: transactionMessagePackageCreateFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const config = yield* TransactionContextFx;

		const transaction = yield* transactionStatusGateFx({
			transactionId,
			allowedStatuses: [
				"open",
				"dispute",
			],
		});

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
				.where("id", "=", transaction.id)
				.executeTakeFirst();
		});

		return yield* messagePackageCreateFx({
			messageThreadId: transaction.messageThreadId,
			link,
			number,
		});
	});
};

export type transactionMessagePackageCreateFx = ReturnType<
	typeof transactionMessagePackageCreateFx
>;
