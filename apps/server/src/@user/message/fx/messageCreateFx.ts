import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { messageFetchFx } from "~/@user/message/fx/messageFetchFx";
import { transactionPatchFx } from "~/@user/transaction/fx/transactionPatchFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { transactionStatusAcceptFx } from "~/@user/transaction-status/fx/transactionStatusAcceptFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace messageCreateFx {
	export interface Props {
		messageThreadId: string;
		message: string;
	}
}

export const messageCreateFx = ({ messageThreadId, message }: messageCreateFx.Props) => {
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
					.insertInto("message")
					.values({
						id,
						messageThreadId,
						message,
						side: transaction.side,
						createdAt: new Date(),
					})
					.returningAll()
					.executeTakeFirstOrThrow();
			});

			yield* transactionPatchFx({
				messageThreadId: transaction.messageThreadId,
			});

			return yield* messageFetchFx({
				query: {
					where: {
						id,
					},
				},
			});
		}),
	);
};

export type messageCreateFx = ReturnType<typeof messageCreateFx>;
