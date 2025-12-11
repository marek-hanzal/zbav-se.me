import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { messageTextFetchFx } from "~/@user/message-text/fx/messageFetchFx";
import { transactionPatchFx } from "~/@user/transaction/fx/transactionPatchFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { transactionStatusAcceptFx } from "~/@user/transaction-status/fx/transactionStatusAcceptFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace messageTextCreateFx {
	export interface Props {
		messageThreadId: string;
		message: string;
	}
}

export const messageTextCreateFx = ({ messageThreadId, message }: messageTextCreateFx.Props) => {
	return withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;

			const transaction = yield* transactionResolveFx({
				messageThreadId,
				message: "You are not allowed to create a message for this listing transaction",
			});

			if (transaction.side === "seller" && transaction.status === "request") {
				yield* transactionStatusAcceptFx({
					messageThreadId: transaction.messageThreadId,
				});
			}

			const id = genId();

			yield* Effect.tryPromise(async () => {
				return database
					.insertInto("message_text")
					.values({
						id,
						messageThreadId,
						text: message,
						side: transaction.side,
						createdAt: new Date(),
					})
					.returningAll()
					.executeTakeFirstOrThrow();
			});

			yield* transactionPatchFx({
				messageThreadId: transaction.messageThreadId,
			});

			return yield* messageTextFetchFx({
				query: {
					where: {
						id,
					},
				},
			});
		}),
	);
};

export type messageTextCreateFx = ReturnType<typeof messageTextCreateFx>;
