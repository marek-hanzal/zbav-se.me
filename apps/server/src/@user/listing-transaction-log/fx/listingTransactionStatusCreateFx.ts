import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { listingTransactionStatusFetchFx } from "~/@user/listing-transaction-status/fx/listingTransactionStatusFetchFx";
import type { ListingTransactionSideSchema } from "~/app/listing-transaction/schema/ListingTransactionSideSchema";
import type { ListingTransactionStatusSchema } from "~/app/listing-transaction/schema/ListingTransactionStatusSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace listingTransactionStatusCreateFx {
	export interface Props {
		listingTransactionId: string;
		status: ListingTransactionStatusSchema.Type;
		side: ListingTransactionSideSchema.Type;
		createdAt?: Date;
	}
}

export const listingTransactionStatusCreateFx = ({
	listingTransactionId,
	status,
	side,
	createdAt = new Date(),
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
					createdAt,
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
