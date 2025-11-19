import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { ListingTransactionSideSchema } from "../../../app/listing-transaction/schema/ListingTransactionSideSchema";
import type { ListingTransactionStatusSchema } from "../../../app/listing-transaction/schema/ListingTransactionStatusSchema";
import { DatabaseContextFx } from "../../../fx/DatabaseContextFx";
import { listingTransactionLogFetchFx } from "./listingTransactionLogFetchFx";

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

		const id = genId();

		yield* Effect.tryPromise(async () => {
			return database
				.insertInto("listing_transaction_log")
				.values({
					id,
					listingTransactionId,
					status,
					side,
					createdAt,
				})
				.returningAll()
				.executeTakeFirstOrThrow();
		});

		return yield* listingTransactionLogFetchFx({
			query: {
				where: {
					id,
				},
			},
		});
	});
};

export type listingTransactionLogCreateFx = ReturnType<typeof listingTransactionLogCreateFx>;
