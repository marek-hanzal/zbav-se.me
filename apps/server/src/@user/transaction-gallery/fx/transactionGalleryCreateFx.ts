import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { galleryCreateFx as coolGalleryCreateFx } from "~/@user/gallery/fx/galleryCreateFx";
import { galleryItemCreateFx } from "~/@user/gallery-item/fx/galleryItemCreateFx";
import { transactionPatchFx } from "~/@user/transaction/fx/transactionPatchFx";
import { transactionResolveFx } from "~/@user/transaction/fx/transactionResolveFx";
import { transactionStatusAcceptFx } from "~/@user/transaction-status/fx/transactionStatusAcceptFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";
import { transactionGalleryFetchFx } from "./transactionGalleryFetchFx";

export namespace transactionGalleryCreateFx {
	export interface Props {
		messageThreadId: string;
		uploadIds: string[];
	}
}

export const transactionGalleryCreateFx = ({
	messageThreadId,
	uploadIds,
}: transactionGalleryCreateFx.Props) => {
	return withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;

			const transaction = yield* transactionResolveFx({
				messageThreadId,
				message: "You are not allowed to create a gallery for this listing transaction",
			});

			if (uploadIds.length === 0) {
				return yield* new InvalidRequestError({
					message: "At least one upload is required",
				});
			}

			if (transaction.side === "seller" && transaction.status === "request") {
				yield* transactionStatusAcceptFx({
					messageThreadId: transaction.messageThreadId,
				});
			}

			const gallery = yield* coolGalleryCreateFx();

			let sort = 0;
			for (const uploadId of uploadIds) {
				yield* galleryItemCreateFx({
					galleryId: gallery.id,
					uploadId,
					sort,
				});
				sort++;
			}

			const id = genId();

			yield* Effect.tryPromise(async () => {
				return database
					.insertInto("transaction_gallery")
					.values({
						id,
						messageThreadId: transaction.messageThreadId,
						galleryId: gallery.id,
						side: transaction.side,
						createdAt: new Date(),
					})
					.returningAll()
					.executeTakeFirstOrThrow();
			});

			yield* transactionPatchFx({
				messageThreadId: transaction.messageThreadId,
			});

			return yield* transactionGalleryFetchFx({
				query: {
					where: {
						id,
					},
				},
			});
		}),
	);
};

export type transactionGalleryCreateFx = ReturnType<
	typeof transactionGalleryCreateFx
>;
