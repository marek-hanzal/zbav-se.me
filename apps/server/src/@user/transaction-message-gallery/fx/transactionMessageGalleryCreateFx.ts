import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import { TransactionContextFx } from "~/@common/transaction/context/TransactionContextFx";
import { galleryCreateFx } from "~/@user/gallery/fx/galleryCreateFx";
import { galleryItemCreateFx } from "~/@user/gallery-item/fx/galleryItemCreateFx";
import { messageGalleryCreateFx } from "~/@user/message-gallery/fx/messageGalleryCreateFx";
import type { TransactionMessageGalleryCreateSchema } from "~/@user/transaction-message-gallery/schema/TransactionMessageGalleryCreateSchema";
import { transactionStatusGateFx } from "~/@user/transaction-status/fx/transactionStatusGateFx";
import { userInteractionEventFx } from "~/@user/user-event/fx/userInteractionEventFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";

export namespace transactionMessageGalleryCreateFx {
	export interface Props extends TransactionMessageGalleryCreateSchema.Type {
		userId: string;
	}
}

export const transactionMessageGalleryCreateFx = Effect.fn("transactionMessageGalleryCreateFx")(
	function* ({ userId, transactionId, uploadIds }: transactionMessageGalleryCreateFx.Props) {
		return yield* withTransactionFx(
			Effect.gen(function* () {
				const { kysely } = yield* KyselyContextFx;
				const config = yield* TransactionContextFx;
				const dateContext = yield* DateContextFx;

				if (uploadIds.length === 0) {
					return yield* new InvalidRequestError({
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

				const gallery = yield* galleryCreateFx({
					userId,
				});

				yield* Effect.promise(async () => {
					return kysely
						.deleteFrom("gallery_item")
						.where("galleryId", "=", gallery.id)
						.execute();
				});

				let sort = 0;
				for (const uploadId of uploadIds) {
					yield* galleryItemCreateFx({
						galleryId: gallery.id,
						uploadId,
						sort,
						userId,
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
