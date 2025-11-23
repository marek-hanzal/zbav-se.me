import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { listingTransactionStatusFetchFx } from "~/@user/listing-transaction-status/fx/listingTransactionStatusFetchFx";
import type { ListingTransactionSideEnumSchema } from "~/app/listing-transaction/schema/ListingTransactionSideEnumSchema";
import type { ListingTransactionStatusEnumSchema } from "~/app/listing-transaction/schema/ListingTransactionStatusEnumSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace listingTransactionStatusCreateFx {
	export interface Props {
		listingTransactionId: string;
		status: ListingTransactionStatusEnumSchema.Type;
		side: ListingTransactionSideEnumSchema.Type;
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
