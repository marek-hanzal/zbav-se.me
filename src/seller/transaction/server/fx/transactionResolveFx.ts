import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { getLoggerFx } from "@/lib/common/log";
import { transactionFetchFx } from "~/seller/transaction/server/fx/transactionFetchFx";
import { transactionPatchCollectionFx } from "~/seller/transaction/server/fx/transactionPatchCollectionFx";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { activityCreateFx } from "~/user/activity/server/fx/activityCreateFx";
import { transactionMessageActivityArchiveFx } from "~/user/transaction/server/fx/transactionMessageActivityArchiveFx";
import { transactionResolveFx as resolveTransactionFx } from "~/user/transaction/server/fx/transactionResolveFx";
import { transactionStatusMessageFx } from "~/user/transaction/server/fx/transactionStatusMessageFx";
import { transactionUpdateStatusFx } from "~/user/transaction/server/fx/transactionUpdateStatusFx";
import { userInteractionEventFx } from "~/user/user-event/server/fx/userInteractionEventFx";

export namespace transactionResolveFx {
	export interface Props {
		transactionId: string;
		userId: string;
	}
}

export const transactionResolveFx = Effect.fn("transactionResolveFx")(function* ({
	userId,
	transactionId,
}: transactionResolveFx.Props) {
	const logger = yield* getLoggerFx("transactionResolveFx");
	logger.trace("transactionResolveFx", {
		userId,
		transactionId,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const transaction = yield* resolveTransactionFx({
				userId,
				transactionId,
				message: "You are not allowed to resolve this listing transaction",
			});

			yield* transactionMessageActivityArchiveFx({
				listingId: transaction.listingId,
				transactionId: transaction.id,
				type: "buyer-message",
				userId,
			});

			const sold = yield* transactionPatchCollectionFx({
				patch: {
					status: "sold",
				},
				query: {
					where: {
						listingId: transaction.listingId,
						statusIn: [
							"interest",
							"trade",
						],
					},
				},
				scope: {
					userId,
				},
			});

			for (const transaction of sold) {
				if (transaction.id === transactionId) {
					continue;
				}
				yield* transactionStatusMessageFx({
					transactionId: transaction.id,
					request: "sold",
					target: "buyer",
					userId,
				});
			}

			yield* transactionUpdateStatusFx({
				transactionId: transaction.id,
				status: transaction.status,
				request: "resolved",
				target: "seller",
			});

			yield* transactionStatusMessageFx({
				transactionId: transaction.id,
				request: "resolved",
				target: "seller",
				userId,
			});

			const dateContext = yield* DateContextFx;
			const now = dateContext.now().toJSDate();

			yield* dbFx(async (kysely) => {
				return kysely
					.updateTable("listing")
					.set({
						status: "sold",
						updatedAt: now,
					})
					.where("id", "=", transaction.listingId)
					.executeTakeFirstOrThrow();
			});

			yield* activityCreateFx({
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

			yield* userInteractionEventFx({
				userId,
				targetId: transaction.buyerId,
				source: "transaction",
				group: transaction.id,
				event: "transaction.resolved",
				isTerminal: false,
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

export type transactionResolveFx = ReturnType<typeof transactionResolveFx>;
