import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import { TransactionContextFx } from "~/@common/transaction/context/TransactionContextFx";
import { galleryInsertFx } from "~/@user/gallery/fx/galleryInsertFx";
import { galleryItemInsertFx } from "~/@user/gallery-item/fx/galleryItemInsertFx";
import { inboxCreateFx } from "~/@user/inbox/fx/inboxCreateFx";
import { messageGalleryCreateFx } from "~/@user/message-gallery/fx/messageGalleryCreateFx";
import type { TransactionMessageGalleryCreateSchema } from "~/@user/transaction-message-gallery/schema/TransactionMessageGalleryCreateSchema";
import { transactionStatusGateFx } from "~/@user/transaction-status/fx/transactionStatusGateFx";
import { userInteractionEventFx } from "~/@user/user-event/fx/userInteractionEventFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { withTraceFx } from "~/effect/withTraceFx";
import { InvalidRequestErrorFx } from "~/error/InvalidRequestErrorFx";

export namespace transactionMessageGalleryCreateFx {
	export interface Props extends TransactionMessageGalleryCreateSchema.Type {
		userId: string;
	}
}

export const transactionMessageGalleryCreateFx = Effect.fn("transactionMessageGalleryCreateFx")(
	function* ({ userId, transactionId, uploadIds }: transactionMessageGalleryCreateFx.Props) {
		yield* withTraceFx({
			fx: "transactionMessageGalleryCreateFx",
			input: {
				userId,
				transactionId,
				uploadIds,
			},
		});

		return yield* withTransactionFx(
			Effect.gen(function* () {
				const { kysely } = yield* KyselyContextFx;
				const config = yield* TransactionContextFx;
				const dateContext = yield* DateContextFx;

				if (uploadIds.length === 0) {
					yield* withTraceFx({
						fx: "transactionMessageGalleryCreateFx",
						error: {
							message: "At least one upload is required",
						},
					});
					return yield* new InvalidRequestErrorFx({
						message: "At least one upload is required",
					});
				}

				const transaction = yield* transactionStatusGateFx({
					userId,
					transactionId,
					allowedStatuses: [
						"open",
						"dispute",
					],
				});

				const now = dateContext.now();

				yield* tryDbFx(async () =>
					kysely
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
						.executeTakeFirst(),
				);

				const gallery = yield* galleryInsertFx({
					userId,
				});

				yield* tryDbFx(async () =>
					kysely.deleteFrom("gallery_item").where("galleryId", "=", gallery.id).execute(),
				);

				let sort = 0;
				for (const uploadId of uploadIds) {
					yield* galleryItemInsertFx({
						galleryId: gallery.id,
						uploadId,
						sort,
						userId,
						check: false,
					});
					sort++;
				}

				yield* userInteractionEventFx({
					userId,
					targetId:
						transaction.side === "buyer" ? transaction.sellerId : transaction.buyerId,
					source: "transaction",
					group: transaction.id,
					event: "transaction.message",
					isTerminal: false,
				});

					yield* inboxCreateFx(
						transaction.side === "buyer"
							? {
									userId: transaction.sellerId,
									type: "buyer-message",
									payload: {
										type: "buyer-message",
										transactionId: transaction.id,
										messageThreadId: transaction.messageThreadId,
									},
									priority: "high",
								}
							: {
									userId: transaction.buyerId,
									type: "seller-message",
									payload: {
										type: "seller-message",
										transactionId: transaction.id,
										messageThreadId: transaction.messageThreadId,
									},
									priority: "high",
								},
					);

				return yield* messageGalleryCreateFx({
					userId,
					messageThreadId: transaction.messageThreadId,
					galleryId: gallery.id,
				});
			}),
		);
	},
);

export type transactionMessageGalleryCreateFx = ReturnType<
	typeof transactionMessageGalleryCreateFx
>;
