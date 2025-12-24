import { Effect } from "effect";
import { DateTime } from "luxon";
import { messageGalleryCreateFx } from "~/@user/message-gallery/fx/messageGalleryCreateFx";
import { TransactionContextFx } from "~/@user/transaction/fx/TransactionContextFx";
import { transactionFetchFx } from "~/@user/transaction/fx/transactionFetchFx";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import type { TransactionMessageGalleryCreateSchema } from "../schema/TransactionMessageGalleryCreateSchema";

export namespace transactionMessageGalleryCreateFx {
	export interface Props extends TransactionMessageGalleryCreateSchema.Type {}
}

export const transactionMessageGalleryCreateFx = ({
	transactionId,
	galleryId,
}: transactionMessageGalleryCreateFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;
		const config = yield* TransactionContextFx;

		const transaction = yield* transactionFetchFx({
			where: {
				id: transactionId,
				userId: user.id,
			},
		});

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

		return yield* messageGalleryCreateFx({
			messageThreadId: transaction.messageThreadId,
			galleryId,
		});
	});
};

export type transactionMessageGalleryCreateFx = ReturnType<
	typeof transactionMessageGalleryCreateFx
>;
