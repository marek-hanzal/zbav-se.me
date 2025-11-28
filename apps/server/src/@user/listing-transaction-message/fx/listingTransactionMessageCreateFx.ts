import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { listingTransactionPatchFx } from "../../../@user/listing-transaction/fx/listingTransactionPatchFx";
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
					message,
					side,
					createdAt: new Date(),
				})
				.returningAll()
				.executeTakeFirstOrThrow();
		});

		yield* listingTransactionPatchFx({
			listingTransactionId,
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
