import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { transactionFetchFx } from "~/seller/transaction/server/fx/transactionFetchFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { inboxCreateFx } from "~/user/inbox/server/fx/inboxCreateFx";
import { transactionResolveFx } from "~/user/transaction/server/fx/transactionResolveFx";
import { transactionStatusMessageFx } from "~/user/transaction/server/fx/transactionStatusMessageFx";
import { transactionUpdateStatusFx } from "~/user/transaction/server/fx/transactionUpdateStatusFx";

export namespace transactionDisputeFx {
	export interface Props {
		transactionId: string;
		userId: string;
	}
}

export const transactionDisputeFx = Effect.fn("transactionDisputeFx")(function* ({
	userId,
	transactionId,
}: transactionDisputeFx.Props) {
	const logger = yield* getLoggerFx("transactionDisputeFx");
	logger.debug("transactionDisputeFx", {
		userId,
		transactionId,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const transaction = yield* transactionResolveFx({
				userId,
				transactionId,
				message: "You are not allowed to dispute this listing transaction",
			});

			yield* transactionUpdateStatusFx({
				transactionId: transaction.id,
				status: transaction.status,
				request: "dispute",
				target: "seller",
			});

			yield* transactionStatusMessageFx({
				transactionId: transaction.id,
				request: "dispute",
				target: "seller",
				userId,
			});

			yield* inboxCreateFx({
				userId: transaction.buyerId,
				reference: [
					transaction.listingId,
					transaction.id,
				],
				family: "transaction",
				type: "seller-message",
				payload: {
					transactionId: transaction.id,
				},
				priority: "high",
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

export type transactionDisputeFx = ReturnType<typeof transactionDisputeFx>;
