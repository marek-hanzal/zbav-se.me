import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { messagePackageCreateFx } from "~/app/message-package/fx/messagePackageCreateFx";
import { TransactionContextFx } from "~/app/transaction/context/TransactionContextFx";
import { transactionStatusGateFx } from "~/app/transaction/fx/transactionStatusGateFx";
import { userInteractionEventFx } from "~/app/user-event/fx/userInteractionEventFx";
import type { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import type { TransactionMessagePackageCreateSchema } from "../schema/TransactionMessagePackageCreateSchema";

export namespace transactionMessagePackageCreateFx {
	export interface Props extends TransactionMessagePackageCreateSchema.Type {
		userId: string;
	}
}

export const transactionMessagePackageCreateFx = Effect.fn("transactionMessagePackageCreateFx")(
	function* ({ userId, transactionId, link, number }: transactionMessagePackageCreateFx.Props) {
		return yield* withTransactionFx(
			Effect.gen(function* () {
				const database = yield* DatabaseContextFx;
				const config = yield* TransactionContextFx;

				const transaction = yield* transactionStatusGateFx({
					userId,
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

type _NoUser = AssertNever<
	Extract<Effect.Effect.Context<transactionMessagePackageCreateFx>, UserContextFx>
>;
