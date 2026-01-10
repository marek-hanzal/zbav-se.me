import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import { messagePackageCreateFx } from "~/app/message-package/fx/messagePackageCreateFx";
import { TransactionContextFx } from "~/app/transaction/context/TransactionContextFx";
import { transactionStatusGateFx } from "~/app/transaction/fx/transactionStatusGateFx";
import type { TransactionMessagePackageCreateSchema } from "~/app/transaction-message-package/schema/TransactionMessagePackageCreateSchema";
import { userInteractionEventFx } from "~/app/user-event/fx/userInteractionEventFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace transactionMessagePackageCreateFx {
	export interface Props extends TransactionMessagePackageCreateSchema.Type {
		userId: string;
	}
}

export const transactionMessagePackageCreateFx = Effect.fn("transactionMessagePackageCreateFx")(
	function* ({ userId, transactionId, link, number }: transactionMessagePackageCreateFx.Props) {
		return yield* withTransactionFx(
			Effect.gen(function* () {
				const { kysely } = yield* KyselyContextFx;
				const config = yield* TransactionContextFx;
				const dateContext = yield* DateContextFx;

				const transaction = yield* transactionStatusGateFx({
					userId,
					transactionId,
					allowedStatuses: [
						"open",
						"dispute",
					],
				});

				const now = dateContext.now();

				yield* Effect.promise(async () => {
					return kysely
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
					userId,
					targetId:
						transaction.side === "buyer" ? transaction.sellerId : transaction.buyerId,
					source: "transaction",
					group: transaction.id,
					event: "transaction.message",
					isTerminal: false,
				});

				return yield* messagePackageCreateFx({
					userId,
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
