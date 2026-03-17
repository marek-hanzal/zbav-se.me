import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import { transactionFetchFx } from "~/@seller/transaction/fx/transactionFetchFx";
import { transactionPatchCollectionFx } from "~/@seller/transaction/fx/transactionPatchCollectionFx";
import { inboxCreateFx } from "~/@user/inbox/fx/inboxCreateFx";
import { transactionResolveFx as resolveTransactionFx } from "~/@user/transaction/fx/transactionResolveFx";
import { transactionStatusMessageFx } from "~/@user/transaction/fx/transactionStatusMessageFx";
import { transactionUpdateStatusFx } from "~/@user/transaction/fx/transactionUpdateStatusFx";
import { userInteractionEventFx } from "~/@user/user-event/fx/userInteractionEventFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

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
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const transaction = yield* resolveTransactionFx({
				userId,
				transactionId,
				message: "You are not allowed to resolve this listing transaction",
			});

			/**
			 * Order is important:
			 * - in here we'll mark all transactions on listing as "sold" (include current one)
			 * - later we'll properly update "current" transaction to "resolved" so the flow keeps properly going on
			 */
			const sold = yield* transactionPatchCollectionFx({
				patch: {
					status: "sold",
				},
				query: {
					filter: {
						listingId: transaction.listingId,
						statusIn: [
							"pending",
							"open",
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

			// Mark the listing itself as "sold"
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;
			const now = dateContext.now().toJSDate();

			yield* tryDbFx(async () =>
				kysely
					.updateTable("listing")
					.set({
						status: "sold",
						updatedAt: now,
					})
					.where("id", "=", transaction.listingId)
					.executeTakeFirstOrThrow(),
			);

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
