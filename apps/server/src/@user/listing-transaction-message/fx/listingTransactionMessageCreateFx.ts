import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { ListingTransactionSideEnumSchema } from "../../../app/listing-transaction/schema/ListingTransactionSideEnumSchema";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { listingTransactionMessageFetchFx } from "./listingTransactionMessageFetchFx";

export namespace listingTransactionMessageCreateFx {
	export interface Props {
		listingTransactionId: string;
		message: string;
		side: ListingTransactionSideEnumSchema.Type;
	}
}

export const listingTransactionMessageCreateFx = ({
	listingTransactionId,
	message,
	side,
}: listingTransactionMessageCreateFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const id = genId();

		yield* Effect.tryPromise(async () => {
			return database
				.insertInto("listing_transaction_message")
				.values({
					id,
					listingTransactionId,
					event: "message",
					message,
					side,
					createdAt: new Date(),
				})
				.returningAll()
				.executeTakeFirstOrThrow();
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
