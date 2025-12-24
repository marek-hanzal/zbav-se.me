import { Effect } from "effect";
import { DateTime } from "luxon";
import { galleryCreateFx } from "~/@user/gallery/fx/galleryCreateFx";
import { galleryItemCreateFx } from "~/@user/gallery-item/fx/galleryItemCreateFx";
import { messageGalleryCreateFx } from "~/@user/message-gallery/fx/messageGalleryCreateFx";
import { TransactionContextFx } from "~/@user/transaction/fx/TransactionContextFx";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";
import { NotFoundError } from "~/error/NotFoundError";
import type { TransactionMessageGalleryCreateSchema } from "../schema/TransactionMessageGalleryCreateSchema";

export namespace transactionMessageGalleryCreateFx {
	export interface Props extends TransactionMessageGalleryCreateSchema.Type {}
}

export const transactionMessageGalleryCreateFx = ({
	messageThreadId,
	uploadIds,
}: transactionMessageGalleryCreateFx.Props) => {
	return withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;
			const user = yield* UserContextFx;
			const config = yield* TransactionContextFx;

			if (uploadIds.length === 0) {
				return yield* new InvalidRequestError({
					message: "At least one upload is required",
				});
			}

			const transaction = yield* Effect.tryPromise(async () => {
				return database
					.selectFrom("transaction")
					.selectAll()
					.where("messageThreadId", "=", messageThreadId)
					.where("userId", "=", user.id)
					.executeTakeFirst();
			});

			if (!transaction) {
				return yield* new NotFoundError({
					resource: "transaction",
					resourceId: messageThreadId,
					message: "Transaction not found",
				});
			}

			const now = DateTime.now();

			yield* Effect.tryPromise(async () => {
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

			const gallery = yield* galleryCreateFx();

			yield* Effect.tryPromise(async () => {
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
				});
				sort++;
			}

			return yield* messageGalleryCreateFx({
				messageThreadId,
				galleryId: gallery.id,
			});
		}),
	);
};

export type transactionMessageGalleryCreateFx = ReturnType<
	typeof transactionMessageGalleryCreateFx
>;
