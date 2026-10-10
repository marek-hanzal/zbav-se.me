import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { transactionFetchFx } from "~/seller-transaction/fx/transactionFetchFx";
import { transactionPatchCollectionFx } from "~/seller-transaction/fx/transactionPatchCollectionFx";
import { activityCreateFx } from "~/user-activity/fx/activityCreateFx";
import { userInteractionEventFx } from "~/user-event/fx/userInteractionEventFx";
import { transactionMessageActivityArchiveFx } from "~/user-transaction/fx/transactionMessageActivityArchiveFx";
import { transactionResolveFx as resolveTransactionFx } from "~/user-transaction/fx/transactionResolveFx";
import { transactionStatusMessageFx } from "~/user-transaction/fx/transactionStatusMessageFx";
import { transactionUpdateStatusFx } from "~/user-transaction/fx/transactionUpdateStatusFx";

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

			const dateService = yield* DateServiceFx;
			const now = dateService.now().toJSDate();

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
