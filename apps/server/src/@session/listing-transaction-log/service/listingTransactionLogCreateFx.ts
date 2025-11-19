import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { ListingTransactionSideSchema } from "../../../app/listing-transaction/schema/ListingTransactionSideSchema";
import type { ListingTransactionStatusSchema } from "../../../app/listing-transaction/schema/ListingTransactionStatusSchema";
import { DatabaseContextFx } from "../../../service/DatabaseContextFx";

export namespace listingTransactionLogCreateFx {
	export interface Props {
		listingTransactionId: string;
		status: ListingTransactionStatusSchema.Type;
		side: ListingTransactionSideSchema.Type;
		createdAt?: Date;
	}
}

export const listingTransactionLogCreateFx = ({
	listingTransactionId,
	status,
	side,
	createdAt = new Date(),
}: listingTransactionLogCreateFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		return yield* Effect.promise(async () => {
			return database
				.insertInto("listing_transaction_log")
				.values({
					id: genId(),
					listingTransactionId,
					status,
					side,
					createdAt,
				})
				.returningAll()
				.executeTakeFirstOrThrow();
		});
	});
};

export type listingTransactionLogCreateFx = ReturnType<typeof listingTransactionLogCreateFx>;
