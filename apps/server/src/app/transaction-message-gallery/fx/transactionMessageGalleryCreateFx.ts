import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { DateTime } from "luxon";
import type { TransactionMessageGalleryCreateSchema } from "~/@user/transaction-message-gallery/schema/TransactionMessageGalleryCreateSchema";
import { galleryCreateFx } from "~/app/gallery/fx/galleryCreateFx";
import { galleryItemCreateFx } from "~/app/gallery-item/fx/galleryItemCreateFx";
import { messageGalleryCreateFx } from "~/app/message-gallery/fx/messageGalleryCreateFx";
import { TransactionContextFx } from "~/app/transaction/context/TransactionContextFx";
import { transactionStatusGateFx } from "~/app/transaction/fx/transactionStatusGateFx";
import { userInteractionEventFx } from "~/app/user-event/fx/userInteractionEventFx";
import type { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";

export namespace transactionMessageGalleryCreateFx {
	export interface Props extends TransactionMessageGalleryCreateSchema.Type {
		userId: string;
		createdAt?: DateTime;
	}
}

export const transactionMessageGalleryCreateFx = Effect.fn("transactionMessageGalleryCreateFx")(
	function* ({
		userId,
		transactionId,
		uploadIds,
		createdAt,
	}: transactionMessageGalleryCreateFx.Props) {
		return yield* withTransactionFx(
			Effect.gen(function* () {
				const database = yield* DatabaseContextFx;
				const config = yield* TransactionContextFx;

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
					userId,
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
						userId,
						createdAt,
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
					createdAt,
				});

				return yield* messageGalleryCreateFx({
					userId,
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

type _NoUser = AssertNever<
	Extract<Effect.Effect.Context<transactionMessageGalleryCreateFx>, UserContextFx>
>;
