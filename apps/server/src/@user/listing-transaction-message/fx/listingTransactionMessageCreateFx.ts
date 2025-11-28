import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { listingTransactionPatchFx } from "~/@user/listing-transaction/fx/listingTransactionPatchFx";
import { listingTransactionResolveFx } from "~/@user/listing-transaction/fx/listingTransactionResolveFx";
import { listingTransactionMessageFetchFx } from "~/@user/listing-transaction-message/fx/listingTransactionMessageFetchFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";

export namespace listingTransactionMessageCreateFx {
	export interface Props {
		listingTransactionId: string;
		message: string;
	}
}

export const listingTransactionMessageCreateFx = ({
	listingTransactionId,
	message,
}: listingTransactionMessageCreateFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const transaction = yield* listingTransactionResolveFx({
			listingTransactionId,
			message: "You are not allowed to create a message for this listing transaction",
		});

		if (transaction.status !== "accepted") {
			return yield* new InvalidRequestError({
				message: "You are not allowed to create a message for this listing transaction",
			});
		}

		const id = genId();

		yield* Effect.tryPromise(async () => {
			return database
				.insertInto("listing_transaction_message")
				.values({
					id,
					listingTransactionId: transaction.listingTransactionId,
					message,
					side: transaction.side,
					createdAt: new Date(),
				})
				.returningAll()
				.executeTakeFirstOrThrow();
		});

		yield* listingTransactionPatchFx({
			listingTransactionId: transaction.listingTransactionId,
		});

		return yield* listingTransactionMessageFetchFx({
			query: {
				where: {
					id,
				},
			},
		});
	});
};

export type listingTransactionMessageCreateFx = ReturnType<
	typeof listingTransactionMessageCreateFx
>;
