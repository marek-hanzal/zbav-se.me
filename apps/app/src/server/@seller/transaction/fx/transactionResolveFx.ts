import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import { transactionFetchFx } from "~/server/@seller/transaction/fx/transactionFetchFx";
import { transactionPatchCollectionFx } from "~/server/@seller/transaction/fx/transactionPatchCollectionFx";
import { inboxCreateFx } from "~/server/@user/inbox/fx/inboxCreateFx";
import { transactionResolveFx as resolveTransactionFx } from "~/server/@user/transaction/fx/transactionResolveFx";
import { transactionStatusMessageFx } from "~/server/@user/transaction/fx/transactionStatusMessageFx";
import { transactionUpdateStatusFx } from "~/server/@user/transaction/fx/transactionUpdateStatusFx";
import { userInteractionEventFx } from "~/server/@user/user-event/fx/userInteractionEventFx";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

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
