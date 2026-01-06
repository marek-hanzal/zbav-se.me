import { Effect } from "effect";
import { DateTime } from "luxon";
import { galleryCreateFx } from "~/@user/gallery/fx/galleryCreateFx";
import { galleryItemCreateFx } from "~/@user/gallery-item/fx/galleryItemCreateFx";
import { messageGalleryCreateFx } from "~/@user/message-gallery/fx/messageGalleryCreateFx";
import { TransactionContextFx } from "~/@user/transaction/fx/TransactionContextFx";
import { transactionStatusGateFx } from "~/@user/transaction/fx/transactionStatusGateFx";
import { userInteractionEventFx } from "~/@user/user-event/fx/userInteractionEventFx";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";
import type { TransactionMessageGalleryCreateSchema } from "../schema/TransactionMessageGalleryCreateSchema";

export namespace transactionMessageGalleryCreateFx {
	export interface Props extends TransactionMessageGalleryCreateSchema.Type {
		createdAt?: DateTime;
	}
}

export const transactionMessageGalleryCreateFx = Effect.fn("transactionMessageGalleryCreateFx")(
	function* ({ transactionId, uploadIds, createdAt }: transactionMessageGalleryCreateFx.Props) {
		return yield* withTransactionFx(
			Effect.gen(function* () {
				const database = yield* DatabaseContextFx;
				const user = yield* UserContextFx;
				const config = yield* TransactionContextFx;

				if (uploadIds.length === 0) {
					return yield* new InvalidRequestError({
						message: "At least one upload is required",
					});
				}

				const transaction = yield* transactionStatusGateFx({
					transactionId,
					allowedStatuses: [
						"open",
						"dispute",
					],
				});

				const now = createdAt ?? DateTime.now();

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

				const gallery = yield* galleryCreateFx({
					userId: user.id,
				});

				yield* Effect.promise(async () => {
					return database
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
						createdAt,
					});
					sort++;
				}

				yield* userInteractionEventFx({
					userId: user.id,
					targetId:
						transaction.side === "buyer" ? transaction.sellerId : transaction.buyerId,
					source: "transaction",
					group: transaction.id,
					event: "transaction.message",
					isTerminal: false,
					createdAt,
				});

				return yield* messageGalleryCreateFx({
					messageThreadId: transaction.messageThreadId,
					galleryId: gallery.id,
					createdAt,
				});
			}),
		);
	},
);

export type transactionMessageGalleryCreateFx = ReturnType<
	typeof transactionMessageGalleryCreateFx
>;
