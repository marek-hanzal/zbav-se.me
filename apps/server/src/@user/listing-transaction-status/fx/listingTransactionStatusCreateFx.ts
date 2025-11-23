import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { ListingTransactionSideSchema } from "../../../app/listing-transaction/schema/ListingTransactionSideSchema";
import type { ListingTransactionStatusSchema } from "../../../app/listing-transaction/schema/ListingTransactionStatusSchema";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { listingTransactionStatusFetchFx } from "./listingTransactionStatusFetchFx";

export namespace listingTransactionStatusCreateFx {
	export interface Props {
		listingTransactionId: string;
		status: ListingTransactionStatusSchema.Type;
		side: ListingTransactionSideSchema.Type;
	}
}

export const listingTransactionStatusCreateFx = ({
	listingTransactionId,
	status,
	side,
}: listingTransactionStatusCreateFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const id = genId();

		yield* Effect.tryPromise(async () => {
			return database
				.insertInto("listing_transaction_status")
				.values({
					id,
					listingTransactionId,
					event: "status",
					status,
					side,
					createdAt: new Date(),
				})
				.returningAll()
				.executeTakeFirstOrThrow();
		});

		return yield* listingTransactionStatusFetchFx({
			query: {
				where: {
					id,
				},
			},
		});
	});
};

export type listingTransactionStatusCreateFx = ReturnType<typeof listingTransactionStatusCreateFx>;
