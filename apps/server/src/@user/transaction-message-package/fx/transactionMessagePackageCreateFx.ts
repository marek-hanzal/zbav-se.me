import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import { TransactionContextFx } from "~/@common/transaction/context/TransactionContextFx";
import { messagePackageCreateFx } from "~/@user/message-package/fx/messagePackageCreateFx";
import type { TransactionMessagePackageCreateSchema } from "~/@user/transaction-message-package/schema/TransactionMessagePackageCreateSchema";
import { transactionStatusGateFx } from "~/@user/transaction-status/fx/transactionStatusGateFx";
import { userInteractionEventFx } from "~/@user/user-event/fx/userInteractionEventFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { withTraceFx } from "~/effect/withTraceFx";

export namespace transactionMessagePackageCreateFx {
	export interface Props extends TransactionMessagePackageCreateSchema.Type {
		userId: string;
	}
}

export const transactionMessagePackageCreateFx = Effect.fn("transactionMessagePackageCreateFx")(
	function* ({ userId, transactionId, ...data }: transactionMessagePackageCreateFx.Props) {
		yield* withTraceFx({
			fx: "transactionMessagePackageCreateFx",
			input: {
				userId,
				transactionId,
				data: "(redacted)",
			},
		});

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
					...data,
					userId,
					messageThreadId: transaction.messageThreadId,
				});
			}),
		);
	},
);

export type transactionMessagePackageCreateFx = ReturnType<
	typeof transactionMessagePackageCreateFx
>;
