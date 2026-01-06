import { Effect } from "effect";
import { DateTime } from "luxon";
import { messagePackageCreateFx } from "~/@user/message-package/fx/messagePackageCreateFx";
import { TransactionContextFx } from "~/@user/transaction/fx/TransactionContextFx";
import { transactionStatusGateFx } from "~/@user/transaction/fx/transactionStatusGateFx";
import { userInteractionEventFx } from "~/@user/user-event/fx/userInteractionEventFx";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import type { TransactionMessagePackageCreateSchema } from "../schema/TransactionMessagePackageCreateSchema";

export namespace transactionMessagePackageCreateFx {
	export interface Props extends TransactionMessagePackageCreateSchema.Type {}
}

export const transactionMessagePackageCreateFx = Effect.fn("transactionMessagePackageCreateFx")(
	function* ({ transactionId, link, number }: transactionMessagePackageCreateFx.Props) {
		return yield* withTransactionFx(
			Effect.gen(function* () {
				const database = yield* DatabaseContextFx;
				const user = yield* UserContextFx;
				const config = yield* TransactionContextFx;

				const transaction = yield* transactionStatusGateFx({
					transactionId,
					allowedStatuses: [
						"open",
						"dispute",
					],
				});

				const now = DateTime.now();

				yield* Effect.promise(async () => {
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

				yield* userInteractionEventFx({
					userId: user.id,
					targetId:
						transaction.side === "buyer" ? transaction.sellerId : transaction.buyerId,
					source: "transaction",
					group: transaction.id,
					event: "transaction.message",
					isTerminal: false,
				});

				return yield* messagePackageCreateFx({
					messageThreadId: transaction.messageThreadId,
					link,
					number,
				});
			}),
		);
	},
);

export type transactionMessagePackageCreateFx = ReturnType<
	typeof transactionMessagePackageCreateFx
>;
